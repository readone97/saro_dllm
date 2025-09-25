export interface Token {
  mint: string
  symbol: string
  amount: number
  decimals?: number
}

export interface Position {
  id: number | string
  pool: number | string
  lowerBinId: number
  upperBinId: number
  totalValue?: number
  pnl?: number
  liquidityShares: number[]
  tokens: Token[]
  fees: number
  poolName?: string
  poolId?: string
  totalTokens?: Token[]
}

export interface PoolPosition {
  poolId: string
  totalLiquidity: number
  totalTokens: Token[]
  positions?: Position[]
  pairId?: string
  tokenX?: Token
  tokenY?: Token
  fee?: number
  protocolFee?: number
}

// Saros DLMM specific types based on API documentation
export interface SarosBinPosition {
  id: number
  pool: number
  lowerBinId: number
  upperBinId: number
  liquidityShares: number[]
  tokens: Token[]
  fees: number
  priceRange?: {
    lower: number
    upper: number
  }
  isActive?: boolean
}

export interface SarosPoolPosition {
  poolId: string
  pairId: string
  totalLiquidity: number
  totalTokens: Token[]
  tokenX: Token
  tokenY: Token
  fee: number
  protocolFee: number
  activeBinId?: number
  price?: number
}

