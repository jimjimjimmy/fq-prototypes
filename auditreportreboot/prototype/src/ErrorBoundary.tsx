import { Component, type ReactNode } from 'react'

// Temporary debug boundary so we can read crash errors in the DOM
// instead of just seeing a blank page. Remove once date range is sorted.

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error.message, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <pre
          id="error-boundary-output"
          style={{
            padding: 24,
            margin: 24,
            background: '#fff4f4',
            border: '1px solid #f5a3a3',
            color: '#b91c1c',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            fontSize: 12,
          }}
        >
          {this.state.error.message}
          {'\n\n'}
          {this.state.error.stack}
        </pre>
      )
    }
    return this.props.children
  }
}
