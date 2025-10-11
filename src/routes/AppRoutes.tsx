import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { GridHub } from '@app/components/Grid/GridHub'
import { LoadingApp } from '@app/components/LoadingApp'

const ClockApp = lazy(() => import('../app/clock'))
const CalculatorApp = lazy(() => import('../app/calculator'))
const MarkdownApp = lazy(() => import('../app/markdown'))
const JournalApp = lazy(() => import('../app/journal'))
const DrumApp = lazy(() => import('../app/drum'))

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<GridHub />} />

      <Route
        path="/apps/clock"
        element={
          <Suspense fallback={<LoadingApp />}>
            <ClockApp />
          </Suspense>
        }
      />
      <Route
        path="/apps/calculator"
        element={
          <Suspense fallback={<LoadingApp />}>
            <CalculatorApp />
          </Suspense>
        }
      />
      <Route
        path="/apps/markdown"
        element={
          <Suspense fallback={<LoadingApp />}>
            <MarkdownApp />
          </Suspense>
        }
      />
      <Route
        path="/apps/journal"
        element={
          <Suspense fallback={<LoadingApp />}>
            <JournalApp />
          </Suspense>
        }
      />
      <Route
        path="/apps/drum"
        element={
          <Suspense fallback={<LoadingApp />}>
            <DrumApp />
          </Suspense>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
