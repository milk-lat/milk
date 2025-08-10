import type { ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

type SectionProps = {
  id: string
  title: string
  description?: string
  children: ReactNode
}

export default function Section({ id, title, description, children }: SectionProps) {
  const { ref, inView } = useInView<HTMLElement>()
  return (
    <section
      id={id}
      ref={ref as any}
      className={[
        'section-spacing border-t border-slate-100 transition-all duration-700',
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      ].join(' ')}
    >
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