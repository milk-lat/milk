const navItems = [
  { href: '#conv', label: '卷积层' },
  { href: '#nn', label: '神经网络' },
  { href: '#lm', label: '语言模型' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <a href="#" className="text-xl font-semibold tracking-tight">AI</a>
        <nav className="hidden md:flex gap-6 text-sm text-slate-600">
          {navItems.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-slate-900">
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}