import { cn } from '../../lib/cn'

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('skeleton', className)} aria-hidden="true" />
)
