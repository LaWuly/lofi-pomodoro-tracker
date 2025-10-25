import styles from '../Clock.module.css'
import type { Project, Task } from '../types'
import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'

type FilterStatus = 'all' | 'active' | 'completed'

interface Props {
  tasks: Task[]
  projects: Project[]
  onAddTask: (t: Omit<Task, 'id' | 'createdAt'>) => void
  onUpdateTask: (id: string, updates: Partial<Task>) => void
  onDeleteTask: (id: string) => void
  currentTaskId: string | null
  onSetCurrentTask: (taskId: string | null) => void
  onAddProject: (p: Omit<Project, 'id' | 'createdAt'>) => void
  onUpdateProject: (id: string, updates: Partial<Project>) => void
  onDeleteProject: (id: string) => void
}

export function TasksAndProjects(props: Props) {
  const {
    tasks,
    projects,
    onAddTask,
    onUpdateTask,
    onDeleteTask,
    currentTaskId,
    onSetCurrentTask,
    onAddProject,
    onUpdateProject,
    onDeleteProject,
  } = props

  const [filterProject, setFilterProject] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('active')

  const [title, setTitle] = useState('')
  const [est, setEst] = useState(4)
  const [pid, setPid] = useState('none')

  const [pname, setPname] = useState('')
  const [pcolor, setPcolor] = useState('#3b82f6')

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value as FilterStatus)
  }
  const handleProjectFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilterProject(e.target.value)
  }
  const handlePidChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPid(e.target.value)
  }

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const byProj =
        filterProject === 'all' ||
        (filterProject === 'none'
          ? !t.projectId
          : t.projectId === filterProject)
      const byStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' ? !t.completed : t.completed)
      return byProj && byStatus
    })
  }, [tasks, filterProject, filterStatus])

  const actives = filtered.filter((t) => !t.completed)
  const dones = filtered.filter((t) => t.completed)
  const showBoth =
    filterStatus === 'all' && actives.length > 0 && dones.length > 0

  return (
    <div className={styles.panel}>
      {/* FILTRI + CREAZIONE TASK */}
      <div className={styles.card}>
        <div className={styles.row}>
          <select
            className={styles.select}
            value={filterStatus}
            onChange={handleStatusChange}
          >
            <option value="all">Tutte</option>
            <option value="active">Attive</option>
            <option value="completed">Completate</option>
          </select>

          <select
            className={styles.select}
            value={filterProject}
            onChange={handleProjectFilterChange}
          >
            <option value="all">Tutti i progetti</option>
            <option value="none">Nessun progetto</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.row} style={{ marginTop: 8 }}>
          <input
            className={styles.input}
            placeholder="Nuova task…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className={`${styles.input} ${styles.number}`}
            type="number"
            min={1}
            value={est}
            onChange={(e) => setEst(parseInt(e.target.value, 10) || 1)}
            style={{ width: 90 }}
          />
          <select
            className={styles.select}
            value={pid}
            onChange={handlePidChange}
          >
            <option value="none">Nessun progetto</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button
            className={styles.btn}
            onClick={() => {
              if (!title.trim()) return
              onAddTask({
                title: title.trim(),
                completed: false,
                pomodorosCompleted: 0,
                pomodorosEstimated: est,
                projectId: pid === 'none' ? null : pid,
              })
              setTitle('')
              setEst(4)
              setPid('none')
            }}
          >
            Aggiungi
          </button>
        </div>
      </div>

      {/* LISTE TASK (scroll interno) */}
      {actives.length === 0 && dones.length === 0 ? (
        <div className={styles.card}>Nessuna task trovata.</div>
      ) : (
        <div className={`${styles.split} ${showBoth ? styles.twoCols : ''}`}>
          {actives.length > 0 && (
            <div className={styles.card}>
              <b>Attive ({actives.length})</b>
              <div className={styles.listScroll}>
                {actives.map((t) => (
                  <TaskRow
                    key={t.id}
                    task={t}
                    projects={projects}
                    current={currentTaskId === t.id}
                    onToggle={() =>
                      onUpdateTask(t.id, { completed: !t.completed })
                    }
                    onMakeCurrent={() =>
                      onSetCurrentTask(currentTaskId === t.id ? null : t.id)
                    }
                    onDelete={() => onDeleteTask(t.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {dones.length > 0 && (
            <div className={styles.card}>
              <b>Completate ({dones.length})</b>
              <div className={styles.listScroll}>
                {dones.map((t) => (
                  <TaskRow
                    key={t.id}
                    task={t}
                    projects={projects}
                    current={currentTaskId === t.id}
                    onToggle={() =>
                      onUpdateTask(t.id, { completed: !t.completed })
                    }
                    onMakeCurrent={() =>
                      onSetCurrentTask(currentTaskId === t.id ? null : t.id)
                    }
                    onDelete={() => onDeleteTask(t.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PROGETTI (scroll interno) */}
      <div className={styles.projectsArea}>
        <div className={`${styles.card} ${styles.projectsCard}`}>
          <b>Nuovo progetto</b>
          <div className={styles.row} style={{ marginTop: 8 }}>
            <input
              className={styles.input}
              placeholder="Nome progetto…"
              value={pname}
              onChange={(e) => setPname(e.target.value)}
            />
            <input
              className={styles.input}
              type="color"
              value={pcolor}
              onChange={(e) => setPcolor(e.target.value)}
            />
            <button
              className={styles.btn}
              onClick={() => {
                if (!pname.trim()) return
                onAddProject({ name: pname.trim(), color: pcolor })
                setPname('')
              }}
            >
              Crea
            </button>
          </div>

          {projects.length > 0 && (
            <div className={styles.projectsScroll}>
              {projects.map((p) => {
                const tks = tasks.filter((t) => t.projectId === p.id)
                const done = tks.reduce((s, t) => s + t.pomodorosCompleted, 0)
                const estSum = tks.reduce((s, t) => s + t.pomodorosEstimated, 0)
                const prog = estSum > 0 ? Math.round((done / estSum) * 100) : 0

                return (
                  <div
                    key={p.id}
                    className={styles.card}
                    style={{ borderColor: p.color }}
                  >
                    <div
                      className={styles.row}
                      style={{ justifyContent: 'space-between' }}
                    >
                      <div className={styles.row}>
                        <span
                          aria-hidden
                          style={{
                            display: 'inline-block',
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            background: p.color,
                          }}
                        />
                        <b>{p.name}</b>
                      </div>
                      <div className={styles.row}>
                        <button
                          className={styles.btn}
                          onClick={() =>
                            onUpdateProject(p.id, {
                              name: prompt('Nuovo nome', p.name) || p.name,
                            })
                          }
                        >
                          Rinomina
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnDanger}`}
                          onClick={() => onDeleteProject(p.id)}
                        >
                          Elimina
                        </button>
                      </div>
                    </div>
                    <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>
                      Progresso pomodori: {done}/{estSum} ({prog}%)
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TaskRow({
  task,
  projects,
  current,
  onToggle,
  onMakeCurrent,
  onDelete,
}: {
  task: Task
  projects: Project[]
  current: boolean
  onToggle: () => void
  onMakeCurrent: () => void
  onDelete: () => void
}) {
  const proj = projects.find((p) => p.id === task.projectId)

  return (
    <div className={styles.taskRow}>
      {/* Colonna 1: checkbox */}
      <div className={styles.checkCell}>
        <input type="checkbox" checked={task.completed} onChange={onToggle} />
      </div>

      {/* Colonna 2: contenuto testuale che può andare a capo */}
      <div className={styles.contentCell}>
        {proj && (
          <span
            className={styles.projectPill}
            style={{ background: proj.color }}
          >
            {proj.name}
          </span>
        )}
        <span
          className={styles.taskTitle}
          style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
        >
          {task.title}
        </span>
      </div>

      {/* Colonna 3: azioni */}
      <div className={styles.actionsCell}>
        <span className={styles.pomoCount}>
          {task.pomodorosCompleted}/{task.pomodorosEstimated} 🍅
        </span>
        <button
          className={`${styles.btn} ${current ? styles.btnPrimary : ''}`}
          onClick={onMakeCurrent}
        >
          {current ? 'Attiva' : 'Inizia'}
        </button>
        <button className={styles.btn} onClick={onDelete}>
          🗑
        </button>
      </div>
    </div>
  )
}
