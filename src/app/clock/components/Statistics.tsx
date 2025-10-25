// src/app/clock/components/Statistics.tsx
import styles from '../Clock.module.css'
import type { PomodoroSession, Task, Project } from '../types'
import { useMemo } from 'react'

interface Props {
  sessions: PomodoroSession[]
  tasks: Task[]
  projects: Project[]
}

function toYMD(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

// start da lunedì
function startOfISOWeek(d: Date): Date {
  const day = (d.getDay() + 6) % 7 // 0=Lun ... 6=Dom
  const x = startOfDay(d)
  x.setDate(x.getDate() - day)
  return x
}

const DAY_MS = 24 * 60 * 60 * 1000
const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)

export function Statistics({ sessions, tasks, projects }: Props) {
  const stats = useMemo(() => {
    const now = new Date()
    const today = startOfDay(now)
    const weekStart = startOfISOWeek(today)

    // Solo sessioni di lavoro (per le KPI)
    const work = sessions.filter((s) => s.type === 'work')

    // Streak
    const workDays = new Set<string>()
    for (const s of work) {
      workDays.add(toYMD(startOfDay(new Date(s.completedAt))))
    }

    // Helper “inRange” [from, to) in ms
    const inRange = (from: Date, to?: Date) => (t: number) => {
      const s = from.getTime()
      const e = (to ?? new Date(from.getTime() + DAY_MS)).getTime()
      return t >= s && t < e
    }

    // Oggi / settimana
    const todayWork = work.filter((s) => inRange(today)(s.completedAt))
    const weekWork = work.filter((s) => s.completedAt >= weekStart.getTime())

    // Minuti
    const totalFocus = sum(work.map((s) => s.duration))
    const todayFocus = sum(todayWork.map((s) => s.duration))
    const weekFocus = sum(weekWork.map((s) => s.duration))

    // Streak
    let streak = 0
    const cursor = startOfDay(now)
    for (let i = 0; i < 365; i++) {
      const key = toYMD(cursor)
      if (!workDays.has(key)) break
      streak += 1
      cursor.setDate(cursor.getDate() - 1)
    }

    // Task
    const doneTasks = tasks.filter((t) => t.completed).length
    const totalTasks = tasks.length

    // Distribuzione per progetto: conteggio pomodori + minuti
    const byProject = new Map<
      string,
      {
        id: string
        name: string
        color: string
        pomodori: number
        minutes: number
      }
    >()
    for (const p of projects) {
      byProject.set(p.id, {
        id: p.id,
        name: p.name,
        color: p.color,
        pomodori: 0,
        minutes: 0,
      })
    }

    let noProjectCount = 0
    let noProjectMinutes = 0

    for (const s of work) {
      if (s.projectId && byProject.has(s.projectId)) {
        const agg = byProject.get(s.projectId)!
        agg.pomodori += 1
        agg.minutes += s.duration
      } else {
        noProjectCount += 1
        noProjectMinutes += s.duration
      }
    }

    const perProject = Array.from(byProject.values())
      .filter((p) => p.pomodori > 0)
      .sort((a, b) => b.pomodori - a.pomodori)

    if (noProjectCount > 0) {
      perProject.push({
        id: '__none__',
        name: 'Senza progetto',
        color: '#9ca3af',
        pomodori: noProjectCount,
        minutes: noProjectMinutes,
      })
    }

    return {
      todayPomodoros: todayWork.length,
      weekPomodoros: weekWork.length,
      totalPomodoros: work.length,
      totalFocus,
      todayFocus,
      weekFocus,
      streak,
      doneTasks,
      totalTasks,
      perProject,
    }
  }, [sessions, tasks, projects])

  const fmtMin = (m: number) => {
    if (m <= 0) return '0m'
    const h = Math.floor(m / 60)
    const mm = m % 60
    return h > 0 ? `${h}h ${mm}m` : `${mm}m`
  }

  return (
    <div className={styles.panel}>
      {/* KPI */}
      <div className={styles.kpi}>
        <div className={styles.kpiItem}>
          <div>Oggi</div>
          <b>{stats.todayPomodoros} 🍅</b>
          <div style={{ opacity: 0.7 }}>{fmtMin(stats.todayFocus)}</div>
        </div>
        <div className={styles.kpiItem}>
          <div>Settimana</div>
          <b>{stats.weekPomodoros} 🍅</b>
          <div style={{ opacity: 0.7 }}>{fmtMin(stats.weekFocus)}</div>
        </div>
        <div className={styles.kpiItem}>
          <div>Task</div>
          <b>
            {stats.doneTasks}/{stats.totalTasks}
          </b>
        </div>
        <div className={styles.kpiItem}>
          <div>Streak</div>
          <b>
            {stats.streak} {stats.streak === 1 ? 'giorno' : 'giorni'}
          </b>
        </div>
      </div>

      {/* Distribuzione per progetto */}
      <div className={styles.card} style={{ marginTop: 8 }}>
        <b>Distribuzione per progetto</b>
        {stats.perProject.length === 0 ? (
          <div style={{ marginTop: 8, opacity: 0.7 }}>
            Nessun dato disponibile
          </div>
        ) : (
          <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
            {stats.perProject.map((p) => (
              <div
                key={p.id}
                className={styles.row}
                style={{ justifyContent: 'space-between' }}
              >
                <div className={styles.row}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 12,
                      height: 12,
                      borderRadius: 999,
                      background: p.color,
                      marginRight: 8,
                    }}
                    aria-hidden
                  />
                  <b>{p.name}</b>
                </div>
                <span>
                  <b>{p.pomodori}</b> 🍅
                  <span style={{ opacity: 0.7, marginLeft: 8 }}>
                    {fmtMin(p.minutes)}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
