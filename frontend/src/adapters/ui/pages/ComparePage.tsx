import { useEffect, useState } from 'react'
import type { ComparisonRow } from '../../../core/domain'
import { api } from '../../infrastructure/api/ApiClient'

export function ComparePage() {
  const [rows, setRows] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      setLoading(true); setError(null)
      try {
        setRows(await api.getComparison())
      } catch (e: any) {
        setError(`Failed to fetch comparison: ${e.message}`)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">⟳</div>
          <div className="text-gray-600">Loading comparison data…</div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Route ID</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Baseline GHG</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Comparison GHG</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">% Difference</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Compliant</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <div className="text-4xl mb-2">📈</div>
                  <div className="text-lg font-medium">No comparison available</div>
                  <div className="text-sm">Set a baseline and reload to see comparisons</div>
                </td>
              </tr>
            )}
            {rows.map(r => (
              <tr key={r.routeId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-indigo-600">{r.routeId}</td>
                <td className="px-6 py-4 text-right font-mono text-sm text-gray-700">{r.baselineGhg.toFixed(3)}</td>
                <td className="px-6 py-4 text-right font-mono text-sm text-gray-700">{r.comparisonGhg.toFixed(3)}</td>
                <td className={`px-6 py-4 text-right font-mono text-sm font-semibold ${r.percentDiff < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {r.percentDiff.toFixed(2)}%
                </td>
                <td className="px-6 py-4 text-center text-2xl">
                  {r.compliant ? '✅' : '❌'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length > 0 && <SimpleBarChart data={rows} />}
    </div>
  )
}

function SimpleBarChart({ data }: { data: any[] }) {
  const width = 700
  const height = 300
  const paddingX = 60
  const paddingY = 50
  const maxValue = Math.max(1, ...data.map(d => Math.max(d.baselineGhg, d.comparisonGhg)))
  const barGroupWidth = Math.max(40, Math.floor((width - paddingX * 2) / Math.max(1, data.length)))
  const barWidth = barGroupWidth / 2.5

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">GHG Intensity Comparison</h3>
        <div className="flex items-center space-x-5 text-sm">
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-3.5 bg-blue-500 rounded-sm"></span>
            <span className="text-gray-600 font-medium">Baseline</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-3.5 bg-emerald-500 rounded-sm"></span>
            <span className="text-gray-600 font-medium">Comparison</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg width={width} height={height} className="mx-auto block">
          {/* Grid Lines */}
          {[...Array(5)].map((_, i) => {
            const y = paddingY + i * ((height - paddingY * 2) / 4)
            return (
              <line
                key={i}
                x1={paddingX - 20}
                y1={y}
                x2={width - paddingX + 20}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="4 3"
              />
            )
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const x = paddingX + i * barGroupWidth
            const baselineHeight = (d.baselineGhg / maxValue) * (height - paddingY * 2)
            const comparisonHeight = (d.comparisonGhg / maxValue) * (height - paddingY * 2)
            const baselineY = height - paddingY - baselineHeight
            const comparisonY = height - paddingY - comparisonHeight

            return (
              <g key={d.routeId}>
                {/* Baseline */}
                <rect
                  x={x}
                  y={baselineY}
                  width={barWidth}
                  height={baselineHeight}
                  fill="#3b82f6"
                  rx="5"
                  className="transition-all duration-500 hover:opacity-80"
                />
                {/* Comparison */}
                <rect
                  x={x + barWidth + 10}
                  y={comparisonY}
                  width={barWidth}
                  height={comparisonHeight}
                  fill="#22c55e"
                  rx="5"
                  className="transition-all duration-500 hover:opacity-80"
                />
                {/* Route ID */}
                <text
                  x={x + barWidth}
                  y={height - paddingY + 20}
                  fontSize={12}
                  fill="#4b5563"
                  textAnchor="middle"
                  className="font-medium"
                >
                  {d.routeId}
                </text>
              </g>
            )
          })}

          {/* Axis line */}
          <line
            x1={paddingX - 20}
            y1={height - paddingY}
            x2={width - paddingX + 20}
            y2={height - paddingY}
            stroke="#9ca3af"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  )
}
