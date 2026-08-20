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
        disabled={status === 'working'}
        aria-busy={status === 'working'}
        title={message || `Save the whole page as ${fileName}`}
        className={cn(
          'press group inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold uppercase tracking-[0.06em]',
          status === 'error'
            ? 'border-bad/40 bg-bad-soft text-bad'
            : status === 'done'
              ? 'border-good/40 bg-good-soft text-good'
              : 'border-line text-ink-soft hover:border-brand/40 hover:bg-brand-soft hover:text-brand-dark',
          status === 'working' && 'cursor-progress opacity-70',
        )}
      >
        <Icon
          name={status === 'done' ? 'check' : status === 'error' ? 'alert' : 'download'}
          size={14}
          className={cn(
            'transition-transform duration-300 ease-spring',
            status === 'working' ? 'animate-pulse' : 'group-hover:translate-y-0.5',
          )}
        />
        {LABELS[status]}
      </button>
    </div>
  )
}
