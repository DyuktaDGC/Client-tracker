import type { ScopeRow } from '../../domain/assignments'
import { cn } from '../../lib/cn'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { EmptyState } from '../../components/ui/EmptyState'
import { Meter } from '../../components/ui/Meter'

const counter = (part: number, whole: number, tone?: string) => (
  <span className={cn('whitespace-nowrap font-bold tabular-nums', tone)}>
    {part}
    <span className="text-ink/45">/{whole}</span>
  </span>
)

export function ClientTable({ rows, onSelect }: { rows: ScopeRow[]; onSelect: (id: string) => void }) {
  const columns: Column<ScopeRow>[] = [
    {
      key: 'client',
      header: 'Client',
      className: 'w-[35%] sm:w-[38%]',
      render: (row) => (
        <button
          type="button"
          onClick={() => onSelect(row.client.id)}
          className="press min-w-0 truncate text-left font-bold hover:text-brand-dark"
        >
          {row.client.name}
        </button>
      ),
    },
    {
      key: 'targets',
      header: 'Targets set',
      align: 'right',
      className: 'w-[7rem] sm:w-[9rem]',
      render: (row) => counter(row.batch.targetsSet, row.batch.questionCount, 'text-brand-dark'),
    },
    {
      key: 'done',
      header: 'Done',
      align: 'right',
      className: 'w-[7rem] sm:w-[9rem]',
      render: (row) => counter(row.batch.doneSet, row.batch.questionCount, row.batch.doneSet > 0 ? 'text-good' : undefined),
    },
    {
      key: 'coverage',
      header: 'Targets filled',
      className: 'hidden w-[14rem] sm:table-cell md:w-[20rem]',
      render: (row) => <Meter percent={row.batch.targetFillPct} label={`${row.client.name} targets set`} />,
    },
  ]

  return (
    <DataTable
      columns={columns}
      sections={[{ key: 'clients', rows }]}
      rowKey={(row) => `${row.client.id}-${row.batch.batchId}`}
      minWidth="32rem"
      maxHeight="38rem"
      empty={
        <EmptyState
          title="Nothing matches these filters"
          description="Try another period, clear the search box, or switch back to all clients."
        />
      }
    />
  )
}
