import { Tabs } from './adapters/ui/components/Tabs'
import { RoutesPage } from './adapters/ui/pages/RoutesPage'
import { ComparePage } from './adapters/ui/pages/ComparePage'
import { BankingPage } from './adapters/ui/pages/BankingPage'
import { PoolingPage } from './adapters/ui/pages/PoolingPage'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">⚓ Fuel EU Compliance Dashboard</h1>
          <p className="text-indigo-100 mt-2 text-lg">FuelEU Maritime compliance insights & analytics</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6 py-8">
        <Tabs
          tabs={[
            { key: 'routes', label: '🗺️ Routes', content: <RoutesPage /> },
            { key: 'compare', label: '📊 Compare', content: <ComparePage /> },
            { key: 'banking', label: '💰 Banking', content: <BankingPage /> },
            { key: 'pooling', label: '🤝 Pooling', content: <PoolingPage /> },
          ]}
        />
      </main>
      <footer className="text-center py-6 text-gray-600 text-sm">
        <p>© 2024 Fuel EU Maritime Compliance Dashboard</p>
      </footer>
    </div>
  )
}