import type { BreakdownRow } from '../../domain/selectors'
import { formatPercent, formatScore } from '../../lib/format'
import { DataTable, type Column, type TableSection } from '../../components/ui/DataTable'
import { EmptyState } from '../../components/ui/EmptyState'
import { Meter } from '../../components/ui/Meter'

const columns: Column<BreakdownRow>[] = [
  {
    key: 'week',
    header: 'Week',
    align: 'center',
    className: 'w-[4.5rem]',
    render: (row) =>
      row.week === null ? (
        <span className="font-bold text-brand-dark">{row.code}</span>
      ) : (
        <span className="font-semibold text-ink-soft">{row.week}</span>
      ),
  },
  {
    key: 'framework',
    header: 'Item',
    className: 'w-[40%]',
    render: (row) => (
      <div className="flex min-w-[14rem] items-baseline gap-2">
        {row.kind === 'framework' ? <span className="font-bold">{row.code}</span> : null}
        <span className="text-ink-soft">{row.name}</span>
        {row.kind === 'framework' || row.month === null ? null : (
          <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-ink-faint">C{row.month}</span>
        )}
      </div>
    ),
  },
  {
    key: 'progress',
    header: 'Progress',
    className: 'w-[20rem]',
    render: (row) => <Meter percent={row.percent} label={`${row.code} progress`} />,
  },
  {
    key: 'percent',
    header: '%',
    align: 'right',
    className: 'w-[5.5rem]',
    render: (row) => <span className="font-black tabular-nums">{formatPercent(row.percent)}</span>,
  },
  {
    key: 'score',
    header: 'Score',
    align: 'right',
    className: 'w-[7.5rem]',
    render: (row) => (
      <span className="whitespace-nowrap font-bold tabular-nums">
        {formatScore(row.scored)}
        <span className="text-ink-faint">/{formatScore(row.possible)}</span>
      </span>
    ),
  },
]

export function FrameworkTable({ sections }: { sections: TableSection<BreakdownRow>[] }) {
  return (
    <DataTable
      columns={columns}
      sections={sections}
      rowKey={(row) => row.code}
      minWidth="46rem"
      maxHeight="42rem"
      empty={
        <EmptyState
          title="Nothing matches these filters"
          description="Try a different chakra, clear the search box, or switch back to all clients."
        />
      }
    />
  )
}
