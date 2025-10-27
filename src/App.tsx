import { AppRoutes } from './routes/AppRoutes'
import { AppSettingsProvider } from '@app/settings/AppSettingsContext'
import { TopBar } from '@app/components/TopBar/TopBar'
import { SettingsPanel } from '@app/settings/SettingsPanel'

export default function App() {
  return (
    <div className="wrapper">
      <div className="container">
        <AppSettingsProvider>
          <TopBar />
          <AppRoutes />
          <SettingsPanel />
        </AppSettingsProvider>
      </div>
    </div>
  )
}
