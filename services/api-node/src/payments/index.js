import { MonnifyAdapter } from './monnify.js'
import { VerveAdapter } from './verve.js'

export function getPaymentAdapter(provider) {
  const enabled = {
    monnify: process.env.ENABLE_MONNIFY !== 'false',
    verve: process.env.ENABLE_VERVE !== 'false'
  }
  if (!enabled[provider]) throw new Error(`${provider} disabled`)
  if (provider === 'monnify') return new MonnifyAdapter()
  if (provider === 'verve') return new VerveAdapter()
  throw new Error('unsupported provider')
}
