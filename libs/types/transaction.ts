export type TransactionLifecycleEvent = {
  id: string
  merchantId: string
  amount: number
  provider: 'monnify' | 'verve'
  status: 'pending' | 'authorized' | 'settled' | 'failed'
}
