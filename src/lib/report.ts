import { toBlob } from 'html-to-image'

export const REPORT_ROOT_ID = 'report-root'

const CAPTURE_CLASS = 'is-capturing'
const MAX_EDGE_PX = 16384
const OBJECT_URL_TTL = 60_000
const PAINT_TIMEOUT = 150
const TARGET_SCALE = 2
const CAPTURE_TIMEOUT = 60_000

export class ReportError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'ReportError'
  }
}

const nextPaint = () =>
  new Promise<void>((resolve) => {
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      resolve()
    }

    window.setTimeout(finish, PAINT_TIMEOUT)
    requestAnimationFrame(() => requestAnimationFrame(finish))
  })

const withTimeout = <T>(work: Promise<T>, message: string) =>
  new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new ReportError(message)), CAPTURE_TIMEOUT)

    work.then(
      (value) => {
        window.clearTimeout(timer)
        resolve(value)
      },
      (error: unknown) => {
        window.clearTimeout(timer)
        reject(error)
      },
    )
  })

const pad = (value: number) => String(value).padStart(2, '0')

const slug = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-')
    .toLowerCase()

export function reportFileName(parts: Array<string | null | undefined>) {
  const now = new Date()
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`
  const base = parts
    .map((part) => (part ? slug(part) : ''))
    .filter(Boolean)
    .join('_')

  return `${base || 'dashboard'}_${stamp}.png`
}

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  link.rel = 'noopener'
  link.style.display = 'none'

  try {
    document.body.append(link)
    link.click()
  } catch (cause) {
    URL.revokeObjectURL(url)
    throw new ReportError('The browser blocked the download. Check your download settings and try again.', { cause })
  } finally {
    link.remove()
  }

  window.setTimeout(() => URL.revokeObjectURL(url), OBJECT_URL_TTL)
}

export async function captureReport(node: HTMLElement | null, fileName: string) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new ReportError('Reports can only be downloaded from a browser.')
  }

  if (!node || !node.isConnected) {
    throw new ReportError('The dashboard is still loading, so there is nothing to capture yet.')
  }

  const width = Math.ceil(Math.max(node.scrollWidth, node.offsetWidth))
  const height = Math.ceil(Math.max(node.scrollHeight, node.offsetHeight))

  if (width < 1 || height < 1) {
    throw new ReportError('The dashboard is not visible on screen, so it cannot be captured.')
  }

  const longestEdge = Math.max(width, height)

  if (longestEdge > MAX_EDGE_PX) {
    throw new ReportError('This page is too tall to export. Filter to a single client or chakra and try again.')
  }

  const pixelRatio = Math.max(1, Math.min(TARGET_SCALE, MAX_EDGE_PX / longestEdge))

  const root = document.documentElement
  root.classList.add(CAPTURE_CLASS)

  let blob: Blob | null

  try {
    await nextPaint()
    blob = await withTimeout(
      toBlob(node, {
        width,
        height,
        pixelRatio,
        skipFonts: true,
        backgroundColor: getComputedStyle(document.body).backgroundColor || '#ffffff',
      }),
      'Capturing the report took too long. Narrow the filters and try again.',
    )
  } catch (cause) {
    if (cause instanceof ReportError) throw cause
    throw new ReportError('The dashboard could not be rendered to an image.', { cause })
  } finally {
    root.classList.remove(CAPTURE_CLASS)
  }

  if (!blob || blob.size === 0) {
    throw new ReportError('The generated report came back empty. Reload the page and try again.')
  }

  saveBlob(blob, fileName)
}
