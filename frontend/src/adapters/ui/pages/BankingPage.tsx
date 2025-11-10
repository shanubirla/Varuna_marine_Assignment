import { useState } from 'react'
import { api } from '../../infrastructure/api/ApiClient'


export function BankingPage() {
  const [shipId, setShipId] = useState('R001')
  const [year, setYear] = useState(2024)
  const [cb, setCb] = useState<number | null>(null)
  const [adjusted, setAdjusted] = useState<number | null>(null)
  const [amount, setAmount] = useState<number>(0)
  const [msg, setMsg] = useState<string>('')
  const [err, setErr] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [posting, setPosting] = useState<'bank' | 'apply' | null>(null)

  async function load() {
    setErr(''); setMsg(''); setLoading(true)
    try {
      const r = await api.getCB(shipId, year)
      setCb(r.cb)
      const a = await api.getAdjustedCB(shipId, year)
      setAdjusted(a.adjustedCB)
    } catch (e: any) {
      setErr(`Load failed: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function bank() {
    setErr(''); setMsg(''); setPosting('bank')
    try {
      const r = await api.bank(shipId, year)
      setMsg(`✓ Successfully banked: ${Number(r.applied).toFixed(2)}`)
      await load()
    } catch (e: any) {
      setErr(`Bank failed: ${e.message}`)
    } finally {
      setPosting(null)
    }
  }

  async function apply() {
    setErr(''); setMsg(''); setPosting('apply')
    try {
      const r = await api.applyBank(shipId, year, amount)
      setMsg(`✓ Successfully applied: ${Number(r.applied).toFixed(2)}`)
      await load()
    } catch (e: any) {
      setErr(`Apply failed: ${e.message}`)
    } finally {
      setPosting(null)
    }
  }

  const disableBank = cb === null || cb <= 0 || loading || posting !== null
  const disableApply = adjusted === null || adjusted >= 0 || loading || posting !== null

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-gray-700 mb-2">Ship/Route ID</label>
            <input
              value={shipId}
              onChange={e => setShipId(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-semibold text-gray-700 mb-2">Year</label>
            <input
              type="number"
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            onClick={load}
            disabled={loading}
          >
            {loading ? '⟳ Loading…' : '↻ Load CB'}
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200 shadow-sm">
          <div className="text-sm font-semibold text-blue-700 mb-1">Compliance Balance</div>
          <div className="text-3xl font-bold text-blue-900">{cb === null ? '—' : cb.toFixed(2)}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200 shadow-sm">
          <div className="text-sm font-semibold text-purple-700 mb-1">Adjusted CB</div>
          <div className="text-3xl font-bold text-purple-900">{adjusted === null ? '—' : adjusted.toFixed(2)}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200 shadow-sm">
          <div className="text-sm font-semibold text-green-700 mb-1">Target</div>
          <div className="text-2xl font-bold text-green-900">89.3368 gCO₂e/MJ</div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Banking Actions</h3>
        <div className="flex flex-wrap gap-4 items-end">
          <button
            disabled={disableBank}
            onClick={bank}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {posting === 'bank' ? '⟳ Banking…' : '💰 Bank Surplus'}
          </button>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-gray-700 mb-2">Apply Amount</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disableApply}
            onClick={apply}
          >
            {posting === 'apply' ? '⟳ Applying…' : '📊 Apply Banked'}
          </button>
        </div>
      </div>

      {msg && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <p className="text-green-700 font-medium">{msg}</p>
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