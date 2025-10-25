import { useEffect, useMemo, useRef, useState } from 'react'
import styles from '../Clock.module.css'
import type { AppSettings, Project, PomodoroSession, Task } from '../types'
import { usePomodoro } from '@app/hooks/usePomodoro'
import type { Phase, PomodoroConfig } from '@domain/timer/types'
import { safeAppendJournal } from '@app/clock/state'
import { toPomodoroConfig, phaseToSessionType } from '../types'

function getPhaseMinutes(cfg: PomodoroConfig, p: Phase): number {
  if (p === 'Session') return Math.max(1, Math.floor(cfg.sessionLength))
  if (p === 'ShortBreak') return Math.max(1, Math.floor(cfg.shortBreakLength))
  return Math.max(1, Math.floor(cfg.longBreakLength))
}

// Props
interface Props {
  settings: AppSettings
  currentTask?: Task
  currentProject?: Project
  onSessionComplete: (s: Omit<PomodoroSession, 'id' | 'completedAt'>) => void
  onTaskChange: (taskId: string | null) => void
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  tasks: Task[]
  projects: Project[]
  beepSrc?: string
}

export function PomodoroTimer({
  settings,
  currentTask,
  currentProject,
  onSessionComplete,
  onTaskChange,
  onAddTask,
  tasks,
  projects,
  beepSrc,
}: Props) {
  // Config dominio (adapter)
  const cfg = useMemo(() => toPomodoroConfig(settings), [settings])

  // Hook
  const { state, toggleRun, reset, audioRef, setPhase, formattedTime } =
    usePomodoro(cfg, {
      autoStartBreaks: settings.autoStartBreaks,
      autoStartPomodoros: settings.autoStartPomodoros,
      showHours: settings.showHours ?? false,
    })

  // Notifiche browser
  function notifyBrowser(title: string, body: string) {
    if (!('Notification' in window)) return
    if (Notification.permission === 'granted') {
      new Notification(title, { body })
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {})
    }
  }

  // Log della sessione (al passaggio in ring)
  const prev = useRef({ isRinging: state.isRinging, phase: state.phase })
  useEffect(() => {
    const was = prev.current
    const justEnteredRing = state.isRinging && !was.isRinging

    if (justEnteredRing) {
      const finishedKind = phaseToSessionType(was.phase)
      const durationMin = getPhaseMinutes(cfg, was.phase)

      onSessionComplete({
        type: finishedKind,
        duration: durationMin,
        taskId: currentTask?.id ?? null,
        projectId: currentTask?.projectId ?? currentProject?.id ?? null,
      })

      // Journal
      const today = new Date().toISOString().slice(0, 10)
      safeAppendJournal({
        date: today,
        text:
          finishedKind === 'work'
            ? `🍅 Focus ${durationMin}′${currentTask ? ` • ${currentTask.title}` : ''}`
            : finishedKind === 'shortBreak'
              ? `☕ Pausa ${durationMin}′`
              : `🧘 Pausa lunga ${durationMin}′`,
        source: 'pomodoro',
        durataMin: durationMin,
        tag: [
          finishedKind === 'work'
            ? 'focus'
            : finishedKind === 'shortBreak'
              ? 'break'
              : 'long-break',
        ],
      })

      if (settings.notificationsEnabled) {
        if (finishedKind === 'work') {
          notifyBrowser('Pomodoro completato!', 'Tempo di una pausa.')
        } else {
          notifyBrowser('Pausa finita', 'Prontə per un nuovo Pomodoro?')
        }
      }
    }

    prev.current = { isRinging: state.isRinging, phase: state.phase }
  }, [
    state.isRinging,
    state.phase,
    cfg,
    onSessionComplete,
    currentTask,
    currentProject,
    settings.notificationsEnabled,
  ])

  // Progress (0..100)
  const total =
    state.phase === 'Session'
      ? cfg.sessionLength * 60
      : state.phase === 'ShortBreak'
        ? cfg.shortBreakLength * 60
        : cfg.longBreakLength * 60
  const progress = total > 0 ? ((total - state.timeLeft) / total) * 100 : 0
  const progressClamped = Math.max(0, Math.min(100, progress))

  const incomplete = tasks.filter((t) => !t.completed)

  // ------------
  return (
    <div className={`${styles.card} ${styles.timerCard}`}>
      {/* Switch manuale fase */}
      <div className={styles.timerPhaseRow}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => setPhase('Session')}
        >
          Focus
        </button>
        <button
          type="button"
          className={styles.btn}
          onClick={() => setPhase('ShortBreak')}
        >
          Pausa
        </button>
        <button
          type="button"
          className={styles.btn}
          onClick={() => setPhase('LongBreak')}
        >
          Pausa lunga
        </button>
      </div>

      {/* Timer centrale */}
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <div className={styles.timerDisplay}>{formattedTime}</div>

        <div
          className={styles.progress}
          role="progressbar"
          aria-label="avanzamento timer"
          aria-valuenow={Math.round(progressClamped)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={styles.progressBar}
            style={{ width: `${progressClamped}%` }}
          />
        </div>

        <div
          className={`${styles.timerControls} ${styles.row} ${styles.gap16}`}
        >
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={toggleRun}
            aria-pressed={state.isRunning}
          >
            {state.isRunning ? 'Pausa' : 'Avvia'}
          </button>
          <button type="button" className={styles.btn} onClick={reset}>
            Reset
          </button>
        </div>
      </div>

      {/* Audio opzionale */}
      <audio ref={audioRef} src={beepSrc ?? ''} style={{ display: 'none' }} />

      {/* Task corrente / quick add */}
      <div style={{ marginTop: 16 }} className={styles.row}>
        {currentTask ? (
          <div className={`${styles.card}`} style={{ width: '100%' }}>
            <div
              className={styles.row}
              style={{ justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>Task corrente</div>
                <div className={styles.row} style={{ gap: 8 }}>
                  {currentProject && (
                    <span
                      style={{
                        display: 'inline-block',
                        background: currentProject.color,
                        color: '#fff',
                        borderRadius: 999,
                        padding: '2px 8px',
                        fontSize: 12,
                      }}
                    >
                      {currentProject.name}
                    </span>
                  )}
                  <b>{currentTask.title}</b>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, opacity: 0.7 }}>Pomodori</div>
                <b>
                  {currentTask.pomodorosCompleted}/
                  {currentTask.pomodorosEstimated}
                </b>
              </div>
            </div>
          </div>
        ) : (
          <QuickSelector
            tasks={incomplete}
            projects={projects}
            onTaskChange={onTaskChange}
            onAddTask={onAddTask}
          />
        )}
      </div>
    </div>
  )
}

function QuickSelector({
  tasks,
  projects,
  onTaskChange,
  onAddTask,
}: {
  tasks: Task[]
  projects: Project[]
  onTaskChange: (id: string | null) => void
  onAddTask: (t: Omit<Task, 'id' | 'createdAt'>) => void
}) {
  const [title, setTitle] = useState('')
  const [pid, setPid] = useState<string>('none')

  return (
    <div className={styles.card}>
      <div style={{ marginBottom: 8, fontSize: 14, opacity: 0.8 }}>
        Seleziona o crea una task
      </div>

      {tasks.length > 0 && (
        <div className={styles.row}>
          <select onChange={(e) => onTaskChange(e.target.value || null)}>
            <option value="">— Seleziona task —</option>
            {tasks.map((t) => {
              const p = projects.find((pj) => pj.id === t.projectId)
              return (
                <option key={t.id} value={t.id}>
                  {p ? `(${p.name}) ` : ''}
                  {t.title}
                </option>
              )
            })}
          </select>
          <button
            type="button"
            className={styles.btn}
            onClick={() => onTaskChange(null)}
          >
            Pulisci
          </button>
        </div>
      )}

      <div className={styles.row} style={{ marginTop: 8 }}>
        <input
          placeholder="Nuova task…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select value={pid} onChange={(e) => setPid(e.target.value)}>
          <option value="none">Nessun progetto</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={styles.btn}
          onClick={() => {
            if (!title.trim()) return
            onAddTask({
              title: title.trim(),
              completed: false,
              pomodorosCompleted: 0,
              pomodorosEstimated: 4,
              projectId: pid === 'none' ? null : pid,
            })
            setTitle('')
            setPid('none')
          }}
        >
          Aggiungi
        </button>
      </div>
    </div>
  )
}
