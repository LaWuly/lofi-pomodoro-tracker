import { AppRoutes } from './routes/AppRoutes'
import { ThemeToggle } from '@app/components/ThemeToggle/ThemeToggle'

export default function App() {
  return (
    <>
      <ThemeToggle />
      <AppRoutes />
    </>
  )
}
