import test from 'node:test'
import assert from 'node:assert/strict'
import { getPaymentAdapter } from '../src/payments/index.js'

test('monnify adapter builds payment request', () => {
  const adapter = getPaymentAdapter('monnify')
  const result = adapter.createPaymentRequest({ saleId: '123', amount: 400 })
  assert.equal(result.provider, 'monnify')
  assert.equal(result.paymentRef, 'MON-123')
})

test('verve adapter builds payment request', () => {
  const adapter = getPaymentAdapter('verve')
  const result = adapter.createPaymentRequest({ saleId: 'xyz', amount: 1200 })
  assert.equal(result.provider, 'verve')
  assert.equal(result.paymentRef, 'VER-xyz')
})
