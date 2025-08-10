import { useEffect, useMemo, useRef, useState } from 'react'
import Notice from '../components/Notice'

type SourceType = '几何' | '棋盘' | '噪声'
type FilterType = '最近邻' | '双线性' | '双三次'

function drawScene(ctx: CanvasRenderingContext2D, size: number, type: SourceType) {
  ctx.clearRect(0, 0, size, size)
  if (type === '几何') {
    const grad = ctx.createLinearGradient(0, 0, size, size)
    grad.addColorStop(0, '#e2e8f0')
    grad.addColorStop(1, '#ffffff')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
    ctx.fillStyle = '#2563eb'
    ctx.beginPath()
    ctx.arc(size * 0.3, size * 0.35, size * 0.16, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#22c55e'
    ctx.fillRect(size * 0.55, size * 0.25, size * 0.25, size * 0.25)
    ctx.fillStyle = '#f59e0b'
    ctx.beginPath()
    ctx.moveTo(size * 0.2, size * 0.75)
    ctx.lineTo(size * 0.45, size * 0.55)
    ctx.lineTo(size * 0.7, size * 0.85)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#0f172a'
    ctx.font = `${Math.floor(size * 0.08)}px system-ui, -apple-system, Segoe UI, Roboto`
    ctx.fillText('AI', size * 0.62, size * 0.62)
    return
  }
  if (type === '棋盘') {
    const cells = 16
    const cell = size / cells
    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? '#ffffff' : '#0f172a'
        ctx.fillRect(Math.round(c * cell), Math.round(r * cell), Math.ceil(cell), Math.ceil(cell))
      }
    }
    return
  }
  // 噪声
  const imgData = ctx.createImageData(size, size)
  for (let i = 0; i < imgData.data.length; i += 4) {
    const v = Math.floor(Math.random() * 256)
    imgData.data[i] = v
    imgData.data[i + 1] = v
    imgData.data[i + 2] = v
    imgData.data[i + 3] = 255
  }
  ctx.putImageData(imgData, 0, 0)
}

export default function ImageResolutionViz() {
  const displaySize = 360
  const sourceSize = 512
  const [source, setSource] = useState<SourceType>('几何')
  const [filter, setFilter] = useState<FilterType>('双线性')
  const [targetRes, setTargetRes] = useState(128)
  const [showGrid, setShowGrid] = useState(false)

  const srcCanvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = sourceSize
    c.height = sourceSize
    return c
  }, [])

  useEffect(() => {
    const ctx = srcCanvas.getContext('2d')!
    drawScene(ctx, sourceSize, source)
  }, [srcCanvas, source])

  const leftRef = useRef<HTMLCanvasElement | null>(null)
  const rightRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const left = leftRef.current!
    const right = rightRef.current!
    left.width = left.height = displaySize
    right.width = right.height = displaySize
    const lctx = left.getContext('2d')!
    const rctx = right.getContext('2d')!

    // left: original
    lctx.imageSmoothingEnabled = true
    lctx.imageSmoothingQuality = 'high'
    lctx.clearRect(0, 0, displaySize, displaySize)
    lctx.drawImage(srcCanvas, 0, 0, displaySize, displaySize)

    // right: downsample then upsample to show pixelation
    const tmp = document.createElement('canvas')
    tmp.width = tmp.height = targetRes
    const tctx = tmp.getContext('2d')!
    tctx.clearRect(0, 0, targetRes, targetRes)

    if (filter === '最近邻') {
      tctx.imageSmoothingEnabled = false
      tctx.drawImage(srcCanvas, 0, 0, targetRes, targetRes)
    } else if (filter === '双线性') {
      tctx.imageSmoothingEnabled = true
      tctx.imageSmoothingQuality = 'medium'
      tctx.drawImage(srcCanvas, 0, 0, targetRes, targetRes)
    } else {
      tctx.imageSmoothingEnabled = true
      tctx.imageSmoothingQuality = 'high'
      tctx.drawImage(srcCanvas, 0, 0, targetRes, targetRes)
    }

    rctx.imageSmoothingEnabled = false
    rctx.clearRect(0, 0, displaySize, displaySize)
    rctx.drawImage(tmp, 0, 0, displaySize, displaySize)

    if (showGrid) {
      rctx.strokeStyle = 'rgba(15, 23, 42, 0.08)'
      rctx.lineWidth = 1
      const step = displaySize / targetRes
      for (let i = 0; i <= targetRes; i++) {
        const p = Math.round(i * step) + 0.5
        rctx.beginPath(); rctx.moveTo(p, 0); rctx.lineTo(p, displaySize); rctx.stroke()
        rctx.beginPath(); rctx.moveTo(0, p); rctx.lineTo(displaySize, p); rctx.stroke()
      }
    }
  }, [srcCanvas, targetRes, showGrid, filter])

  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  const heavy = targetRes >= 384

  return (
    <div className="flex flex-col gap-4">
      <Notice title="说明">
        左侧为原始图像，右侧为先缩小至目标分辨率再放大的效果；可切换图片源与插值方式进行对比。
      </Notice>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        <label className="text-sm text-slate-700">图片源
          <select value={source} onChange={(e) => setSource(e.target.value as SourceType)} className="ml-2 border border-slate-300 rounded px-2 py-1 text-sm">
            <option>几何</option>
            <option>棋盘</option>
            <option>噪声</option>
          </select>
        </label>
        <label className="text-sm text-slate-700">插值
          <select value={filter} onChange={(e) => setFilter(e.target.value as FilterType)} className="ml-2 border border-slate-300 rounded px-2 py-1 text-sm">
            <option>最近邻</option>
            <option>双线性</option>
            <option>双三次</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <div className="mb-2 text-sm text-slate-600">原始</div>
          <canvas ref={leftRef} className="w-full max-w-[420px] rounded border border-slate-200 shadow-sm" />
        </div>
        <div>
          <div className="mb-2 text-sm text-slate-600">重采样（目标分辨率 → 放大）</div>
          <canvas ref={rightRef} className="w-full max-w-[420px] rounded border border-slate-200 shadow-sm transition-transform duration-300" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <label className="flex-1">
          <div className="text-sm text-slate-700 mb-1">目标分辨率：<span className="font-medium text-slate-900">{targetRes}×{targetRes}</span></div>
          <input
            type="range"
            min={32}
            max={512}
            step={32}
            value={targetRes}
            onChange={(e) => setTargetRes(parseInt(e.target.value))}
            className="w-full accent-blue-600"
          />
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} />
          显示像素网格
        </label>
      </div>

      {isMobile && heavy && (
        <Notice tone="warning" title="性能提示">
          高分辨率重采样会占用更多算力与电量，若出现卡顿或发热，请降低目标分辨率。
        </Notice>
      )}
    </div>
  )
}