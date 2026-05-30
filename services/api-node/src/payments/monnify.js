import { PaymentAdapter } from './adapter.js'

export class MonnifyAdapter extends PaymentAdapter {
  createPaymentRequest({ saleId, amount }) {
    return { provider: 'monnify', saleId, amount, paymentRef: `MON-${saleId}` }
  }
}
