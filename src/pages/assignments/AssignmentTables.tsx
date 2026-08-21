import type { FrameworkRow, ScopeRow } from '../../domain/assignments'
import { formatPercent } from '../../lib/format'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { EmptyState } from '../../components/ui/EmptyState'
import { Meter } from '../../components/ui/Meter'

const empty = (
  <EmptyState
    title="Nothing matches these filters"
    description="Try another period, clear the search box, or switch back to all clients."
  />
)

const counter = (part: number, whole: number) => (
  <span className="whitespace-nowrap font-bold tabular-nums">
    {part}
    <span className="text-ink/45">/{whole}</span>
  </span>
)

export function ClientTable({ rows, onSelect }: { rows: ScopeRow[]; onSelect: (id: string) => void }) {
  const columns: Column<ScopeRow>[] = [
    {
      key: 'client',
      header: 'Client',
      className: 'w-[32%]',
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
      className: 'w-[8rem]',
      render: (row) => counter(row.batch.targetsSet, row.batch.questionCount),
    },
    {
      key: 'done',
      header: 'Completed',
      align: 'right',
      className: 'w-[8rem]',
      render: (row) => counter(row.batch.doneSet, row.batch.questionCount),
    },
    {
      key: 'coverage',
      header: 'Target coverage',
      className: 'w-[18rem]',
      render: (row) => <Meter percent={row.batch.targetFillPct} label={`${row.client.name} target coverage`} />,
    },
    {
      key: 'completion',
      header: 'Completion',
      align: 'right',
      className: 'w-[7rem]',
      render: (row) => <span className="font-black tabular-nums">{formatPercent(row.batch.completionPct)}</span>,
    },
  ]

  return (
    <DataTable
      columns={columns}
      sections={[{ key: 'clients', rows }]}
      rowKey={(row) => `${row.client.id}-${row.batch.batchId}`}
      minWidth="48rem"
      maxHeight="38rem"
      empty={empty}
    />
  )
}

const frameworkColumns: Column<FrameworkRow>[] = [
  {
    key: 'code',
    header: 'Code',
    align: 'center',
    className: 'w-[5rem]',
    render: (row) => <span className="font-bold text-brand-dark">{row.code}</span>,
  },
  {
    key: 'name',
    header: 'Framework',
    className: 'w-[34%]',
    render: (row) => <span className="text-ink-soft">{row.name}</span>,
  },
  {
    key: 'targets',
    header: 'Targets set',
    align: 'right',
    className: 'w-[8rem]',
    render: (row) => counter(row.targetsSet, row.questionCount),
  },
  {
    key: 'progress',
    header: 'Completion',
    className: 'w-[18rem]',
    render: (row) => <Meter percent={row.completionPct} label={`${row.code} completion`} />,
  },
  {
    key: 'percent',
    header: '%',
    align: 'right',
    className: 'w-[6rem]',
    render: (row) => <span className="font-black tabular-nums">{formatPercent(row.completionPct)}</span>,
  },
]

export function FrameworkRollupTable({ rows }: { rows: FrameworkRow[] }) {
  return (
    <DataTable
      columns={frameworkColumns}
      sections={[{ key: 'frameworks', rows }]}
      rowKey={(row) => row.code}
      minWidth="46rem"
      maxHeight="38rem"
      empty={empty}
    />
  )
}
