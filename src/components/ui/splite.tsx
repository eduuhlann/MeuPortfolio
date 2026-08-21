// src/components/ui/splite.tsx
'use client'

import { Component, Suspense, lazy, type ReactNode } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

class SplineErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-neutral-950">
          <p className="text-neutral-400 text-sm px-4 text-center">
            Não foi possível carregar a cena 3D.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <SplineErrorBoundary>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-neutral-950">
            <span className="loader"></span>
          </div>
        }
      >
        <Spline
          scene={scene}
          className={className}
        />
      </Suspense>
    </SplineErrorBoundary>
  )
}
