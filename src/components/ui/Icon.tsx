import type { SVGProps } from 'react'

export type IconName =
  | 'trend'
  | 'search'
  | 'calendar'
  | 'user'
  | 'building'
  | 'bolt'
  | 'refresh'
  | 'alert'
  | 'back'
  | 'inbox'
  | 'close'
  | 'layers'
  | 'trophy'
  | 'chevron'
  | 'check'
  | 'download'

const PATHS: Record<IconName, string> = {
  trend: 'M3 17l6-6 4 4 8-8M21 7h-5m5 0v5',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 2l-4.35-4.35',
  calendar: 'M7 3v4M17 3v4M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  building: 'M3 21h18M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M19 21V11a2 2 0 0 0-2-2h-2M9 7h2M9 11h2M9 15h2',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z',
  refresh: 'M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6',
  alert: 'M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
  back: 'M19 12H5m0 0l7 7m-7-7l7-7',
  inbox: 'M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
  close: 'M18 6L6 18M6 6l12 12',
  layers: 'M12 2l9 5-9 5-9-5 9-5zm9 10l-9 5-9-5m18 5l-9 5-9-5',
  trophy: 'M8 21h8m-4-4v4m7-17H5v4a7 7 0 0 0 14 0V4zM5 6H3a3 3 0 0 0 3 3m13-3h2a3 3 0 0 1-3 3',
  chevron: 'M6 9l6 6 6-6',
  check: 'M20 6L9 17l-5-5',
  download: 'M12 3v12m0 0l4-4m-4 4l-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2',
}

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  size?: number
}

export function Icon({ name, size = 16, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
