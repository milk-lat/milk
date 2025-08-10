import { useEffect, useMemo, useState } from 'react'

const LAYER_SIZES = [6, 8, 6, 4]

type Node = { x: number; y: number }

type Edge = { from: string; to: string }

export default function NeuralNetworkViz() {
  const width = 720
  const height = 360
  const paddingX = 60
  const paddingY = 40

  const layers: Node[][] = useMemo(() => {
    return LAYER_SIZES.map((count, layerIndex) => {
      const x = paddingX + (layerIndex * (width - 2 * paddingX)) / (LAYER_SIZES.length - 1)
      return Array.from({ length: count }, (_, i) => {
        const y = paddingY + (i * (height - 2 * paddingY)) / (count - 1)
        return { x, y }
      })
    })
  }, [])

  const edges: Edge[] = useMemo(() => {
    const list: Edge[] = []
    for (let l = 0; l < layers.length - 1; l++) {
      const fromLayer = layers[l]
      const toLayer = layers[l + 1]
      for (let i = 0; i < fromLayer.length; i++) {
        for (let j = 0; j < toLayer.length; j++) {
          list.push({ from: `${l}-${i}`, to: `${l + 1}-${j}` })
        }
      }
    }
    return list
  }, [layers])

  const [activePath, setActivePath] = useState<string[]>([])

  useEffect(() => {
    const id = window.setInterval(() => {
      const path: string[] = []
      let prevIndex = Math.floor(Math.random() * layers[0].length)
      path.push(`0-${prevIndex}`)
      for (let l = 1; l < layers.length; l++) {
        const currIndex = Math.floor(Math.random() * layers[l].length)
        path.push(`${l}-${currIndex}`)
        prevIndex = currIndex
      }
      setActivePath(path)
    }, 900)
    return () => window.clearInterval(id)
  }, [layers])

  const isNodeActive = (key: string) => activePath.includes(key)
  const isEdgeActive = (from: string, to: string) => {
    for (let i = 0; i < activePath.length - 1; i++) {
      if (activePath[i] === from && activePath[i + 1] === to) return true
    }
    return false
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-none">
        {edges.map((e) => {
          const [lf, nf] = e.from.split('-').map(Number)
          const [lt, nt] = e.to.split('-').map(Number)
          const p1 = layers[lf][nf]
          const p2 = layers[lt][nt]
          const active = isEdgeActive(e.from, e.to)
          return (
            <line
              key={`${e.from}->${e.to}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={active ? '#2563eb' : '#cbd5e1'}
              strokeWidth={active ? 2.5 : 1}
              opacity={active ? 0.95 : 0.6}
              style={{ transition: 'stroke 300ms, stroke-width 300ms, opacity 300ms' }}
            />
          )
        })}

        {layers.map((layer, l) => (
          <g key={l}>
            {layer.map((n, i) => {
              const key = `${l}-${i}`
              const active = isNodeActive(key)
              return (
                <g key={key}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={active ? 11 : 9.5}
                    fill={active ? '#1d4ed8' : '#ffffff'}
                    stroke={active ? '#1d4ed8' : '#64748b'}
                    strokeWidth={active ? 2 : 1.5}
                    style={{ transition: 'all 300ms', filter: active ? 'drop-shadow(0 0 6px rgba(29,78,216,0.35))' : 'none' }}
                  />
                </g>
              )
            })}
          </g>
        ))}
      </svg>
    </div>
  )
}