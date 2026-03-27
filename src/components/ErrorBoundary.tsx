'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
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

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-gray-700 font-semibold mb-1">發生錯誤</p>
            <p className="text-gray-500 text-sm mb-4">
              {this.state.error?.message ?? '請重新整理頁面再試'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium"
            >
              重試
            </button>
          </div>
        )
      )
    }
    return this.props.children
  }
}
