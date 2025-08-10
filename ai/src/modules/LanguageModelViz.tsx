import { useEffect, useMemo, useState } from 'react'

const TOKENS = ['我', '爱', '人工', '智能', '的', '可视化', '网站']

type Palette = 'Blues' | 'Viridis' | 'Magma' | 'Reds'

function softmax(values: number[]): number[] {
  const max = Math.max(...values)
  const exps = values.map((v) => Math.exp(v - max))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map((e) => e / sum)
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function clamp01(x: number) { return Math.max(0, Math.min(1, x)) }

function toColor(val: number, palette: Palette, active: boolean) {
  const v = clamp01(val)
  if (!active) {
    const alpha = 0.05
    return `rgba(37,99,235,${alpha})`
  }
  if (palette === 'Blues') {
    const a = 210, b = 230
    const l = lerp(90, 40, v)
    return `hsl(${lerp(a, b, v)} 80% ${l}%)`
  }
  if (palette === 'Reds') {
    const l = lerp(92, 42, v)
    return `hsl(10 85% ${l}%)`
  }
  if (palette === 'Viridis') {
    // crude viridis approximation via stops
    const stops = [
      [68, 9, 32], [72, 33, 45], [55, 74, 60], [31, 94, 67]
    ]
    const i = Math.floor(v * (stops.length - 1))
    const t = v * (stops.length - 1) - i
    const h = lerp(stops[i][0], stops[i + 1][0], t)
    const s = lerp(stops[i][1], stops[i + 1][1], t)
    const l = lerp(stops[i][2], stops[i + 1][2], t)
    return `hsl(${h} ${s}% ${l}%)`
  }
  // Magma approximation
  const stops = [
    [270, 90, 15], [300, 85, 25], [10, 80, 40], [40, 85, 55]
  ]
  const i = Math.floor(v * (stops.length - 1))
  const t = v * (stops.length - 1) - i
  const h = lerp(stops[i][0], stops[i + 1][0], t)
  const s = lerp(stops[i][1], stops[i + 1][1], t)
  const l = lerp(stops[i][2], stops[i + 1][2], t)
  return `hsl(${h} ${s}% ${l}%)`
}

export default function LanguageModelViz() {
  const [qIndex, setQIndex] = useState(0)
  const [numHeads, setNumHeads] = useState(4)
  const [headIndex, setHeadIndex] = useState(0)
  const [palette, setPalette] = useState<Palette>('Blues')

  const attention = useMemo(() => {
    const heads: number[][][] = []
    for (let h = 0; h < numHeads; h++) {
      const decay = 0.3 + (h / Math.max(1, numHeads - 1)) * 0.5 // different heads different decay
      const rows = TOKENS.map((_, i) => {
        const scores = TOKENS.map((__, j) => (j <= i ? -decay * (i - j) : -Infinity))
        return softmax(scores)
      })
      heads.push(rows)
    }
    return heads
  }, [numHeads])

  useEffect(() => {
    const id = window.setInterval(() => {
      setQIndex((i) => (i + 1) % TOKENS.length)
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (headIndex >= numHeads) setHeadIndex(0)
  }, [numHeads, headIndex])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        <label className="text-sm text-slate-700">头数
          <select value={numHeads} onChange={(e) => setNumHeads(parseInt(e.target.value))} className="ml-2 border border-slate-300 rounded px-2 py-1 text-sm">
            {[1, 2, 4, 8].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label className="text-sm text-slate-700">当前头
          <select value={headIndex} onChange={(e) => setHeadIndex(parseInt(e.target.value))} className="ml-2 border border-slate-300 rounded px-2 py-1 text-sm">
            {Array.from({ length: numHeads }, (_, i) => <option key={i} value={i}>{i + 1}</option>)}
          </select>
        </label>
        <label className="text-sm text-slate-700">配色
          <select value={palette} onChange={(e) => setPalette(e.target.value as Palette)} className="ml-2 border border-slate-300 rounded px-2 py-1 text-sm">
            {(['Blues','Viridis','Magma','Reds'] as Palette[]).map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
      </div>

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
              const val = attention[headIndex]?.[row]?.[col] ?? 0
              const activeRow = row === qIndex
              const bg = toColor(val, palette, activeRow)
              const intensity = isFinite(val) ? Math.round(val * 100) : 0
              return (
                <div
                  key={`${row}-${col}-${headIndex}`}
                  className={`aspect-square flex items-center justify-center border transition-all ${activeRow ? 'border-blue-300' : 'border-slate-200'}`}
                  style={{ backgroundColor: bg }}
                  title={`head=${headIndex+1}, q=${row}, k=${col}, w=${val.toFixed(2)}`}
                >
                  <span className={`text-[10px] transition-colors ${activeRow ? 'text-white' : 'text-slate-700'}`}>{intensity}</span>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}