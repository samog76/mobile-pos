import { PaymentAdapter } from './adapter.js'

export class VerveAdapter extends PaymentAdapter {
  createPaymentRequest({ saleId, amount }) {
    return { provider: 'verve', saleId, amount, paymentRef: `VER-${saleId}` }
  }
}
