import { useState } from 'react'
import { api } from '../../infrastructure/api/ApiClient'

type Member = { shipId: string; year: number; cb?: number }

export function PoolingPage() {
  const [members, setMembers] = useState<any[]>([{ shipId: 'R001', year: 2024 }, { shipId: 'R002', year: 2024 }])
  const [result, setResult] = useState<any | null>(null)
  const [err, setErr] = useState<string>('')

  function update(i: number, patch: any) {
    setMembers(m => m.map((x, idx) => idx === i ? { ...x, ...patch } : x))
  }

  async function loadCBs() {
    setErr('')
    const next: any[] = []
    for (const m of members) {
      try {
        const r = await api.getCB(m.shipId, m.year)
        next.push({ ...m, cb: r.cb })
      } catch (e: any) {
        setErr(e.message)
        return
      }
    }
    setMembers(next)
  }

  async function createPool() {
    setErr(''); setResult(null)
    try {
      const r = await api.createPool(members.map(({ shipId, year }) => ({ shipId, year })))
      setResult(r)
    } catch (e: any) {
      setErr(e.message)
    }
  }

  const sum = members.reduce((s, m) => s + (m.cb ?? 0), 0)
  const valid = sum >= 0

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={() => setMembers(m => [...m, { shipId: '', year: 2024 }])}
            className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + Add Member
          </button>
          <button
            onClick={loadCBs}
            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            ↻ Load CBs
          </button>
          <div className={`px-5 py-2.5 rounded-lg font-semibold ${valid ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-red-100 text-red-700 border-2 border-red-300'}`}>
            Pool Sum: {sum.toFixed(2)}
          </div>
          <button
            disabled={!valid}
            onClick={createPool}
            className="px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✓ Create Pool
          </button>
        </div>
      </div>

      {/* Members Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Ship ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Year</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">CB</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((m, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <input
                    value={m.shipId}
                    onChange={e => update(i, { shipId: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter Ship ID"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={m.year}
                    onChange={e => update(i, { year: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </td>
                <td className="px-6 py-4 text-right font-mono text-sm font-semibold text-gray-700">
                  {m.cb === undefined ? '—' : m.cb.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => setMembers(x => x.filter((_, j) => j !== i))}
                    className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    ✕ Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pool Result */}
      {result && (
        <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">✓ Pool Created Successfully</h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-50 to-green-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Ship ID</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-green-700 uppercase tracking-wider">CB Before</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-green-700 uppercase tracking-wider">CB After</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {result.members.map((m: any) => (
                  <tr key={m.shipId} className="hover:bg-green-50 transition-colors">
                    <td className="px-6 py-3 font-semibold text-indigo-600">{m.shipId}</td>
                    <td className="px-6 py-3 text-right font-mono text-sm text-gray-700">{m.cb_before.toFixed(2)}</td>
                    <td className="px-6 py-3 text-right font-mono text-sm font-semibold text-green-600">{m.cb_after.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {err && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-700 font-medium">{err}</p>
        </div>
      )}
    </div>
  )
}
