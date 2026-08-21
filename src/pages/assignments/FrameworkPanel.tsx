import type { AssignmentFramework, AssignmentQuestion } from '../../api/types'
import { frameworkName } from '../../domain/assignments'
import { cn } from '../../lib/cn'
import { formatPercent, formatScore } from '../../lib/format'
import { Meter } from '../../components/ui/Meter'

const read = (value: number | null, unit: AssignmentQuestion['unit']) =>
  value === null ? '—' : unit === 'percent' ? `${formatScore(value)}%` : formatScore(value)

export function FrameworkPanel({ framework }: { framework: AssignmentFramework }) {
  const name = frameworkName(framework)

  return (
    <section className="card card-lift animate-rise flex min-w-0 flex-col gap-3 p-4 sm:p-5">
      <header className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-xs font-black text-brand-dark">
          {framework.code}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-extrabold">{name}</h3>
          <p className="label">
            {framework.targetsSet}/{framework.questionCount} targets · {framework.doneSet} done
          </p>
        </div>
        <span className="text-xl font-black tabular-nums">{formatPercent(framework.completionPct)}</span>
      </header>

      <Meter percent={framework.completionPct} label={`${framework.code} completion`} />

      <div className="flex items-center gap-3 pt-1">
        <span className="flex-1" />
        <span className="label w-14 text-right">Target</span>
        <span className="label w-14 text-right">Done</span>
      </div>

      <ul>
        {framework.questions.map((question) => (
          <li key={question.qid} className="flex items-center gap-3 border-t border-line py-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-canvas text-[11px] font-bold tabular-nums text-ink-soft">
              {question.no}
            </span>
            <p className="min-w-0 flex-1 text-sm leading-snug text-ink-soft">{question.text}</p>
            <span className="w-14 rounded-lg bg-canvas px-2 py-1 text-right text-sm font-bold tabular-nums">
              {read(question.target, question.unit)}
            </span>
            <span
              className={cn(
                'w-14 rounded-lg px-2 py-1 text-right text-sm font-bold tabular-nums',
                question.done === null ? 'bg-canvas text-ink/40' : 'bg-good-soft text-good',
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
