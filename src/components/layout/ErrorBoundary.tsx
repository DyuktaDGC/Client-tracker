import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorState } from '../ui/ErrorState'

interface Props {
  children: ReactNode
}

interface State {
  error: unknown
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: unknown): State {
    return { error }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error(error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="p-4 sm:p-6">
          <ErrorState error={this.state.error} onRetry={() => this.setState({ error: null })} />
        </div>
      )
    }
    return this.props.children
  }
}
