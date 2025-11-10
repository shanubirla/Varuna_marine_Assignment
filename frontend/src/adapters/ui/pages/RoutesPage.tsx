import { useEffect, useState ,useMemo } from 'react'
import { api } from '../../infrastructure/api/ApiClient'
export function RoutesPage() {
  const [routes, setRoutes] = useState<any[]>([])
  const [filters, setFilters] = useState({ vesselType: '', fuelType: '', year: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<number | null>(null)

  async function load() {
    setLoading(true); setError(null)
    try {
      const data = await api.getRoutes()
      setRoutes(data)
    } catch (e: any) {
      setError(`Failed to fetch routes: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const vesselTypes = useMemo(() => Array.from(new Set(routes.map(r => r.vesselType))), [routes])
  const fuelTypes = useMemo(() => Array.from(new Set(routes.map(r => r.fuelType))), [routes])
  const years = useMemo(() => Array.from(new Set(routes.map(r => r.year))), [routes])

  const filtered = routes.filter(r =>
    (!filters.vesselType || r.vesselType === filters.vesselType) &&
    (!filters.fuelType || r.fuelType === filters.fuelType) &&
    (!filters.year || r.year === Number(filters.year))
  )

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-semibold text-gray-700 mb-2">Vessel Type</label>
            <select
              value={filters.vesselType}
              onChange={e => setFilters(f => ({ ...f, vesselType: e.target.value }))}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="">All Types</option>
              {vesselTypes.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-semibold text-gray-700 mb-2">Fuel Type</label>
            <select
              value={filters.fuelType}
              onChange={e => setFilters(f => ({ ...f, fuelType: e.target.value }))}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="">All Fuels</option>
              {fuelTypes.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-semibold text-gray-700 mb-2">Year</label>
            <select
              value={filters.year}
              onChange={e => setFilters(f => ({ ...f, year: e.target.value }))}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="">All Years</option>
              {years.map(v => <option key={v} value={String(v)}>{v}</option>)}
            </select>
          </div>
          <button
            className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={load}
            disabled={loading}
          >
            {loading ? '⟳ Loading…' : '↻ Reload'}
          </button>
          {(filters.vesselType || filters.fuelType || filters.year) && (
            <button
              className="px-5 py-2.5 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
              onClick={() => setFilters({ vesselType: '', fuelType: '', year: '' })}
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Table Section */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Baseline</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Route ID</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Vessel</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Fuel</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Year</th>
              <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">GHG Intensity</th>
              <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Fuel (t)</th>
              <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Distance (km)</th>
              <th className="px-4 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Emissions (t)</th>
              <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-gray-500">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="text-lg font-medium">No routes found</div>
                  <div className="text-sm">Try adjusting your filters</div>
                </td>
              </tr>
            )}
            {filtered.map(r => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 text-2xl">{r.isBaseline ? '⭐' : ''}</td>
                <td className="px-4 py-4 font-semibold text-indigo-600">{r.routeId}</td>
                <td className="px-4 py-4 text-gray-700">{r.vesselType}</td>
                <td className="px-4 py-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {r.fuelType}
                  </span>
                </td>
                <td className="px-4 py-4 text-gray-700">{r.year}</td>
                <td className="px-4 py-4 text-right font-mono text-sm">{r.ghgIntensity.toFixed(3)}</td>
                <td className="px-4 py-4 text-right font-mono text-sm">{r.fuelConsumption}</td>
                <td className="px-4 py-4 text-right font-mono text-sm">{r.distance}</td>
                <td className="px-4 py-4 text-right font-mono text-sm">{r.totalEmissions}</td>
                <td className="px-4 py-4 text-center">
                  <button
                    disabled={r.isBaseline || savingId === r.id}
                    onClick={async () => {
                      try {
                        setSavingId(r.id)
                        await api.setBaseline(r.id)
                        await load()
                      } catch (e: any) {
                        setError(`Set baseline failed: ${e.message}`)
                      } finally {
                        setSavingId(null)
                      }
                    }}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      r.isBaseline
                        ? 'bg-green-100 text-green-700 cursor-default'
                        : savingId === r.id
                        ? 'bg-gray-200 text-gray-500 cursor-wait'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {r.isBaseline ? '✓ Current' : savingId === r.id ? 'Saving…' : 'Set Baseline'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}