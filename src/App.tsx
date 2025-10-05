import { usePomodoro } from './app/hooks/usePomodoro'

export default function App() {
  const { state, config } = usePomodoro({ sessionLength: 25, breakLength: 5 })
  console.log('STATE:', state, 'CONFIG:', config)
  return <main>Hook pronto — guarda la console del browser</main>
}
