import 'dotenv/config'
import express from 'express'
import { v4 as uuid } from 'uuid'
import swaggerUi from 'swagger-ui-express'
import { parse } from 'yaml'
import fs from 'node:fs'
import { auth, signToken } from './auth.js'
import { db } from './store.js'
import { getPaymentAdapter } from './payments/index.js'
import { publishKafka, enqueueJob } from './events.js'
import { saveAudit, saveClickhouseEvent, upsertMerchant } from './data.js'

const app = express()
app.use(express.json())

const openapi = parse(fs.readFileSync(new URL('./openapi.yaml', import.meta.url), 'utf8'))
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi))

app.get('/health', (_, res) => res.json({ status: 'ok', service: 'api-node' }))

app.post('/auth/login', (req, res) => {
  const { email, role = 'merchant' } = req.body
  if (!email) return res.status(400).json({ error: 'email required' })
  const user = { id: uuid(), email, role }
  db.users.push(user)
  return res.json({ token: signToken(user), user })
})

app.post('/merchants', auth('merchant'), async (req, res) => {
  const merchant = { id: uuid(), name: req.body.name || 'Unnamed Merchant' }
  db.merchants.push(merchant)
  await upsertMerchant(merchant)
  const event = { type: 'merchant.created', merchant, at: new Date().toISOString() }
  await saveAudit(event)
  await saveClickhouseEvent(event)
  res.status(201).json(merchant)
})

app.post('/terminals', auth('merchant'), (req, res) => {
  const terminal = { id: uuid(), merchantId: req.body.merchantId, label: req.body.label || 'default-terminal' }
  db.terminals.push(terminal)
  res.status(201).json(terminal)
})

app.post('/products', auth('merchant'), (req, res) => {
  const product = { id: uuid(), merchantId: req.body.merchantId, name: req.body.name, price: Number(req.body.price || 0) }
  db.products.push(product)
  res.status(201).json(product)
})

app.post('/sales', auth('merchant'), async (req, res) => {
  const sale = { id: uuid(), merchantId: req.body.merchantId, amount: Number(req.body.amount || 0), status: 'pending' }
  db.sales.push(sale)
  const adapter = getPaymentAdapter(req.body.provider || 'monnify')
  const paymentRequest = adapter.createPaymentRequest({ saleId: sale.id, amount: sale.amount })
  await publishKafka('transaction.lifecycle', { event: 'sale.created', sale, paymentRequest })
  await enqueueJob({ type: 'settlement', saleId: sale.id })
  const event = { type: 'sale.created', sale, at: new Date().toISOString() }
  await saveAudit(event)
  await saveClickhouseEvent(event)
  res.status(201).json({ sale, paymentRequest })
})

app.post('/webhooks/:provider', async (req, res) => {
  const adapter = getPaymentAdapter(req.params.provider)
  const signature = req.headers['x-signature']
  if (!adapter.verifyWebhookSignature(signature, req.body)) {
    return res.status(401).json({ error: 'invalid signature' })
  }
  const event = { type: 'webhook.received', provider: req.params.provider, body: req.body, at: new Date().toISOString() }
  await publishKafka('transaction.lifecycle', { event: 'payment.webhook', provider: req.params.provider, body: req.body })
  await saveAudit(event)
  await saveClickhouseEvent(event)
  res.json({ received: true })
})

const port = process.env.PORT || 4000
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`api-node listening on ${port}`))
}

export default app
