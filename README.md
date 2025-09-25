# Saros DLMM Portfolio Dashboard

A modern, dark-themed portfolio analytics dashboard for tracking DLMM (Dynamic Liquidity Market Maker) positions using the Saros DLMM SDK.

## Features

- 🌙 **Sleek Dark Mode UI** - Modern, professional dark theme with glass effects
- 📊 **Real-time Portfolio Analytics** - Track your DLMM positions and performance
- 💰 **P&L Tracking** - Monitor profits and losses with detailed breakdowns
- 📱 **Responsive Design** - Optimized for desktop and mobile devices
- 🔄 **Auto-refresh** - Automatic data updates every 30 seconds
- 🎯 **Interactive Charts** - Visualize your portfolio with pie and bar charts
- 🔗 **Wallet Integration** - Connect with Solana wallets (Phantom, etc.)
- ⚡ **Mock Data Support** - Demo mode when APIs are unavailable

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Solana Wallet Adapter** for wallet integration
- **Axios** for API calls
- **React Hot Toast** for notifications

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Configuration

### Saros DLMM API Integration

This dashboard integrates with the official Saros DLMM API as documented at [https://docs.saros.xyz/saros-dlmm/technical-guides/user-position](https://docs.saros.xyz/saros-dlmm/technical-guides/user-position).

#### API Endpoints Used:

1. **Pool-Level Positions**: `/api/pool-position`
   - Fetches aggregated position data by pool
   - Returns total liquidity, token amounts, and pool information

2. **Bin-Level Positions**: `/api/bin-position`
   - Fetches granular position data for each bin
   - Returns detailed information about individual liquidity bins

#### Switching Between Mock and Live Data:

1. **Using the UI Toggle**: Click the "API Settings" button in the header to switch between demo and live data
2. **Programmatically**: Open `src/services/dlmmApi.ts` and set `USE_MOCK_DATA = false`

#### API Configuration:

The app is configured to use the official Saros API at `https://api.saros.finance`. To use a different endpoint:

1. Open `src/services/dlmmApi.ts`
2. Update the `SAROS_API_BASE` constant
3. Ensure the API follows the Saros DLMM API specification

### Wallet Configuration

The app is configured to work with Phantom wallet by default. To add more wallets:

1. Open `src/main.jsx`
2. Import additional wallet adapters
3. Add them to the `wallets` array

## Project Structure

```
src/
├── components/          # React components
│   ├── PortfolioSummary.tsx
│   ├── PositionsTable.tsx
│   └── WalletConnect.tsx
├── hooks/              # Custom React hooks
│   ├── usePositions.ts
│   └── useWallets.ts
├── services/           # API services
│   └── dlmmApi.ts
├── types/              # TypeScript type definitions
│   └── dlmm.ts
├── App.jsx            # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles
```

## Features in Detail

### Saros DLMM Integration
- **Pool-Level Positions**: Aggregated data showing total liquidity per pool
- **Bin-Level Positions**: Granular data for individual liquidity bins
- **Real-time Price Updates**: Live token prices from Birdeye API
- **P&L Calculation**: Accurate profit/loss tracking based on DLMM mechanics
- **Fee Tracking**: Monitor fees earned from liquidity provision

### Portfolio Summary
- Total portfolio value across all pools
- P&L tracking with percentage calculations
- Number of active positions and bins
- Fees earned from liquidity provision
- Interactive charts showing portfolio breakdown
- Live API status indicator

### Positions Table
- Sortable columns for easy data analysis
- Real-time data updates every 30 seconds
- Copy pool addresses and bin IDs
- Mobile-responsive design
- Detailed token breakdowns per bin
- Pool and bin-level information display

### Wallet Integration
- Connect/disconnect Solana wallets
- Address copying functionality
- Connection status indicators
- Support for Phantom and other Solana wallets
- Auto-refresh when wallet changes

## Troubleshooting

### Styling Issues
If Tailwind CSS styles aren't loading:
1. Ensure PostCSS is installed: `npm install -D postcss autoprefixer`
2. Check that `postcss.config.js` exists
3. Restart the development server

### API Errors
If you see network errors:
- The app will automatically fall back to mock data
- Check the browser console for detailed error messages
- Ensure your API endpoints are accessible

### Wallet Connection Issues
- Make sure you have a Solana wallet installed
- Check that the wallet is unlocked
- Try refreshing the page

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details