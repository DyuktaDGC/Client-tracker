import { cn } from '../../lib/cn'

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse rounded-lg bg-line/70', className)} aria-hidden="true" />
)
