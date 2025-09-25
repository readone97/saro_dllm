import { useState, useMemo } from 'react'
import { EnrichedPosition } from '../hooks/usePositions'
import { toast } from 'react-hot-toast'
import { ArrowUpDown, ArrowUp, ArrowDown, Copy, CheckCircle } from 'lucide-react'

interface Props {
  positions: EnrichedPosition[]
  loading: boolean
}

type SortField = 'pool' | 'totalValue' | 'pnl' | 'pnlPercentage' | 'fees' | 'lastUpdated'

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-4">
      <div className="h-4 bg-dark-700 rounded w-24"></div>
    </td>
    <td className="px-4 py-4">
      <div className="h-4 bg-dark-700 rounded w-32"></div>
    </td>
    <td className="px-4 py-4">
      <div className="h-4 bg-dark-700 rounded w-20"></div>
    </td>
    <td className="px-4 py-4">
      <div className="h-4 bg-dark-700 rounded w-24"></div>
    </td>
    <td className="px-4 py-4">
      <div className="h-4 bg-dark-700 rounded w-16"></div>
    </td>
    <td className="px-4 py-4">
      <div className="h-4 bg-dark-700 rounded w-20"></div>
    </td>
    <td className="px-4 py-4">
      <div className="h-4 bg-dark-700 rounded w-16"></div>
    </td>
  </tr>
)

export const PositionsTable = ({ positions, loading }: Props) => {
  const [sortBy, setSortBy] = useState<SortField>('totalValue')
  const [sortDesc, setSortDesc] = useState(true)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const sortedPositions = useMemo(() => {
    return [...positions].sort((a, b) => {
      let aVal: number | string
      let bVal: number | string

      switch (sortBy) {
        case 'pool':
          aVal = a.poolName || `Pool ${a.pool}`
          bVal = b.poolName || `Pool ${b.pool}`
          break
        case 'totalValue':
          aVal = a.totalValue
          bVal = b.totalValue
          break
        case 'pnl':
          aVal = a.pnl
          bVal = b.pnl
          break
        case 'pnlPercentage':
          aVal = a.pnlPercentage
          bVal = b.pnlPercentage
          break
        case 'fees':
          aVal = a.fees
          bVal = b.fees
          break
        case 'lastUpdated':
          aVal = a.lastUpdated.getTime()
          bVal = b.lastUpdated.getTime()
          break
        default:
          aVal = a.totalValue
          bVal = b.totalValue
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDesc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal)
      }

      return sortDesc ? (bVal as number) - (aVal as number) : (aVal as number) - (bVal as number)
    })
  }, [positions, sortBy, sortDesc])

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDesc(!sortDesc)
    } else {
      setSortBy(field)
      setSortDesc(true)
    }
  }

  const copyToClipboard = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      toast.error('Failed to copy')
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="table-header">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Pool</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Tokens</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Liquidity</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">P&L</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Fees</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700/50">
              {Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (positions.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="text-dark-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-dark-200 mb-2">No positions found</h3>
        <p className="text-dark-400">Connect your wallet and add liquidity to DLMM pools to get started!</p>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-dark-700/50">
        <h2 className="text-lg font-semibold text-dark-100">Your Positions</h2>
        <p className="text-sm text-dark-400 mt-1">{positions.length} position{positions.length !== 1 ? 's' : ''} found</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="table-header">
            <tr>
              <th 
                className="px-2 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-dark-700/30 transition-colors"
                onClick={() => handleSort('pool')}
              >
                <div className="flex items-center gap-1">
                  <span className="hidden sm:inline">Pool</span>
                  <span className="sm:hidden">P</span>
                  {sortBy === 'pool' ? (
                    sortDesc ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-50" />
                  )}
                </div>
              </th>
              <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                <span className="hidden sm:inline">Tokens</span>
                <span className="sm:hidden">T</span>
              </th>
              <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                <span className="hidden sm:inline">Liquidity</span>
                <span className="sm:hidden">L</span>
              </th>
              <th 
                className="px-2 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-dark-700/30 transition-colors"
                onClick={() => handleSort('totalValue')}
              >
                <div className="flex items-center gap-1">
                  <span className="hidden sm:inline">Value</span>
                  <span className="sm:hidden">V</span>
                  {sortBy === 'totalValue' ? (
                    sortDesc ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-50" />
                  )}
                </div>
              </th>
              <th 
                className="px-2 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-dark-700/30 transition-colors"
                onClick={() => handleSort('pnlPercentage')}
              >
                <div className="flex items-center gap-1">
                  <span className="hidden sm:inline">P&L</span>
                  <span className="sm:hidden">P&L</span>
                  {sortBy === 'pnlPercentage' ? (
                    sortDesc ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-50" />
                  )}
                </div>
              </th>
              <th 
                className="px-2 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-dark-700/30 transition-colors"
                onClick={() => handleSort('fees')}
              >
                <div className="flex items-center gap-1">
                  <span className="hidden sm:inline">Fees</span>
                  <span className="sm:hidden">F</span>
                  {sortBy === 'fees' ? (
                    sortDesc ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-50" />
                  )}
                </div>
              </th>
              <th 
                className="px-2 sm:px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-dark-700/30 transition-colors"
                onClick={() => handleSort('lastUpdated')}
              >
                <div className="flex items-center gap-1">
                  <span className="hidden sm:inline">Updated</span>
                  <span className="sm:hidden">U</span>
                  {sortBy === 'lastUpdated' ? (
                    sortDesc ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-50" />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700/50">
            {sortedPositions.map((pos, i) => (
              <tr key={i} className="table-row group">
                <td className="px-2 sm:px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-dark-100 font-medium text-sm sm:text-base">
                      {pos.poolName || `Pool ${pos.pool}`}
                    </span>
                    <button
                      onClick={() => copyToClipboard(pos.pool.toString(), typeof pos.id === 'string' ? parseInt(pos.id) : pos.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-dark-700/50 rounded"
                    >
                      {copiedId === pos.id ? (
                        <CheckCircle className="w-3 h-3 text-success-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-dark-400" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-2 sm:px-4 py-4">
                  <div className="space-y-1">
                    {pos.tokens.map((token, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-dark-200">{token.symbol}</span>
                        <span className="text-dark-400">{token.amount.toFixed(4)}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-2 sm:px-4 py-4">
                  <span className="text-dark-200 text-sm sm:text-base">
                    {pos.liquidityShares.reduce((a, b) => a + b, 0).toFixed(2)}
                  </span>
                </td>
                <td className="px-2 sm:px-4 py-4">
                  <span className="text-dark-100 font-medium text-sm sm:text-base">
                    {formatCurrency(pos.totalValue)}
                  </span>
                </td>
                <td className="px-2 sm:px-4 py-4">
                  <div className="flex flex-col">
                    <span className={`font-medium text-sm sm:text-base ${
                      pos.pnl >= 0 ? 'text-success-400' : 'text-danger-400'
                    }`}>
                      {formatCurrency(pos.pnl)}
                    </span>
                    <span className={`text-xs ${
                      pos.pnlPercentage >= 0 ? 'text-success-500' : 'text-danger-500'
                    }`}>
                      {formatPercentage(pos.pnlPercentage)}
                    </span>
                  </div>
                </td>
                <td className="px-2 sm:px-4 py-4">
                  <span className="text-dark-200 text-sm sm:text-base">
                    {formatCurrency(pos.fees)}
                  </span>
                </td>
                <td className="px-2 sm:px-4 py-4">
                  <span className="text-dark-400 text-xs sm:text-sm">
                    {formatDate(pos.lastUpdated)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}