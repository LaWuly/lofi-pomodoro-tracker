import { Routes, Route } from 'react-router-dom'
import { GridHub } from '@app/components/Grid/GridHub'
import { ClockPage } from '@app/clock/ClockPage'

// Stub temporanei (creali se non li hai ancora)
import { CalculatorStub } from '@app/calculator/CalculatorStub'
import { MarkdownStub } from '@app/markdown/MarkdownStub'
import { JournalStub } from '@app/journal/JournalStub'
import { DrumStub } from '@app/drum/DrumStub'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<GridHub />} />
      <Route path="/apps/clock" element={<ClockPage />} />
      <Route path="/apps/calculator" element={<CalculatorStub />} />
      <Route path="/apps/markdown" element={<MarkdownStub />} />
      <Route path="/apps/journal" element={<JournalStub />} />
      <Route path="/apps/drum" element={<DrumStub />} />
    </Routes>
  )
}
