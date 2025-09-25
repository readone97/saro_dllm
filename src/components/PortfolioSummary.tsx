import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { summaryType } from '../hooks/usePositions'
import { TrendingUp, TrendingDown, DollarSign, Layers, Award, Clock, Database, Zap } from 'lucide-react'

interface Props {
  summary: summaryType
  lastFetchTime?: Date | null
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export const PortfolioSummary = ({ summary, lastFetchTime }: Props) => {
  const chartData = summary.totalValue > 0 ? [
    { name: 'Total Value', value: summary.totalValue, color: '#3b82f6' },
    { name: 'P&L', value: Math.abs(summary.totalPnl), color: summary.totalPnl >= 0 ? '#10b981' : '#ef4444' },
    { name: 'Fees Earned', value: summary.totalFees, color: '#f59e0b' }
  ] : []

  const performanceData = [
    { name: 'Total Value', value: summary.totalValue },
    { name: 'P&L', value: summary.totalPnl },
    { name: 'Fees', value: summary.totalFees }
  ]

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

  return (
    <div className="space-y-6 mb-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card card-hover p-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm font-medium">Total Value</p>
              <p className="text-2xl font-bold text-dark-50 mt-1">
                {formatCurrency(summary.totalValue)}
              </p>
            </div>
            <div className="p-3 bg-primary-500/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-primary-400" />
            </div>
          </div>
        </div>

        <div className="card card-hover p-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm font-medium">Total P&L</p>
              <p className={`text-2xl font-bold mt-1 flex items-center gap-2 ${
                summary.totalPnl >= 0 ? 'text-success-400' : 'text-danger-400'
              }`}>
                {summary.totalPnl >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                {formatCurrency(summary.totalPnl)}
              </p>
              <p className="text-sm text-dark-400 mt-1">
                {formatPercentage(summary.avgPnlPercentage)} avg
              </p>
            </div>
            <div className={`p-3 rounded-lg ${
              summary.totalPnl >= 0 ? 'bg-success-500/10' : 'bg-danger-500/10'
            }`}>
              {summary.totalPnl >= 0 ? (
                <TrendingUp className="w-6 h-6 text-success-400" />
              ) : (
                <TrendingDown className="w-6 h-6 text-danger-400" />
              )}
            </div>
          </div>
        </div>

        <div className="card card-hover p-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm font-medium">Positions</p>
              <p className="text-2xl font-bold text-dark-50 mt-1">
                {summary.totalPositions}
              </p>
            </div>
            <div className="p-3 bg-primary-500/10 rounded-lg">
              <Layers className="w-6 h-6 text-primary-400" />
            </div>
          </div>
        </div>

        <div className="card card-hover p-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm font-medium">Fees Earned</p>
              <p className="text-2xl font-bold text-dark-50 mt-1">
                {formatCurrency(summary.totalFees)}
              </p>
            </div>
            <div className="p-3 bg-primary-500/10 rounded-lg">
              <Award className="w-6 h-6 text-primary-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-dark-100 mb-4">Portfolio Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-dark-100 mb-4">Performance Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#94a3b8"
                  fontSize={12}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* API Status and Last Updated */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-dark-400 text-sm">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4" />
          <span>Using Saros DLMM API</span>
          <div className="flex items-center gap-1 px-2 py-1 bg-primary-500/10 rounded text-primary-400 text-xs">
            <Zap className="w-3 h-3" />
            <span>Live Data</span>
          </div>
        </div>
        {lastFetchTime && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastFetchTime.toLocaleTimeString()}</span>
          </div>
        )}
      </div>
    </div>
  )
}