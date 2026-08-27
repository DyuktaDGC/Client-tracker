import type { AssignmentFramework, AssignmentQuestion } from '../../api/types'
import { frameworkName } from '../../domain/assignments'
import { cn } from '../../lib/cn'
import { formatPercent, formatScore } from '../../lib/format'
import { Meter } from '../../components/ui/Meter'

const ORDER = ['brand', 'info', 'good', 'amber', 'bad'] as const

type PanelTone = (typeof ORDER)[number]

const TONES: Record<PanelTone, { card: string; badge: string }> = {
  brand: { card: 'border-brand/25 bg-brand-soft/40', badge: 'bg-brand' },
  info: { card: 'border-info/25 bg-info-soft/50', badge: 'bg-info' },
  good: { card: 'border-good/25 bg-good-soft/50', badge: 'bg-good' },
  amber: { card: 'border-amber/30 bg-warn-soft/50', badge: 'bg-amber' },
  bad: { card: 'border-bad/25 bg-bad-soft/50', badge: 'bg-bad' },
}

const read = (value: number | null, unit: AssignmentQuestion['unit']) =>
  value === null ? '' : unit === 'percent' ? `${formatScore(value)}%` : formatScore(value)

export function FrameworkPanel({ framework, index }: { framework: AssignmentFramework; index: number }) {
  const tone: PanelTone = ORDER[index % ORDER.length] ?? 'brand'
  const completion = framework.questionCount > 0 ? (framework.doneSet / framework.questionCount) * 100 : null

  return (
    <section className={cn('card card-lift animate-rise flex min-w-0 flex-col gap-3 p-4 sm:p-5', TONES[tone].card)}>
      <header className="flex items-center gap-3">
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-black text-white',
            TONES[tone].badge,
          )}
        >
          {framework.code}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-extrabold">{frameworkName(framework)}</h3>
          <p className="label">
            {framework.targetsSet}/{framework.questionCount} targets · {framework.doneSet} done
          </p>
        </div>
        <span className="text-xl font-black tabular-nums">{formatPercent(completion)}</span>
      </header>

      <Meter percent={completion} label={`${framework.code} done`} className="bg-surface/70" />

      <div className="flex items-center gap-2 pt-1 sm:gap-3">
        <span className="flex-1" />
        <span className="label w-11 text-right sm:w-14">Target</span>
        <span className="label w-11 text-right sm:w-14">Done</span>
      </div>

      <ul>
        {framework.questions.map((question) => (
          <li key={question.qid} className="flex items-center gap-2 border-t border-line/70 py-2 sm:gap-3 sm:py-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-surface/80 text-[10px] font-bold tabular-nums text-ink-soft sm:h-6 sm:w-6 sm:text-[11px]">
              {question.no}
            </span>
            <p className="min-w-0 flex-1 text-xs leading-snug text-ink-soft sm:text-sm">{question.text}</p>
            <span className="inline-flex h-6 w-11 shrink-0 items-center justify-end rounded-lg border border-line bg-surface px-1.5 text-xs font-bold tabular-nums sm:h-7 sm:w-14 sm:px-2 sm:text-sm">
              {read(question.target, question.unit)}
            </span>
            <span
              className={cn(
                'inline-flex h-6 w-11 shrink-0 items-center justify-end rounded-lg border px-1.5 text-xs font-bold tabular-nums sm:h-7 sm:w-14 sm:px-2 sm:text-sm',
                question.done === null ? 'border-line bg-surface' : 'border-good bg-good text-white',
              )}
            >
              {read(question.done, question.unit)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
