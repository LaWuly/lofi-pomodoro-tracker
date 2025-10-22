import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import type { ReactNode, ComponentType, LazyExoticComponent } from 'react'
import { GridHub } from '@app/components/Grid/GridHub'
import { LoadingApp } from '@app/components/LoadingApp'

function LazyRoute({ children }: { children: ReactNode }) {
  return <Suspense fallback={<LoadingApp />}>{children}</Suspense>
}

type LazyComp = LazyExoticComponent<ComponentType<unknown>>

const ClockApp = lazy(() => import('@app/clock'))
const JournalApp = lazy(() => import('@app/journal'))
const WorkoutApp = lazy(() => import('@app/workout'))
const CycleApp = lazy(() => import('@app/cycle'))
const RecipesApp = lazy(() => import('@app/recipes'))
const MeditationApp = lazy(() => import('@app/meditation'))
const ArchiveApp = lazy(() => import('@app/archive'))

const routes: Array<{ path: string; Component: LazyComp }> = [
  { path: 'clock', Component: ClockApp },
  { path: 'journal', Component: JournalApp },
  { path: 'workout', Component: WorkoutApp },
  { path: 'cycle', Component: CycleApp },
  { path: 'recipes', Component: RecipesApp },
  { path: 'meditation', Component: MeditationApp },
  { path: 'archive', Component: ArchiveApp },
]

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<GridHub />} />

      {routes.map(({ path, Component }) => (
        <Route
          key={path}
          path={`/apps/${path}`}
          element={
            <LazyRoute>
              <Component />
            </LazyRoute>
          }
        />
      ))}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
