import { SwapForm } from './components/features/swap-form'
import { ErrorBoundary } from './components/ui/error-boundary'

function App() {
  return (
    <ErrorBoundary>
      <SwapForm />
    </ErrorBoundary>
  )
}

export default App
