import { Outlet } from 'react-router-dom'
import { ErrorBoundary } from './ErrorBoundary'
import { TopBar } from './TopBar'

export function AppShell() {
  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <TopBar />
      <main id="main" className="mx-auto max-w-[1600px] space-y-5 px-4 py-5 sm:px-6 sm:py-6">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  )
}
