type NoticeProps = {
  title?: string
  children: React.ReactNode
  tone?: 'info' | 'warning'
}

export default function Notice({ title, children, tone = 'info' }: NoticeProps) {
  const toneClasses = tone === 'warning'
    ? 'bg-amber-50 border-amber-200 text-amber-800'
    : 'bg-blue-50 border-blue-200 text-blue-800'
  const icon = tone === 'warning' ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9v4" /><path d="M12 17h.01" /><path d="m10.29 3.86-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.71-3.14l-8-14a2 2 0 0 0-3.42 0Z" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </svg>
  )

  return (
    <div className={["flex gap-3 items-start rounded-md border px-3 py-2 text-sm", toneClasses].join(' ')}>
      <span className="mt-0.5">{icon}</span>
      <div>
        {title && <div className="font-medium mb-0.5">{title}</div>}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  )
}