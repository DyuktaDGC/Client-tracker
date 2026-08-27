import { ACTIVITY_LABELS, type ActivityRow } from '../../domain/selectors'
import type { ActivityKey } from '../../api/types'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { EmptyState } from '../../components/ui/EmptyState'
import { ScoreChip } from '../../components/ui/ScoreChip'

const KEYS = Object.keys(ACTIVITY_LABELS) as ActivityKey[]

const columns: Column<ActivityRow>[] = [
  {
    key: 'client',
    header: 'Client',
    render: (row) => <span className="block min-w-[7rem] font-semibold sm:min-w-[9rem]">{row.name}</span>,
  },
  ...KEYS.map<Column<ActivityRow>>((key) => ({
    key,
    header: ACTIVITY_LABELS[key].replace(' training', ''),
    align: 'center',
    className: 'w-[4rem] sm:w-[5rem]',
    render: (row) => <ScoreChip value={row.values[key]} />,
  })),
]

export function TrainingActivityTable({ rows }: { rows: ActivityRow[] }) {
  return (
    <div className="space-y-3">
      <DataTable
        columns={columns}
        sections={[{ key: 'clients', rows }]}
        rowKey={(row) => row.id}
        maxHeight="30rem"
        minWidth="24rem"
        empty={<EmptyState title="No activity scores" description="No training columns were filled in for this filter." />}
      />
      <ul className="flex flex-wrap items-center gap-4 px-1 text-[11px] font-bold uppercase tracking-[0.06em] text-ink-soft">
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-good" />6–10
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-bad" />0–5
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-line" />Not started
        </li>
      </ul>
    </div>
  )
}
