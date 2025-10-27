// src/app/settings/AppSettingsContext.tsx - API interne
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { AppSettings } from '@app/clock/types'
import { defaultSettings } from '@app/clock/types'

// Storage key
const K_APP_SETTINGS = 'app-settings-v2'

export type SettingsSection = 'general' | 'music' | 'timer' | 'workout'

export interface SpotifyPlaylist {
  id: string
  name: string
  url: string
}
export interface AmbiencePreset {
  id: string
  name: string
  src?: string
}
export type MusicPlayer = 'spotify' | 'ambience'

export interface MusicState {
  player: MusicPlayer
  showMiniPlayer: boolean
  playlists: SpotifyPlaylist[]
  activeSpotifyId: string | null
  ambiencePresets: AmbiencePreset[]
  activeAmbienceId: string | null
}

interface PersistedState {
  settings: AppSettings
  music: MusicState
}

// Stato UI del pannello
interface PanelState {
  isSettingsOpen: boolean
  initialSection: SettingsSection
}

interface Ctx {
  state: PersistedState

  isSettingsOpen: boolean
  initialSection: SettingsSection
  openSettings: (section?: SettingsSection) => void
  closeSettings: () => void

  // impostazioni generali (timer, ecc.)
  setSettings: (next: AppSettings | ((cur: AppSettings) => AppSettings)) => void

  // musica – API usate da MusicSettingsPanel
  setPlayer: (p: MusicPlayer) => void
  toggleMiniPlayer: () => void
  addSpotifyPlaylist: (p: { name: string; url: string }) => void
  removeSpotifyPlaylist: (id: string) => void
  setActiveSpotify: (id: string) => void
  setActiveAmbience: (id: string) => void
  updatePlaylistName: (id: string, name: string) => void
}

const AppSettingsContext = createContext<Ctx | null>(null)

function load(): PersistedState {
  try {
    const raw = localStorage.getItem(K_APP_SETTINGS)
    if (!raw) throw new Error('empty')
    const parsed = JSON.parse(raw) as PersistedState

    return {
      settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
      music: {
        player: parsed.music?.player ?? 'spotify',
        showMiniPlayer: parsed.music?.showMiniPlayer ?? true,
        playlists: parsed.music?.playlists ?? [],
        activeSpotifyId: parsed.music?.activeSpotifyId ?? null,
        ambiencePresets: parsed.music?.ambiencePresets ?? [
          { id: 'rain', name: 'Pioggia' },
          { id: 'fire', name: 'Camino' },
          { id: 'forest', name: 'Foresta' },
        ],
        activeAmbienceId: parsed.music?.activeAmbienceId ?? null,
      },
    }
  } catch {
    return {
      settings: { ...defaultSettings },
      music: {
        player: 'spotify',
        showMiniPlayer: true,
        playlists: [],
        activeSpotifyId: null,
        ambiencePresets: [
          { id: 'rain', name: 'Pioggia' },
          { id: 'fire', name: 'Camino' },
          { id: 'forest', name: 'Foresta' },
        ],
        activeAmbienceId: null,
      },
    }
  }
}

export function AppSettingsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [persisted, setPersisted] = useState<PersistedState>(() => load())
  const [panel, setPanel] = useState<PanelState>({
    isSettingsOpen: false,
    initialSection: 'general',
  })

  useEffect(() => {
    localStorage.setItem(K_APP_SETTINGS, JSON.stringify(persisted))
  }, [persisted])

  // API pannello
  const openSettings = (section: SettingsSection = 'general') =>
    setPanel({ isSettingsOpen: true, initialSection: section })
  const closeSettings = () => setPanel((p) => ({ ...p, isSettingsOpen: false }))

  // API impostazioni generali
  const setSettings: Ctx['setSettings'] = (next) =>
    setPersisted((p) => ({
      ...p,
      settings: typeof next === 'function' ? (next as any)(p.settings) : next,
    }))

  // API musica
  const setPlayer: Ctx['setPlayer'] = (player) =>
    setPersisted((p) => ({ ...p, music: { ...p.music, player } }))

  const toggleMiniPlayer = () =>
    setPersisted((p) => ({
      ...p,
      music: { ...p.music, showMiniPlayer: !p.music.showMiniPlayer },
    }))

  const addSpotifyPlaylist: Ctx['addSpotifyPlaylist'] = ({ name, url }) =>
    setPersisted((p) => ({
      ...p,
      music: {
        ...p.music,
        playlists: [
          ...p.music.playlists,
          { id: crypto.randomUUID(), name, url },
        ],
      },
    }))

  const removeSpotifyPlaylist: Ctx['removeSpotifyPlaylist'] = (id) =>
    setPersisted((p) => ({
      ...p,
      music: {
        ...p.music,
        playlists: p.music.playlists.filter((x) => x.id !== id),
      },
    }))

  const setActiveSpotify: Ctx['setActiveSpotify'] = (id) =>
    setPersisted((p) => ({ ...p, music: { ...p.music, activeSpotifyId: id } }))

  const setActiveAmbience: Ctx['setActiveAmbience'] = (id) =>
    setPersisted((p) => ({ ...p, music: { ...p.music, activeAmbienceId: id } }))

  const updatePlaylistName: Ctx['updatePlaylistName'] = (id, name) =>
    setPersisted((p) => ({
      ...p,
      music: {
        ...p.music,
        playlists: p.music.playlists.map((pl) =>
          pl.id === id ? { ...pl, name } : pl,
        ),
      },
    }))

  const value = useMemo<Ctx>(
    () => ({
      state: persisted,
      isSettingsOpen: panel.isSettingsOpen,
      initialSection: panel.initialSection,
      openSettings,
      closeSettings,
      setSettings,
      setPlayer,
      toggleMiniPlayer,
      addSpotifyPlaylist,
      removeSpotifyPlaylist,
      setActiveSpotify,
      setActiveAmbience,
      updatePlaylistName,
    }),
    [persisted, panel],
  )

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  )
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext)
  if (!ctx)
    throw new Error('useAppSettings must be used within AppSettingsProvider')
  return ctx
}
