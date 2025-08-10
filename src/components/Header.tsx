import { useState } from 'react'

const navItems = [
  { href: '#conv', label: '卷积层' },
  { href: '#nn', label: '神经网络' },
  { href: '#lm', label: '语言模型' },
  { href: '#img', label: '图片分辨率' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <a href="#" className="text-xl font-semibold tracking-tight">AI</a>
        <nav className="hidden md:flex gap-6 text-sm text-slate-600">
          {navItems.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-slate-900 transition-colors">
              {n.label}
            </a>
          ))}
        </nav>
        <button
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
          aria-label="菜单"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {open ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>
      <div className={["md:hidden overflow-hidden transition-[max-height,opacity] duration-500", open ? "max-h-64 opacity-100" : "max-h-0 opacity-0"].join(' ')}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex flex-col gap-2 text-sm">
          {navItems.map((n) => (
            <a key={n.href} href={n.href} className="py-2 text-slate-700 hover:text-slate-900 transition-colors" onClick={() => setOpen(false)}>
              {n.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  )
}