import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-8 max-w-md text-center">
            <p className="text-red-500 text-lg font-bold mb-2">Algo salio mal</p>
            <p className="text-gray-400 text-sm mb-4">
              {this.state.error?.message || 'Error desconocido'}
            </p>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.reload() }}
              className="bg-primary-500 hover:bg-primary-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition"
            >
              Recargar pagina
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
