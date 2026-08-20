import { ApiError } from '../../lib/http'
import { Icon } from './Icon'

interface ErrorStateProps {
  error: unknown
  onRetry?: () => void
}

const describe = (error: unknown) => {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error && error.message) return error.message
  return 'Something went wrong while loading this page.'
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div
      className="card animate-pop flex flex-col items-center gap-3 border-bad/25 bg-bad-soft/40 px-6 py-12 text-center"
      role="alert"
    >
      <span className="animate-pop flex h-11 w-11 items-center justify-center rounded-xl bg-bad-soft text-bad [animation-delay:90ms]">
        <Icon name="alert" size={20} />
      </span>
      <h3 className="text-base font-bold">Could not load the data</h3>
      <p className="max-w-md text-sm text-ink-soft">{describe(error)}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="press rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink/90"
        >
          Try again
        </button>
      ) : null}
    </div>
  )
}
