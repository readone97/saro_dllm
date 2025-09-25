import { useState, useEffect, useMemo, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { fetchPoolPositions, fetchBinPositions, getTokenPrice, fetchAllPositions } from '../services/dlmmApi'
import { Position, PoolPosition } from '../types/dlmm'
import { toast } from 'react-hot-toast'

export type summaryType = {
  totalValue: number;
  totalPnl: number;
  totalPositions: number;
  totalFees: number;
  avgPnlPercentage: number;
};

export type EnrichedPosition = Position & { 
  totalValue: number; 
  pnl: number; 
  pnlPercentage: number;
  tokenValues: number[];
  poolName?: string;
  lastUpdated: Date;
};

export const usePositions = () => {
  const { publicKey } = useWallet()
  const [positions, setPositions] = useState<EnrichedPosition[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null)

  const fetchPositions = useCallback(async (retries = 3): Promise<void> => {
    if (!publicKey) {
      setPositions([])
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      toast.loading('Fetching your Saros DLMM positions...', { id: 'fetch-positions' })
      
      // Use the new fetchAllPositions function that follows Saros DLMM API documentation
      const { poolPositions, binPositions, success } = await fetchAllPositions(publicKey.toString())

      if (!success) {
        throw new Error('Failed to fetch positions from Saros API')
      }

      // Merge pool and bin data according to Saros DLMM structure
      // Pool positions contain aggregated data, bin positions contain granular details
      const merged = poolPositions.flatMap(pool => {
        // Find all bin positions that belong to this pool
        const poolBins = binPositions.filter(bin => 
          String(bin.pool) === String(pool.poolId) || 
          String(bin.pool) === pool.poolId
        )

        // If no specific bins found, create a summary position from pool data
        if (poolBins.length === 0) {
          return [{
            id: `pool_${pool.poolId}`,
            pool: pool.poolId,
            lowerBinId: 0,
            upperBinId: 0,
            totalValue: 0, // Will be calculated
            pnl: 0, // Will be calculated
            liquidityShares: [pool.totalLiquidity],
            tokens: pool.totalTokens,
            fees: 0,
            poolName: `Pool ${pool.poolId.slice(0, 8)}...`,
            totalTokens: pool.totalTokens
          }]
        }

        // Map bin positions to enriched positions
        return poolBins.map(bin => ({
          ...bin,
          totalTokens: pool.totalTokens,
          poolName: `Pool ${pool.poolId.slice(0, 8)}...`,
          poolId: pool.poolId
        }))
      })

      if (merged.length === 0) {
        setPositions([])
        toast.success('No DLMM positions found', { id: 'fetch-positions' })
        setLastFetchTime(new Date())
        return
      }

      // Enrich with prices and calculate P&L based on Saros DLMM data structure
      const enriched = await Promise.all(
        merged.map(async (pos, index) => {
          try {
            // Fetch prices for all tokens in the position
            const prices = await Promise.all(
              pos.tokens.map(t => getTokenPrice(t.mint))
            )
            
            // Calculate token values
            const tokenValues = pos.tokens.map((t, i) => t.amount * (prices[i] || 0))
            const totalValue = tokenValues.reduce((a, b) => a + b, 0)
            
            // Calculate P&L based on Saros DLMM structure
            // For DLMM, P&L is typically calculated as current value vs initial liquidity
            const liquidityValue = pos.liquidityShares.reduce((a, b) => a + b, 0)
            const pnl = totalValue - liquidityValue
            const pnlPercentage = liquidityValue > 0 ? (pnl / liquidityValue) * 100 : 0

            return { 
              ...pos, 
              tokenValues, 
              totalValue, 
              pnl,
              pnlPercentage,
              lastUpdated: new Date()
            }
          } catch (priceError) {
            console.warn(`Failed to fetch price for position ${index}:`, priceError)
            // Return position with zero values if price fetch fails
            return {
              ...pos,
              tokenValues: pos.tokens.map(() => 0),
              totalValue: 0,
              pnl: 0,
              pnlPercentage: 0,
              lastUpdated: new Date()
            }
          }
        })
      )

      setPositions(enriched)
      setLastFetchTime(new Date())
      toast.success(`Loaded ${enriched.length} Saros DLMM positions successfully`, { id: 'fetch-positions' })
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Error fetching Saros DLMM positions:', err)
      
      if (retries > 0) {
        toast.error(`Retrying... (${retries} attempts left)`, { id: 'fetch-positions' })
        setTimeout(() => fetchPositions(retries - 1), 2000)
      } else {
        setError(errorMessage)
        toast.error(`Failed to load Saros DLMM positions: ${errorMessage}`, { id: 'fetch-positions' })
      }
    } finally {
      setLoading(false)
    }
  }, [publicKey])

  // Auto-refresh every 30 seconds when wallet is connected
  useEffect(() => {
    if (!publicKey) return

    const interval = setInterval(() => {
      fetchPositions(1) // Only retry once for auto-refresh
    }, 30000)

    return () => clearInterval(interval)
  }, [publicKey, fetchPositions])

  useEffect(() => {
    if (publicKey) {
      fetchPositions()
    } else {
      setPositions([])
      setError(null)
      setLastFetchTime(null)
    }
  }, [publicKey, fetchPositions])

  const summary = useMemo((): summaryType => {
    const totalValue = positions.reduce((sum, p) => sum + p.totalValue, 0)
    const totalPnl = positions.reduce((sum, p) => sum + p.pnl, 0)
    const totalFees = positions.reduce((sum, p) => sum + p.fees, 0)
    const totalPositions = positions.length
    
    // Calculate average P&L percentage
    const avgPnlPercentage = positions.length > 0 
      ? positions.reduce((sum, p) => sum + p.pnlPercentage, 0) / positions.length 
      : 0

    return {
      totalValue,
      totalPnl,
      totalPositions,
      totalFees,
      avgPnlPercentage
    }
  }, [positions])

  const refetch = useCallback(() => {
    fetchPositions()
  }, [fetchPositions])

  return { 
    positions, 
    loading, 
    error, 
    summary, 
    refetch,
    lastFetchTime
  }
}