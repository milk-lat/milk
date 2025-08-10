type SectionProps = {
  id: string
  title: string
  description?: string
  children: React.ReactNode
}

export default function Section({ id, title, description, children }: SectionProps) {
  return (
    <section id={id} className="section-spacing border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">{title}</h2>
          {description && (
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl">{description}</p>
          )}
        </div>
        {children}
      </div>
    </section>
  )
}