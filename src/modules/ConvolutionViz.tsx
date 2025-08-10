import { useEffect, useMemo, useRef, useState, memo } from 'react'
import Notice from '../components/Notice'

const INPUT_SIZE = 6
const KERNEL_SIZE = 3
const STRIDE = 1

function generateMatrix(size: number): number[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.floor(Math.random() * 9))
  )
}

const DEFAULT_KERNEL: number[][] = [
  [1, 0, -1],
  [1, 0, -1],
  [1, 0, -1],
]

function dot(a: number[][], b: number[][]): number {
  let sum = 0
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a[0].length; j++) {
      sum += a[i][j] * b[i][j]
    }
  }
  return sum
}

function sliceMatrix(m: number[][], r: number, c: number, size: number): number[][] {
  const out: number[][] = []
  for (let i = 0; i < size; i++) {
    out.push(m[r + i].slice(c, c + size))
  }
  return out
}

export default function ConvolutionViz() {
  const input = useMemo(() => generateMatrix(INPUT_SIZE), [])
  const kernel = DEFAULT_KERNEL
  const outputSize = (INPUT_SIZE - KERNEL_SIZE) / STRIDE + 1
  const [output, setOutput] = useState<(number | null)[][]>(
    Array.from({ length: outputSize }, () => Array.from({ length: outputSize }, () => null))
  )
  const [pos, setPos] = useState({ r: 0, c: 0 })
  const [isPlaying, setIsPlaying] = useState(true)
  const [speedMs, setSpeedMs] = useState(500)
  const timerRef = useRef<number | null>(null)

  const step = () => {
    const { r, c } = pos
    const patch = sliceMatrix(input, r, c, KERNEL_SIZE)
    const val = dot(patch, kernel)
    setOutput((prev) => {
      const next = prev.map((row) => row.slice())
      next[r][c] = val
      return next
    })

    let nextR = r
    let nextC = c + STRIDE
    if (nextC >= outputSize) {
      nextC = 0
      nextR = r + STRIDE
    }
    if (nextR >= outputSize) {
      setIsPlaying(false)
      return
    }
    setPos({ r: nextR, c: nextC })
  }

  useEffect(() => {
    if (!isPlaying) return
    timerRef.current = window.setInterval(step, speedMs)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [pos, isPlaying, speedMs])

  const reset = () => {
    setOutput(Array.from({ length: outputSize }, () => Array.from({ length: outputSize }, () => null)))
    setPos({ r: 0, c: 0 })
    setIsPlaying(true)
  }

  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

  return (
    <div className="flex flex-col gap-6">
      <Notice title="说明">演示 3×3 卷积核在输入特征图上的滑动与点积运算，实时生成输出。</Notice>
      <div className="flex items-center gap-3 flex-wrap">
        <button className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => setIsPlaying((p) => !p)}>
          {isPlaying ? '暂停' : '播放'}
        </button>
        <button className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors" onClick={reset}>
          重置
        </button>
        <label className="ml-2 flex items-center gap-2 text-sm text-slate-700">
          速度
          <input type="range" min={150} max={1200} step={50} value={speedMs} onChange={(e) => setSpeedMs(parseInt(e.target.value))} className="w-40 accent-blue-600" />
        </label>
      </div>
      {isMobile && speedMs < 300 && (
        <Notice tone="warning" title="性能提示">较快速度在手机上可能导致耗电或发热，必要时请降低速度。</Notice>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-medium mb-3 text-slate-700">输入特征图 ({INPUT_SIZE}×{INPUT_SIZE})</h3>
          <Grid matrix={input} highlight={{ r: pos.r, c: pos.c, size: KERNEL_SIZE }} />
        </div>
        <div>
          <h3 className="font-medium mb-3 text-slate-700">卷积核 ({KERNEL_SIZE}×{KERNEL_SIZE})</h3>
          <Grid matrix={kernel} compact />
        </div>
        <div>
          <h3 className="font-medium mb-3 text-slate-700">输出特征图 ({outputSize}×{outputSize})</h3>
          <Grid matrix={output} highlightOut={{ r: pos.r, c: pos.c }} />
        </div>
      </div>
    </div>
  )
}

type GridProps = {
  matrix: (number | null)[][]
  highlight?: { r: number; c: number; size: number }
  highlightOut?: { r: number; c: number }
  compact?: boolean
}

const Grid = memo(function Grid({ matrix, highlight, highlightOut, compact = false }: GridProps) {
  const cols = matrix[0].length

  return (
    <div
      className="inline-grid"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(${compact ? '32px' : '44px'}, 1fr))` }}
    >
      {matrix.map((row, r) =>
        row.map((cell, c) => {
          const inHighlight = highlight && r >= highlight.r && r < highlight.r + highlight.size && c >= highlight.c && c < highlight.c + highlight.size
          const outHighlight = highlightOut && r === highlightOut.r && c === highlightOut.c
          const isEmpty = cell === null || cell === undefined
          return (
            <div
              key={`${r}-${c}`}
              className={[
                'flex items-center justify-center aspect-square border transition-all duration-300',
                inHighlight ? 'border-blue-500 ring-2 ring-blue-300' : 'border-slate-200',
                outHighlight ? 'bg-blue-50' : 'bg-white',
                'text-sm sm:text-base'
              ].join(' ')}
            >
              <span className={['transition-colors duration-300', isEmpty ? 'text-slate-300' : 'text-slate-800'].join(' ')}>
                {isEmpty ? '-' : (cell as number)}
              </span>
            </div>
          )
        })
      )}
    </div>
  )
})