import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="glass-card p-8 text-center max-w-md mx-auto">
          <h1 className="text-xl font-semibold text-red-400 mb-4">Something went wrong</h1>
          <p className="text-gray-400 mb-6">Please refresh the page to try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary px-6 py-3"
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
