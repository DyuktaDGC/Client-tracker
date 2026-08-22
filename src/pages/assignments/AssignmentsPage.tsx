import { useMemo } from 'react'
import { useAssignments } from '../../api/queries'
import type { AssignmentsResponse } from '../../api/types'
import { detailFrameworks, frameworkOptions, scopeFramework, scopeRows, totalsOf } from '../../domain/assignments'
import { matchesQuery } from '../../domain/selectors'
import { useFilterParams } from '../../hooks/useFilterParams'
import { periodLabel } from '../../lib/period'
import { reportFileName } from '../../lib/report'
import { ScoreHeadlineCard } from '../../components/dashboard/ScoreHeadlineCard'
import { SpotlightCard } from '../../components/dashboard/SpotlightCard'
import { FilterBar } from '../../components/layout/FilterBar'
import { PageHeading } from '../../components/layout/PageHeading'
import { DownloadReportButton } from '../../components/ui/DownloadReportButton'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { SearchInput } from '../../components/ui/SearchInput'
import { Select } from '../../components/ui/Select'
import { Skeleton } from '../../components/ui/Skeleton'
import { ClientTable } from './AssignmentTables'
import { FrameworkPanel } from './FrameworkPanel'

const DEFAULTS = { batch: 'all', client: 'all', framework: 'all', q: '' }

function AssignmentsView({ data }: { data: AssignmentsResponse }) {
  const [filters, setFilter, { clear, isDirty }] = useFilterParams(DEFAULTS)

  const scoped = useMemo(() => scopeRows(data, filters.batch, filters.client), [data, filters.batch, filters.client])
  const rows = useMemo(() => scopeFramework(scoped, filters.framework), [scoped, filters.framework])
  const frameworks = useMemo(() => frameworkOptions(data), [data])
  const totals = useMemo(() => totalsOf(rows), [rows])
  const clientRows = useMemo(() => rows.filter((row) => matchesQuery(filters.q, row.client.name)), [rows, filters.q])
  const panels = useMemo(() => detailFrameworks(rows, filters.q), [rows, filters.q])

  const client = filters.client === 'all' ? null : data.clients.find((entry) => entry.id === filters.client)
  const framework = frameworks.find((entry) => entry.value === filters.framework)
  const batch =
    data.batches.find((entry) => entry.batchId === filters.batch) ?? (data.batchCount === 1 ? data.batches[0] : undefined)

  return (
    <>
      <FilterBar
        actions={<DownloadReportButton fileName={reportFileName(['assignments', client?.name, batch?.label, framework?.value])} />}
        onClear={isDirty ? clear : undefined}
      >
        <Select
          label="Chakra"
          icon="calendar"
          value={filters.batch}
          onChange={(value) => setFilter('batch', value)}
          options={[
            { value: 'all', label: 'All chakras' },
            ...data.batches.map((entry) => ({ value: entry.batchId, label: entry.label })),
          ]}
        />
        <Select
          label="Client"
          icon="user"
          value={filters.client}
          onChange={(value) => setFilter('client', value)}
          options={[
            { value: 'all', label: 'All clients' },
            ...data.clients.map((entry) => ({ value: entry.id, label: entry.name })),
          ]}
        />
        <Select
          label="Framework"
          icon="layers"
          value={filters.framework}
          onChange={(value) => setFilter('framework', value)}
          options={[{ value: 'all', label: 'All frameworks' }, ...frameworks]}
        />
        <SearchInput
          label="Search"
          placeholder="Search framework, question or client…"
          value={filters.q}
          onChange={(value) => setFilter('q', value)}
        />
      </FilterBar>

      <div className="grid gap-4 lg:grid-cols-2">
        <ScoreHeadlineCard
          title={framework?.label ?? batch?.label ?? 'All chakras'}
          percent={totals.targetFillPct}
          grade={null}
          scored={totals.targetsSet}
          possible={totals.questionCount}
          unit="targets set"
        />
        <SpotlightCard
          eyebrow={client ? 'Client focus' : 'Scope'}
          name={client?.name ?? `${totals.clientCount} clients`}
          grade={null}
          period={batch ? periodLabel(batch.periodStart, batch.periodEnd) : null}
        />
      </div>

      {client ? (
        <div className="space-y-3">
          <PageHeading title="Framework detail" icon="bolt" />
          {panels.length ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {panels.map((framework, index) => (
                <FrameworkPanel key={`${framework.code}-${framework.order}`} framework={framework} index={index} />
              ))}
            </div>
          ) : (
            <EmptyState title="No questions match this search" description="Clear the search box to see every framework." />
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <PageHeading title="Client progress" icon="trend" />
          <ClientTable rows={clientRows} onSelect={(id) => setFilter('client', id)} />
        </div>
      )}
    </>
  )
}

export function AssignmentsPage() {
  const { data, isPending, isError, error, refetch } = useAssignments()

  if (isPending) {
    return (
      <div className="stagger space-y-5">
        <Skeleton className="h-[4.75rem] w-full rounded-2xl" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    )
  }

  if (isError) return <ErrorState error={error} onRetry={() => void refetch()} />

  if (data.clients.length === 0) {
    return (
      <EmptyState
        title="No clients in the assignment sheet"
        description="The sheet parsed cleanly but no period tab returned a client column."
      />
    )
  }

  return <AssignmentsView data={data} />
}
