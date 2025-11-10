import { ReactNode, useEffect, useState } from 'react'

export function Tabs(props: { tabs: { key: string; label: string; content: ReactNode }[] }) {
  const { tabs } = props
  const [active, setActive] = useState(tabs[0].key)

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-1">
        {tabs.map((t) => {
          const isActive = t.key === active
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`relative px-6 py-3 text-sm font-semibold rounded-t-lg transition-all duration-200
                ${isActive
                  ? 'bg-indigo-600 text-white shadow-lg transform -translate-y-0.5'
                  : 'bg-white text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 border border-gray-200 border-b-0'
                }`}
            >
              {t.label}
            </button>
          )
        })}
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        {tabs.find((t) => t.key === active)?.content}
      </div>
    </div>
  )
}
