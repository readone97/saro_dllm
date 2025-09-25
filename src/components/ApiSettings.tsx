import { useState } from 'react'
import { Settings, Database, Zap, AlertCircle } from 'lucide-react'

interface Props {
  useMockData: boolean
  onToggleMockData: (useMock: boolean) => void
}

export const ApiSettings = ({ useMockData, onToggleMockData }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-secondary flex items-center gap-2"
        title="API Settings"
      >
        <Settings className="w-4 h-4" />
        <span className="hidden sm:inline">API Settings</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 card p-4 z-50">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary-400" />
              <h3 className="font-semibold text-dark-100">API Configuration</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-200 font-medium">Data Source</p>
                  <p className="text-dark-400 text-sm">
                    {useMockData ? 'Using demo data' : 'Using Saros DLMM API'}
                  </p>
                </div>
                <button
                  onClick={() => onToggleMockData(!useMockData)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    useMockData ? 'bg-primary-600' : 'bg-dark-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      useMockData ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {useMockData ? (
                <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-yellow-400 font-medium text-sm">Demo Mode</p>
                    <p className="text-yellow-300 text-xs">
                      Currently using mock data for demonstration. Switch to live API to fetch real positions.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 p-3 bg-success-500/10 border border-success-500/20 rounded-lg">
                  <Zap className="w-4 h-4 text-success-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-success-400 font-medium text-sm">Live API Mode</p>
                    <p className="text-success-300 text-xs">
                      Fetching real data from Saros DLMM API. Connect your wallet to view your positions.
                    </p>
                  </div>
                </div>
              )}

              <div className="text-xs text-dark-400 space-y-1">
                <p><strong>Mock Data:</strong> Predefined demo positions for testing</p>
                <p><strong>Live API:</strong> Real positions from Saros DLMM protocol</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
