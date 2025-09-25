import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import { Toaster } from 'react-hot-toast'
import '@solana/wallet-adapter-react-ui/styles.css'

const network = clusterApiUrl('mainnet-beta')
const wallets = [new PhantomWalletAdapter()]

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ConnectionProvider endpoint={network}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <App />
            <Toaster position="top-right" />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </React.StrictMode>,
  );
}