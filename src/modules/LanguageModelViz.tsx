import { useEffect, useMemo, useState } from 'react'

const TOKENS = ['我', '爱', '人工', '智能', '的', '可视化', '网站']

function softmax(values: number[]): number[] {
  const max = Math.max(...values)
  const exps = values.map((v) => Math.exp(v - max))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map((e) => e / sum)
}

export default function LanguageModelViz() {
  const [qIndex, setQIndex] = useState(0)

  const attentionRows = useMemo(() => {
    return TOKENS.map((_, i) => {
      const scores = TOKENS.map((__, j) => (j <= i ? -0.4 * (i - j) : -Infinity))
      return softmax(scores)
    })
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => {
      setQIndex((i) => (i + 1) % TOKENS.length)
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <div className="inline-flex gap-2">
          {TOKENS.map((t, i) => (
            <span
              key={i}
              className={`px-3 py-1.5 rounded-full border transition-all ${i === qIndex ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-grid" style={{ gridTemplateColumns: `repeat(${TOKENS.length}, minmax(36px, 1fr))` }}>
          {TOKENS.map((_, row) =>
            TOKENS.map((__, col) => {
              const val = attentionRows[row][col]
              const activeRow = row === qIndex
              const intensity = isFinite(val) ? Math.round(val * 100) : 0
              return (
                <div
                  key={`${row}-${col}`}
                  className={`aspect-square flex items-center justify-center border transition-all ${activeRow ? 'border-blue-300' : 'border-slate-200'}`}
                  style={{ backgroundColor: `rgba(37, 99, 235, ${activeRow ? val : 0.05})` }}
                  title={`q=${row}, k=${col}, w=${val.toFixed(2)}`}
                >
                  <span className={`text-[10px] transition-colors ${activeRow ? 'text-white' : 'text-slate-600'}`}>{intensity}</span>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}