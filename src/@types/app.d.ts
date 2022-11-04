type TEnv = 'development' | 'production'

type TQty = number | 'last' | 'all'

type TCurrencie = {
  symbol: string
  amount: number
  trend: {
    label: string
    emoji: string
    amount: number
    percentage: string
  }
}
