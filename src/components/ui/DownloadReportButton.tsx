import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/cn'
import { REPORT_ROOT_ID, captureReport } from '../../lib/report'
import { Icon } from './Icon'

type Status = 'idle' | 'working' | 'done' | 'error'

const LABELS: Record<Status, string> = {
  idle: 'Download report',
  working: 'Capturing…',
  done: 'Saved',
  error: 'Retry download',
}

interface DownloadReportButtonProps {
  fileName: string
  className?: string
}

export function DownloadReportButton({ fileName, className }: DownloadReportButtonProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const busy = useRef(false)
  const alive = useRef(true)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    alive.current = true

    return () => {
      alive.current = false
      window.clearTimeout(timer.current)
    }
  }, [])

  const settle = useCallback((next: Status, text: string, delay: number) => {
    if (!alive.current) return

    setStatus(next)
    setMessage(text)
    timer.current = window.setTimeout(() => {
      if (!alive.current) return
      setStatus('idle')
      setMessage('')
    }, delay)
  }, [])

  const download = useCallback(async () => {
    if (busy.current) return

    busy.current = true
    window.clearTimeout(timer.current)
    setStatus('working')
    setMessage('')

    try {
      await captureReport(document.getElementById(REPORT_ROOT_ID), fileName)
      settle('done', '', 2600)
    } catch (error) {
      settle('error', error instanceof Error ? error.message : 'The report could not be created.', 8000)
    } finally {
      busy.current = false
    }
  }, [fileName, settle])

  const working = status === 'working'

  return (
    <div data-report-hide className={cn('flex min-w-0 items-center gap-2', className)}>
      {status === 'error' && message ? (
        <p role="alert" className="max-w-[16rem] text-[11px] font-semibold leading-tight text-bad">
          {message}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => void download()}
        disabled={working}
        aria-busy={working}
        aria-live="polite"
        title={message || `Save the whole page as ${fileName}`}
        className={cn(
          'press group relative isolate inline-flex h-11 w-[12.5rem] shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl border px-3 text-xs font-bold uppercase tracking-[0.06em] transition-colors duration-300',
          status === 'error'
            ? 'border-bad/40 bg-bad-soft text-bad'
            : status === 'done'
              ? 'border-good/40 bg-good-soft text-good'
              : working
                ? 'cursor-progress border-brand/40 bg-brand-soft text-brand-dark'
                : 'border-line text-ink-soft hover:border-brand/40 hover:bg-brand-soft hover:text-brand-dark',
        )}
      >
        {working ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-brand/20 to-transparent [animation:sweep_1.15s_var(--ease-soft)_infinite]"
          />
        ) : null}

        <span className="relative flex h-3.5 w-3.5 items-center justify-center">
          {working ? (
            <span
              aria-hidden="true"
              className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current/25 border-t-current"
            />
          ) : (
            <Icon
              name={status === 'done' ? 'check' : status === 'error' ? 'alert' : 'download'}
              size={14}
              className={cn(
                'transition-transform duration-300 ease-spring',
                status === 'done' ? 'animate-pop' : 'group-hover:translate-y-0.5',
              )}
            />
          )}
        </span>

        {LABELS[status]}
      </button>
    </div>
  )
}
