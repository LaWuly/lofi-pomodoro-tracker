// src/app/clock/ClockPage.tsx
import { useEffect, useMemo, useState } from 'react'
import styles from './Clock.module.css'
import type { Task, Project, PomodoroSession } from './types'
import { loadJSON, saveJSON } from './state'
import { PomodoroTimer } from './components/PomodoroTimer'
import { TasksAndProjects } from './components/TasksAndProjects'
import { Statistics } from './components/Statistics'
import { useAppSettings } from '@app/settings/AppSettingsContext'

type Tab = 'timer' | 'tasks' | 'stats'
const TABS: Tab[] = ['timer', 'tasks', 'stats']

const K_TASKS = 'pomodoro-tasks'
const K_PROJECTS = 'pomodoro-projects'
const K_SESSIONS = 'pomodoro-sessions'
const K_CURRENT_TASK = 'pomodoro-current-task'
const K_ACTIVE_TAB = 'pomodoro-active-tab'

export function ClockPage() {
  const [tasks, setTasks] = useState<Task[]>(() =>
    loadJSON<Task[]>(K_TASKS, []),
  )
  const [projects, setProjects] = useState<Project[]>(() =>
    loadJSON<Project[]>(K_PROJECTS, []),
  )
  const [sessions, setSessions] = useState<PomodoroSession[]>(() =>
    loadJSON<PomodoroSession[]>(K_SESSIONS, []),
  )
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(() =>
    loadJSON<string | null>(K_CURRENT_TASK, null),
  )
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const v = loadJSON<Tab | 'settings'>(K_ACTIVE_TAB, 'timer')
    return v === 'settings' ? 'timer' : (v as Tab)
  })

  // ✅ ora le impostazioni arrivano dal context globale
  const {
    state: { settings },
  } = useAppSettings()

  // Persistenza locale (tasks, projects, sessions, tab, current task)
  useEffect(() => saveJSON(K_TASKS, tasks), [tasks])
  useEffect(() => saveJSON(K_PROJECTS, projects), [projects])
  useEffect(() => saveJSON(K_SESSIONS, sessions), [sessions])
  useEffect(() => saveJSON(K_CURRENT_TASK, currentTaskId), [currentTaskId])
  useEffect(() => saveJSON(K_ACTIVE_TAB, activeTab), [activeTab])

  // Sanity: se il tab non è valido, torna a 'timer'
  useEffect(() => {
    if (!TABS.includes(activeTab)) setActiveTab('timer')
  }, [activeTab])

  // 🔗 ascolta le richieste di cambio tab dalla TopBar (type-safe)
  useEffect(() => {
    const onSetTab = (e: Event) => {
      const ce = e as CustomEvent<Tab>
      const next = ce.detail
      if (TABS.includes(next) && next !== activeTab) {
        setActiveTab(next)
      }
    }
    window.addEventListener('clock:setTab', onSetTab as EventListener)
    return () =>
      window.removeEventListener('clock:setTab', onSetTab as EventListener)
  }, [activeTab])

  // CRUD Task/Project/Session
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

  const currentTask = useMemo(
    () => tasks.find((t) => t.id === currentTaskId),
    [tasks, currentTaskId],
  )
  const currentProject = useMemo(() => {
    if (!currentTask) return null
    return projects.find((p) => p.id === currentTask.projectId) ?? null
  }, [currentTask, projects])

  return (
    <section className={styles.wrapper}>
      {/* Nessun header/tabs qui: è tutto nella TopBar */}
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
      </main>
    </section>
  )
}

export default ClockPage
