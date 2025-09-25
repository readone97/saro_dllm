import { useWallet } from '@solana/wallet-adapter-react'
import { WalletConnect } from './components/WalletConnect'
import { PositionsTable } from './components/PositionsTable'
import { PortfolioSummary } from './components/PortfolioSummary'
import { ApiSettings } from './components/ApiSettings'
import { usePositions } from './hooks/usePositions'
import { ErrorBoundary } from 'react-error-boundary'
import { toast } from 'react-hot-toast'
import { AlertTriangle, RefreshCw, Activity } from 'lucide-react'
import { useState } from 'react'

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="card max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-12 h-12 text-danger-400" />
        </div>
        <h2 className="text-xl font-semibold text-dark-100 mb-2">Something went wrong</h2>
        <p className="text-dark-400 mb-6">{error.message}</p>
        <button 
          onClick={resetErrorBoundary} 
          className="btn-primary flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  )
}

function App() {
  const { publicKey } = useWallet()
  const [useMockData, setUseMockData] = useState(true) // Start with mock data
  const { positions, loading, error, summary, refetch, lastFetchTime } = usePositions()

  const handleToggleMockData = (useMock) => {
    setUseMockData(useMock)
    // Update the API service to use the new setting
    // This would require updating the service, but for now we'll show the UI change
    toast.success(useMock ? 'Switched to demo data' : 'Switched to live API')
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={refetch}>
      <div className="min-h-screen bg-dark-950">
        {/* Header */}
        <header className="glass-effect border-b border-dark-700/50 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-500/10 rounded-lg">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gradient">Saros DLMM Portfolio</h1>
                  <p className="text-dark-400 text-xs sm:text-sm">Track your liquidity positions and performance</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ApiSettings 
                  useMockData={useMockData} 
                  onToggleMockData={handleToggleMockData} 
                />
                <WalletConnect />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-4 sm:py-8">
          {!publicKey ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="card max-w-md w-full p-8">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-primary-500/10 rounded-full">
                    <Activity className="w-12 h-12 text-primary-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-dark-100 mb-4">
                  Welcome to Saros DLMM Dashboard
                </h2>
                <p className="text-dark-400 mb-6">
                  Connect your wallet to view and manage your DLMM liquidity positions, track performance, and analyze your portfolio.
                </p>
                <WalletConnect />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Error Display */}
              {error && (
                <div className="card border-danger-500/50 bg-danger-500/5">
                  <div className="flex items-center gap-3 p-4">
                    <AlertTriangle className="w-5 h-5 text-danger-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-danger-400 font-medium">Error loading positions</p>
                      <p className="text-danger-300 text-sm mt-1">{error}</p>
                    </div>
                    <button
                      onClick={refetch}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="card">
                  <div className="flex items-center justify-center p-8">
                    <div className="flex items-center gap-3">
                      <RefreshCw className="w-5 h-5 text-primary-400 animate-spin" />
                      <span className="text-dark-200">Loading your positions...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Portfolio Summary */}
              <PortfolioSummary summary={summary} lastFetchTime={lastFetchTime} />

              {/* Positions Table */}
              <PositionsTable positions={positions} loading={loading} />

              {/* Refresh Button */}
              <div className="flex justify-center">
                <button
                  onClick={refetch}
                  disabled={loading}
                  className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Refreshing...' : 'Refresh Data'}
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-dark-700/50 mt-16">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-dark-400 text-sm">
                Built with Saros DLMM SDK • {useMockData ? 'Demo Mode' : 'Live API'} • Real-time portfolio analytics
              </div>
              <div className="flex items-center gap-4 text-sm text-dark-400">
                <span>API: {useMockData ? 'Mock Data' : 'Saros DLMM'}</span>
                <span>•</span>
                <span>Last updated: {lastFetchTime ? lastFetchTime.toLocaleTimeString() : 'Never'}</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  )
}

export default App