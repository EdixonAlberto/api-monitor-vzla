type TEnv = 'development' | 'production'

type TQty = number | 'last' | 'all'

type TCurrency = {
  symbol: string
  amount: number
  trend: {
    label: string
    emoji: string
    amount: number
    percentage: string
  }
}

type TPayload = { clientId: string; query: import('@MODULES/prices/dto').QueryPriceDto }

type TClient = Map<
  string,
  {
    id: string
    channels: TChannel[]
  }
>

type TChannel = {
  query: import('@MODULES/prices/dto').QueryPriceDto
  event: string
}

type TServiceResponse = {
  response: Array<{
    name: string
    updated: boolean
  }> | null
  error: string | null
}
