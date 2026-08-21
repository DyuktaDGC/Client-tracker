import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { Icon, type IconName } from '../ui/Icon'

const VIEWS: Array<{ to: string; label: string; icon: IconName }> = [
  { to: '/', label: 'Client performance', icon: 'trend' },
  { to: '/assignments', label: '30-day assignments', icon: 'layers' },
]

export function ViewToggle({ className }: { className?: string }) {
  return (
    <nav
      aria-label="Dashboards"
      className={cn('flex items-center gap-1 rounded-full border border-line bg-canvas p-1', className)}
    >
      {VIEWS.map((view) => (
        <NavLink
          key={view.to}
          to={view.to}
          end
          className={({ isActive }) =>
            cn(
              'press flex h-9 flex-1 items-center justify-center gap-2 rounded-full px-3 text-[11px] font-bold uppercase tracking-[0.06em] sm:flex-none sm:px-4',
              isActive
                ? 'bg-surface text-ink shadow-[0_2px_10px_-4px_rgba(18,32,58,0.55)]'
                : 'text-ink/50 hover:text-brand-dark',
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon name={view.icon} size={14} className={cn('shrink-0', isActive && 'text-brand')} />
              <span className="truncate">{view.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
