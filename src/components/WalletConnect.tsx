import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { toast } from 'react-hot-toast'
import { Wallet, LogOut, Copy, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export const WalletConnect = () => {
  const { publicKey, disconnect, wallet } = useWallet()
  const [copied, setCopied] = useState(false)

  const handleDisconnect = () => {
    disconnect()
    toast.success('Wallet disconnected')
  }

  const copyAddress = async () => {
    if (publicKey) {
      try {
        await navigator.clipboard.writeText(publicKey.toString())
        setCopied(true)
        toast.success('Address copied to clipboard')
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        toast.error('Failed to copy address')
      }
    }
  }

  return (
    <div className="flex justify-end">
      {publicKey ? (
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3">
          {/* Wallet Info */}
          <div className="flex items-center gap-2 px-2 sm:px-3 py-2 bg-dark-800/50 rounded-lg border border-dark-700/50">
            <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse"></div>
            <span className="text-dark-200 text-xs sm:text-sm font-medium">
              {wallet?.adapter.name || 'Connected'}
            </span>
          </div>

          {/* Address */}
          <div className="flex items-center gap-2 px-2 sm:px-3 py-2 bg-dark-800/50 rounded-lg border border-dark-700/50">
            <span className="text-dark-300 text-xs sm:text-sm font-mono">
              {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
            </span>
            <button
              onClick={copyAddress}
              className="p-1 hover:bg-dark-700/50 rounded transition-colors"
              title="Copy address"
            >
              {copied ? (
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-success-400" />
              ) : (
                <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-dark-400" />
              )}
            </button>
          </div>

          {/* Disconnect Button */}
          <button
            onClick={handleDisconnect}
            className="btn-danger flex items-center gap-2 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
            title="Disconnect wallet"
          >
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Disconnect</span>
            <span className="sm:hidden">Disconnect</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 text-dark-400 text-xs sm:text-sm">
            <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Connect your wallet to view positions</span>
            <span className="sm:hidden">Connect wallet</span>
          </div>
          <WalletMultiButton className="!bg-primary-600 hover:!bg-primary-700 !text-white !font-medium !px-3 sm:!px-4 !py-1 sm:!py-2 !rounded-lg !transition-all !duration-200 hover:!shadow-lg hover:!shadow-primary-500/25 !text-xs sm:!text-sm" />
        </div>
      )}
    </div>
  )
}