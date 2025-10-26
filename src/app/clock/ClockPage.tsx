// src/app/clock/ClockPage.tsx
import { useEffect, useMemo, useState } from 'react'
import styles from './Clock.module.css'
import type { Task, Project, PomodoroSession, AppSettings } from './types'
import { defaultSettings } from './types'
import { loadJSON, saveJSON } from './state'
import { PomodoroTimer } from './components/PomodoroTimer'
import { TasksAndProjects } from './components/TasksAndProjects'
import { Statistics } from './components/Statistics'
import { Settings } from './components/Settings'
import { SpotifyEmbed } from '../components/Audio/SpotifyEmbed'

type Tab = 'timer' | 'tasks' | 'stats' | 'settings'

// Storage keys
const K_TASKS = 'pomodoro-tasks'
const K_PROJECTS = 'pomodoro-projects'
const K_SESSIONS = 'pomodoro-sessions'
const K_SETTINGS = 'pomodoro-settings'
const K_CURRENT_TASK = 'pomodoro-current-task'
const K_ACTIVE_TAB = 'pomodoro-active-tab'

// Retrocompatibilità impostazioni
function normalizeSettings(s: AppSettings): AppSettings {
  return { ...defaultSettings, ...s }
}

export function ClockPage() {
  // Stato persistente
  const [tasks, setTasks] = useState<Task[]>(() =>
    loadJSON<Task[]>(K_TASKS, []),
  )
  const [projects, setProjects] = useState<Project[]>(() =>
    loadJSON<Project[]>(K_PROJECTS, []),
  )
  const [sessions, setSessions] = useState<PomodoroSession[]>(() =>
    loadJSON<PomodoroSession[]>(K_SESSIONS, []),
  )
  const [settings, setSettings] = useState<AppSettings>(() =>
    normalizeSettings(loadJSON<AppSettings>(K_SETTINGS, defaultSettings)),
  )
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(() =>
    loadJSON<string | null>(K_CURRENT_TASK, null),
  )
  const [activeTab, setActiveTab] = useState<Tab>(() =>
    loadJSON<Tab>(K_ACTIVE_TAB, 'timer'),
  )

  // Persistenza in localStorage
  useEffect(() => saveJSON(K_TASKS, tasks), [tasks])
  useEffect(() => saveJSON(K_PROJECTS, projects), [projects])
  useEffect(() => saveJSON(K_SESSIONS, sessions), [sessions])
  useEffect(() => saveJSON(K_SETTINGS, settings), [settings])
  useEffect(() => saveJSON(K_CURRENT_TASK, currentTaskId), [currentTaskId])
  useEffect(() => saveJSON(K_ACTIVE_TAB, activeTab), [activeTab])

  // CRUD Task
  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }
    setTasks((prev) => [...prev, newTask])
  }
  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    )
  }
  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    if (currentTaskId === id) setCurrentTaskId(null)
  }

  // CRUD Project
  const addProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }
    setProjects((prev) => [...prev, newProject])
  }
  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    )
  }
  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    setTasks((prev) =>
      prev.map((t) => (t.projectId === id ? { ...t, projectId: null } : t)),
    )
  }

  // Log sessioni
  const addSession = (session: Omit<PomodoroSession, 'id' | 'completedAt'>) => {
    const newSession: PomodoroSession = {
      ...session,
      id: crypto.randomUUID(),
      completedAt: Date.now(),
    }
    setSessions((prev) => [...prev, newSession])
    if (session.type === 'work' && session.taskId) {
      const t = tasks.find((x) => x.id === session.taskId)
      updateTask(session.taskId, {
        pomodorosCompleted: (t?.pomodorosCompleted ?? 0) + 1,
      })
    }
  }

  // Derivati
  const currentTask = useMemo(
    () => tasks.find((t) => t.id === currentTaskId),
    [tasks, currentTaskId],
  )
  const currentProject = useMemo(() => {
    if (!currentTask) return null
    return projects.find((p) => p.id === currentTask.projectId) ?? null
  }, [currentTask, projects])

  // Render
  return (
    <section className={styles.wrapper} aria-labelledby="clock-title">
      {/* Header con Tabs (no card) */}
      <header className={styles.header}>
        <h2 id="clock-title" className={styles.title}>
          25+5 Clock (Pro)
        </h2>

        <nav
          className={styles.tabs}
          role="tablist"
          aria-label="Sezioni Pomodoro"
        >
          {(['timer', 'tasks', 'stats', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'timer' && '⏱ Timer'}
              {tab === 'tasks' && '📝 Task & Progetti'}
              {tab === 'stats' && '📊 Statistiche'}
              {tab === 'settings' && '⚙️ Impostazioni'}
            </button>
          ))}
        </nav>
      </header>

      {/* Contenuto tab (no card) */}
      <main className={styles.panel}>
        {activeTab === 'timer' && (
          <div className={styles.timerLayout}>
            <div className={styles.timerSection}>
              <PomodoroTimer
                settings={settings}
                currentTask={currentTask}
                currentProject={currentProject ?? undefined}
                onSessionComplete={addSession}
                onTaskChange={setCurrentTaskId}
                onAddTask={addTask}
                tasks={tasks}
                projects={projects}
              />
            </div>
            <div className={styles.playerSection}>
              <SpotifyEmbed settings={settings} />
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <TasksAndProjects
            tasks={tasks}
            projects={projects}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            currentTaskId={currentTaskId}
            onSetCurrentTask={setCurrentTaskId}
            onAddProject={addProject}
            onUpdateProject={updateProject}
            onDeleteProject={deleteProject}
          />
        )}

        {activeTab === 'stats' && (
          <Statistics sessions={sessions} tasks={tasks} projects={projects} />
        )}

        {activeTab === 'settings' && (
          <Settings settings={settings} onUpdateSettings={setSettings} />
        )}
      </main>
    </section>
  )
}

export default ClockPage
