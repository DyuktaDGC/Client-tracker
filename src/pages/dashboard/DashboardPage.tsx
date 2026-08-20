import { useMemo } from 'react'
import { useDashboard } from '../../api/queries'
import { activityMatrix,activityRollup, chakraOptions, frameworkRollup,frameworksEnteredIn,matchesQuery,metaRollup,performanceTrend, performers,programSummary, rankClients, summariseClient} from '../../domain/selectors'
import { useFilterParams } from '../../hooks/useFilterParams'
import { formatPercent } from '../../lib/format'
import { chakraPeriod } from '../../lib/period'
import { reportFileName } from '../../lib/report'
import { PerformanceChart } from '../../components/dashboard/PerformanceChart'
import { ScoreHeadlineCard } from '../../components/dashboard/ScoreHeadlineCard'
import { SpotlightCard } from '../../components/dashboard/SpotlightCard'
import { FrameworkTable } from './FrameworkTable'
import { PerformerList } from './PerformerList'
import { TrainingActivityTable } from './TrainingActivityTable'
import { FilterBar } from '../../components/layout/FilterBar'
import { PageHeading } from '../../components/layout/PageHeading'
import { SectionCard } from '../../components/layout/SectionCard'
import { DownloadReportButton } from '../../components/ui/DownloadReportButton'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { SearchInput } from '../../components/ui/SearchInput'
import { Segmented } from '../../components/ui/Segmented'
import { Select } from '../../components/ui/Select'
import { Skeleton } from '../../components/ui/Skeleton'

const DEFAULTS = { chakra: 'all', client: 'all', q: '', view: 'all' }
const VIEWS = ['all', 'frameworks', 'trainings', 'dashboard'] as const
const PERFORMER_COUNT = 3

type BreakdownView = (typeof VIEWS)[number]

export function DashboardPage() {
  const { data, isPending, isError, error, refetch } = useDashboard()
  const [filters, setFilter, { clear, isDirty }] = useFilterParams(DEFAULTS)

  const allClients = useMemo(() => data?.clients ?? [], [data])
  const month = filters.chakra === 'all' ? null : Number(filters.chakra)

  const scoped = useMemo(
    () => (filters.client === 'all' ? allClients : allClients.filter((client) => client.id === filters.client)),
    [allClients, filters.client],
  )

  const summary = useMemo(() => programSummary(scoped, month), [scoped, month])

  const frameworkRows = useMemo(
    () => frameworkRollup(scoped, month).filter((row) => matchesQuery(filters.q, row.code, row.name)),
    [scoped, month, filters.q],
  )
  const trainingRows = useMemo(
    () => activityRollup(scoped, month).filter((row) => matchesQuery(filters.q, row.code, row.name)),
    [scoped, month, filters.q],
  )
  const dashboardRows = useMemo(
    () => metaRollup(scoped, month).filter((row) => matchesQuery(filters.q, row.code, row.name)),
    [scoped, month, filters.q],
  )

  const activities = useMemo(
    () => activityMatrix(scoped, month).filter((row) => matchesQuery(filters.q, row.name)),
    [scoped, month, filters.q],
  )
  const trend = useMemo(() => performanceTrend(scoped, data?.schema ?? []), [scoped, data])
  const ranked = useMemo(() => rankClients(allClients), [allClients])
  const { top, bottom } = useMemo(() => performers(scoped, PERFORMER_COUNT), [scoped])
  const spotlight = useMemo(
    () => ranked.find((client) => client.id === filters.client) ?? ranked[0],
    [ranked, filters.client],
  )

  if (isPending) {
    return (
      <div className="stagger space-y-5">
        <Skeleton className="h-[4.75rem] w-full rounded-2xl" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-80 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    )
  }

  if (isError) return <ErrorState error={error} onRetry={() => void refetch()} />

  if (allClients.length === 0) {
    return (
      <EmptyState
        title="No clients in the tracker yet"
        description="The sheet parsed cleanly but returned no rows with a business name."
      />
    )
  }

  const spotlightSummary = spotlight ? summariseClient(spotlight, month) : null
  const chakraName = chakraOptions(data.schema).find((option) => option.value === filters.chakra)?.label
  const period = chakraPeriod(spotlight?.startDate, month, data.schema.length)
  const showComparisons = filters.client === 'all'
  const view = VIEWS.includes(filters.view as BreakdownView) ? (filters.view as BreakdownView) : 'all'
  const selectedClient = allClients.find((client) => client.id === filters.client)
  const reportFile = reportFileName([
    selectedClient?.name ?? 'all clients',
    chakraName ?? 'all chakras',
    summary.grade ? `grade ${summary.grade}` : 'ungraded',
  ])

  const sections =
    view === 'frameworks'
      ? [{ key: 'frameworks', rows: frameworkRows }]
      : view === 'trainings'
        ? [{ key: 'trainings', rows: trainingRows }]
        : view === 'dashboard'
          ? [{ key: 'dashboard', rows: dashboardRows }]
          : [
              { key: 'frameworks', title: 'Frameworks', rows: frameworkRows },
              { key: 'trainings', title: 'Trainings & meetings', rows: trainingRows },
              { key: 'dashboard', title: 'Hostinger & dashboard', rows: dashboardRows },
            ]

  return (
    <>
      <FilterBar actions={<DownloadReportButton fileName={reportFile} />} onClear={isDirty ? clear : undefined}>
        <Select
          label="Chakra"
          icon="layers"
          value={filters.chakra}
          onChange={(value) => setFilter('chakra', value)}
          options={[{ value: 'all', label: 'All chakras' }, ...chakraOptions(data.schema)]}
        />
        <Select
          label="Client"
          icon="user"
          value={filters.client}
          onChange={(value) => setFilter('client', value)}
          options={[
            { value: 'all', label: 'All clients' },
            ...[...allClients]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((client) => ({ value: client.id, label: client.name })),
          ]}
        />
        <SearchInput
          label="Search"
          placeholder="Search framework or client…"
          value={filters.q}
          onChange={(value) => setFilter('q', value)}
        />
      </FilterBar>

      <div className="grid gap-4 lg:grid-cols-2">
        <ScoreHeadlineCard
          title={chakraName ?? 'Program average'}
          percent={summary.percent}
          grade={summary.grade}
          scored={summary.scored}
          possible={summary.possible}
        />

        {spotlight && spotlightSummary ? (
          <SpotlightCard
            eyebrow={filters.client === 'all' ? 'Top client' : 'Client focus'}
            name={spotlight.name}
            grade={spotlightSummary.grade}
            period={period}
            stats={[
              { label: 'Avg performance', value: formatPercent(spotlightSummary.percent) },
              { label: 'Frameworks done', value: String(frameworksEnteredIn(spotlight, month)) },
            ]}
          />
        ) : null}
      </div>

      <div className="space-y-3">
        <PageHeading title="Framework breakdown" />

        <Segmented
          label="Show"
          value={view}
          onChange={(next) => setFilter('view', next)}
          options={[
            {
              value: 'all',
              label: 'All',
              count: frameworkRows.length + trainingRows.length + dashboardRows.length,
            },
            { value: 'frameworks', label: 'Frameworks', count: frameworkRows.length },
            { value: 'trainings', label: 'Trainings', count: trainingRows.length },
            { value: 'dashboard', label: 'Dashboard', count: dashboardRows.length },
          ]}
        />

        <FrameworkTable sections={sections} />
      </div>

      {showComparisons ? (
        <div className="grid items-start gap-4 xl:grid-cols-4">
          <SectionCard
            className="xl:col-span-2 [animation-delay:120ms]"
            title="Training activity"
            subtitle="Operation · Sales · Marketing · Strategic"
            icon="calendar"
          >
            <TrainingActivityTable rows={activities} />
          </SectionCard>

          <SectionCard
            className="[animation-delay:180ms]"
            title="Top performers"
            subtitle="Highest overall score"
            icon="trophy"
            tone="good"
          >
            <PerformerList performers={top} variant="top" emptyTitle="No scores yet" />
          </SectionCard>

          <SectionCard
            className="[animation-delay:240ms]"
            title="Needs improvement"
            subtitle="Lowest overall score"
            icon="alert"
            tone="bad"
          >
            <PerformerList performers={bottom} variant="bottom" emptyTitle="No scores yet" />
          </SectionCard>
        </div>
      ) : null}

      <div className="space-y-3">
        <PageHeading title="Performance across chakras" icon="trend" />
        <PerformanceChart points={trend} activeMonth={month} />
      </div>
    </>
  )
}
