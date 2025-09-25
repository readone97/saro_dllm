import axios, { AxiosError } from 'axios'
import { toast } from 'react-hot-toast'
import { Position, PoolPosition } from '../types/dlmm'

// Mock data for development when API is not available
const MOCK_POOL_POSITIONS: PoolPosition[] = [
  {
    poolId: 'pool_123456789',
    totalLiquidity: 10000,
    totalTokens: [
      { mint: 'So11111111111111111111111111111111111111112', symbol: 'SOL', amount: 50 },
      { mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', symbol: 'USDC', amount: 2000 }
    ],
    positions: []
  },
  {
    poolId: 'pool_987654321',
    totalLiquidity: 5000,
    totalTokens: [
      { mint: 'So11111111111111111111111111111111111111112', symbol: 'SOL', amount: 25 },
      { mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', symbol: 'USDT', amount: 1000 }
    ],
    positions: []
  }
]

const MOCK_BIN_POSITIONS: Position[] = [
  {
    id: 1,
    pool: 123456789,
    lowerBinId: 100,
    upperBinId: 200,
    totalValue: 2500,
    pnl: 125,
    liquidityShares: [1000, 1500],
    tokens: [
      { mint: 'So11111111111111111111111111111111111111112', symbol: 'SOL', amount: 25 },
      { mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', symbol: 'USDC', amount: 1000 }
    ],
    fees: 12.5
  },
  {
    id: 2,
    pool: 987654321,
    lowerBinId: 150,
    upperBinId: 250,
    totalValue: 1200,
    pnl: -50,
    liquidityShares: [600, 600],
    tokens: [
      { mint: 'So11111111111111111111111111111111111111112', symbol: 'SOL', amount: 12 },
      { mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', symbol: 'USDT', amount: 500 }
    ],
    fees: 6.0
  }
]

// Saros DLMM API Configuration
const SAROS_API_BASE = 'https://api.saros.finance' // Updated to use official Saros API
const USE_MOCK_DATA = true // Set to false when real API is available

const axiosInstance = axios.create({
  baseURL: SAROS_API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.code === 'ECONNABORTED') {
      console.warn('Request timeout. Using mock data.')
    } else if (error.code === 'ERR_NETWORK') {
      console.warn('Network error. Using mock data.')
    } else if (error.response?.status === 404) {
      console.warn('API endpoint not found. Using mock data.')
    }
    return Promise.reject(error)
  }
)

/**
 * Fetch pool-level positions from Saros DLMM API
 * Based on: https://docs.saros.xyz/saros-dlmm/technical-guides/user-position
 */
export const fetchPoolPositions = async (userId: string, pairId?: string): Promise<PoolPosition[]> => {
  if (USE_MOCK_DATA) {
    console.log('Using mock pool positions data')
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    return MOCK_POOL_POSITIONS
  }

  try {
    const params = new URLSearchParams({
      user_id: userId,
      page_num: '1',
      page_size: '100',
    })

    if (pairId) {
      params.append('pair_id', pairId)
    }

    console.log('Fetching pool positions from Saros API:', `${SAROS_API_BASE}/api/pool-position?${params.toString()}`)
    
    const { data } = await axiosInstance.get(`/api/pool-position?${params.toString()}`)
    
    console.log('Pool positions response:', data)
    return data as PoolPosition[]
  } catch (error) {
    console.error('Error fetching pool positions from Saros API:', error)
    console.log('Falling back to mock data')
    toast.error('Saros API unavailable. Using demo data.')
    return MOCK_POOL_POSITIONS
  }
}

/**
 * Fetch bin-level positions from Saros DLMM API
 * Based on: https://docs.saros.xyz/saros-dlmm/technical-guides/user-position
 */
export const fetchBinPositions = async (userId: string, pairId?: string): Promise<Position[]> => {
  if (USE_MOCK_DATA) {
    console.log('Using mock bin positions data')
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    return MOCK_BIN_POSITIONS
  }

  try {
    const params = new URLSearchParams({
      user_id: userId,
      page_num: '1',
      page_size: '100',
    })

    if (pairId) {
      params.append('pair_id', pairId)
    }

    console.log('Fetching bin positions from Saros API:', `${SAROS_API_BASE}/api/bin-position?${params.toString()}`)
    
    const { data } = await axiosInstance.get(`/api/bin-position?${params.toString()}`)
    
    console.log('Bin positions response:', data)
    return data as Position[]
  } catch (error) {
    console.error('Error fetching bin positions from Saros API:', error)
    console.log('Falling back to mock data')
    toast.error('Saros API unavailable. Using demo data.')
    return MOCK_BIN_POSITIONS
  }
}

/**
 * Fetch token prices from Birdeye API
 */
export const getTokenPrice = async (mint: string): Promise<number> => {
  // Mock prices for demo
  const mockPrices: { [key: string]: number } = {
    'So11111111111111111111111111111111111111112': 100, // SOL
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 1, // USDC
    'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 1, // USDT
  }

  if (USE_MOCK_DATA) {
    return mockPrices[mint] || 0
  }

  try {
    const { data } = await axios.get(`https://public-api.birdeye.so/defi/price?address=${mint}`)
    return data.data.value || 0
  } catch (error) {
    console.error('Error fetching price for mint', mint, error)
    return mockPrices[mint] || 0 // Fallback to mock price
  }
}

/**
 * Fetch both pool and bin positions in parallel
 * This is the recommended approach for getting complete position data
 */
export const fetchAllPositions = async (userId: string, pairId?: string) => {
  try {
    const [poolPositions, binPositions] = await Promise.all([
      fetchPoolPositions(userId, pairId),
      fetchBinPositions(userId, pairId)
    ])

    return {
      poolPositions,
      binPositions,
      success: true
    }
  } catch (error) {
    console.error('Error fetching all positions:', error)
    return {
      poolPositions: MOCK_POOL_POSITIONS,
      binPositions: MOCK_BIN_POSITIONS,
      success: false
    }
  }
}