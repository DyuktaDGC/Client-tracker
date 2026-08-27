import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface Column<T> {
  key: string
  header: string
  align?: 'left' | 'right' | 'center'
  className?: string
  render: (row: T) => ReactNode
}

export interface TableSection<T> {
  key: string
  title?: string
  rows: T[]
}

interface DataTableProps<T> {
  columns: Column<T>[]
  sections: TableSection<T>[]
  rowKey: (row: T) => string
  rowClassName?: (row: T) => string | undefined
  maxHeight?: string
  minWidth?: string
  empty: ReactNode
}

const alignOf = (align: Column<unknown>['align']) =>
  align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'

export function DataTable<T>({
  columns,
  sections,
  rowKey,
  rowClassName,
  maxHeight = '34rem',
  minWidth = '42rem',
  empty,
}: DataTableProps<T>) {
  const filled = sections.filter((section) => section.rows.length > 0)
  if (filled.length === 0) return <>{empty}</>

  return (
    <div className="card animate-rise overflow-hidden">
      <div className="group/table relative overflow-auto" style={{ maxHeight }}>
        <table className="w-full table-fixed border-collapse text-sm" style={{ minWidth }}>
          <thead className="sticky top-0 z-10 bg-surface">
            <tr className="border-b border-line">
              {columns.map((column) => (
                <th key={column.key} scope="col" className={cn('bg-surface px-3 py-2.5 sm:px-4 sm:py-3', column.className)}>
                  <span className={cn('label block', alignOf(column.align))}>{column.header}</span>
                </th>
              ))}
            </tr>
          </thead>

          {filled.map((section) => (
            <tbody key={section.key}>
              {section.title ? (
                <tr className="border-y border-brand/20 bg-brand-soft">
                  <th scope="colgroup" colSpan={columns.length} className="px-4 py-2.5">
                    <span className="label block text-left text-brand-dark">{section.title}</span>
                  </th>
                </tr>
              ) : null}

              {section.rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  className={cn(
                    'border-b border-line transition-colors duration-200 last:border-0 hover:bg-brand-soft/45',
                    'hover:[&>td:first-child]:shadow-[inset_3px_0_0_0_var(--color-brand)]',
                    rowClassName?.(row),
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'px-3 py-2.5 align-middle transition-shadow duration-200 sm:px-4 sm:py-3',
                        alignOf(column.align),
                        column.className,
                      )}
                    >
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
        <div
          aria-hidden
          className="pointer-events-none sticky bottom-0 right-0 h-6 w-12 -translate-x-1 bg-gradient-to-l from-surface/80 to-transparent opacity-0 transition-opacity duration-200 group-focus-within/table:opacity-100 sm:hidden"
          style={{ boxShadow: '-8px 0 12px -4px rgba(0,0,0,0.08)' }}
        />
      </div>
    </div>
  )
}
