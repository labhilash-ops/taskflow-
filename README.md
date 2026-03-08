import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  getProjects, getTasks, getCategories,
  createTask, updateTask, deleteTask,
  createCategory, updateCategory, deleteCategory,
  addStatusUpdate, deleteStatusUpdate,
} from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import TaskModal from '../components/TaskModal'
import CategoryModal from '../components/CategoryModal'
import { exportToExcel } from '../lib/export'

const STATUS_LABELS = { pending: 'Pending', inprogress: 'In Progress', completed: 'Completed', onhold: 'On Hold', tbd: 'TBD' }
const STATUS_CLASS  = { pending: 'badge-pending', inprogress: 'badge-inprogress', completed: 'badge-completed', onhold: 'badge-onhold', tbd: 'badge-tbd' }
const DOT_CLASS     = { pending: 'pending', inprogress: 'inprogress', completed: 'completed', onhold: 'onhold', tbd: '' }

function statusFromText(text) {
  if (!text) return 'tbd'
  const t = text.toLowerCase()
  if (t === 'tbd' || t === '-') return 'tbd'
  if (t.includes('completed') || t.includes('complete')) return 'completed'
  return 'inprogress'
}

export default function ProjectPage() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const { user, signOut } = useAuth()
  const toast      = useToast()

  const [project, setProject]     = useState(null)
  const [allProjects, setAllProjects] = useState([])
  const [categories, setCategories] = useState([])
  const [tasks, setTasks]         = useState([])
  const [loading, setLoading]     = useState(true)

  // UI state
  const [expandedTasks, setExpandedTasks] = useState({})
  const [filterStatus, setFilterStatus]   = useState('all')
  const [search, setSearch]               = useState('')

  // Modals
  const [taskModal, setTaskModal]       = useState(null)   // null | 'new' | task-obj
  const [catModal, setCatModal]         = useState(null)   // null | 'new' | cat-obj
  const [confirmDelete, setConfirmDelete] = useState(null) // null | { type, item }

  // Add-update state per task
  const [updateForms, setUpdateForms] = useState({}) // { [taskId]: { note, status } }

  useEffect(() => { loadAll() }, [id])

  async function loadAll() {
    setLoading(true)
    try {
      const [projs, cats, taskData] = await Promise.all([
        getProjects(),
        getCategories(id),
        getTasks(id),
      ])
      setAllProjects(projs)
      const proj = projs.find(p => p.id === id)
      setProject(proj || null)
      setCategories(cats)
      setTasks(taskData)
    } catch (e) { toast(e.message, 'error') }
    setLoading(false)
  }

  // ── Task CRUD ──────────────────────────────────────────────────────────────
  async function handleSaveTask(values) {
    try {
      if (taskModal && taskModal !== 'new') {
        const updated = await updateTask(taskModal.id, { ...values, project_id: id })
        setTasks(t => t.map(x => x.id === taskModal.id ? { ...x, ...updated } : x))
        toast('Task updated', 'success')
      } else {
        const maxPos = tasks.length > 0 ? Math.max(...tasks.map(t => t.position || 0)) + 1 : 0
        const created = await createTask({ ...values, project_id: id, position: maxPos })
        setTasks(t => [...t, { ...created, status_updates: [] }])
        toast('Task added', 'success')
      }
      setTaskModal(null)
    } catch (e) { toast(e.message, 'error') }
  }

  async function handleDeleteTask(task) {
    try {
      await deleteTask(task.id)
      setTasks(t => t.filter(x => x.id !== task.id))
      toast('Task deleted')
    } catch (e) { toast(e.message, 'error') }
    setConfirmDelete(null)
  }

  // ── Category CRUD ──────────────────────────────────────────────────────────
  async function handleSaveCat(values) {
    try {
      if (catModal && catModal !== 'new') {
        const updated = await updateCategory(catModal.id, values)
        setCategories(c => c.map(x => x.id === catModal.id ? updated : x))
        toast('Category updated', 'success')
      } else {
        const maxPos = categories.length > 0 ? Math.max(...categories.map(c => c.position || 0)) + 1 : 0
        const created = await createCategory({ ...values, project_id: id, position: maxPos })
        setCategories(c => [...c, created])
        toast('Category added', 'success')
      }
      setCatModal(null)
    } catch (e) { toast(e.message, 'error') }
  }

  async function handleDeleteCat(cat) {
    try {
      await deleteCategory(cat.id)
      setCategories(c => c.filter(x => x.id !== cat.id))
      toast('Category deleted')
    } catch (e) { toast(e.message, 'error') }
    setConfirmDelete(null)
  }

  // ── Status updates ─────────────────────────────────────────────────────────
  async function handleAddUpdate(task) {
    const form = updateForms[task.id]
    if (!form?.note?.trim()) return
    try {
      const update = await addStatusUpdate({
        task_id: task.id,
        note: form.note.trim(),
        status: form.status || task.status,
        user_id: user.id,
      })
      // also update task status
      if (form.status && form.status !== task.status) {
        await updateTask(task.id, { status: form.status })
        setTasks(t => t.map(x => x.id === task.id
          ? { ...x, status: form.status, status_updates: [...(x.status_updates || []), update] }
          : x
        ))
      } else {
        setTasks(t => t.map(x => x.id === task.id
          ? { ...x, status_updates: [...(x.status_updates || []), update] }
          : x
        ))
      }
      setUpdateForms(f => ({ ...f, [task.id]: { note: '', status: form.status } }))
      toast('Update added', 'success')
    } catch (e) { toast(e.message, 'error') }
  }

  async function handleDeleteUpdate(task, updateId) {
    try {
      await deleteStatusUpdate(updateId)
      setTasks(t => t.map(x => x.id === task.id
        ? { ...x, status_updates: (x.status_updates || []).filter(u => u.id !== updateId) }
        : x
      ))
      toast('Update deleted')
    } catch (e) { toast(e.message, 'error') }
  }

  // ── Stats ──────────────────────────────────────────────────────────────────
  const total      = tasks.length
  const completed  = tasks.filter(t => t.status === 'completed').length
  const inprogress = tasks.filter(t => t.status === 'inprogress').length
  const pending    = tasks.filter(t => t.status === 'pending').length
  const pct        = total ? Math.round((completed / total) * 100) : 0
  const ipct       = total ? Math.round((inprogress / total) * 100) : 0

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filteredTasks = tasks.filter(t => {
    const statusMatch = filterStatus === 'all' || t.status === filterStatus
    const searchMatch = !search || t.name.toLowerCase().includes(search.toLowerCase())
    return statusMatch && searchMatch
  })

  // Group by category
  const uncategorized = filteredTasks.filter(t => !t.category_id)
  const grouped = categories.map(cat => ({
    cat,
    tasks: filteredTasks.filter(t => t.category_id === cat.id),
  })).filter(g => g.tasks.length > 0)

  const initials = user?.email?.slice(0, 2).toUpperCase()

  if (loading) return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo"><h1>Task<span style={{color:'var(--blue)'}}>Flow</span></h1></div>
      </aside>
      <div className="main"><div className="loading-center"><div className="spinner" /></div></div>
    </div>
  )

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>Task<span style={{ color: 'var(--blue)' }}>Flow</span></h1>
          <p>Project Tracker</p>
        </div>
        <div className="sidebar-section">
          <div className="sidebar-section-label">Navigation</div>
          <button className="sidebar-item" onClick={() => navigate('/')}>
            <span className="icon">🏠</span> All Projects
          </button>
        </div>
        <div className="sidebar-section">
          <div className="sidebar-section-label">Projects</div>
          {allProjects.map(p => (
            <button key={p.id} className={`sidebar-item ${p.id === id ? 'active' : ''}`}
              onClick={() => navigate(`/project/${p.id}`)}>
              <span className="icon">{p.emoji}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
            </button>
          ))}
          <button className="sidebar-item" onClick={() => navigate('/?new=1')} style={{ color: 'rgba(255,255,255,0.35)' }}>
            <span className="icon">＋</span> New Project
          </button>
        </div>
        <div className="sidebar-section">
          <div className="sidebar-section-label">Categories</div>
          {categories.map(cat => (
            <div key={cat.id} className="sidebar-item" style={{ cursor: 'default' }}>
              <span className="icon">📁</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{cat.name}</span>
              <div className="sidebar-item-actions">
                <button onClick={() => setCatModal(cat)} title="Edit">✎</button>
                <button onClick={() => setConfirmDelete({ type: 'category', item: cat })} title="Delete">✕</button>
              </div>
            </div>
          ))}
          <button className="sidebar-item" onClick={() => setCatModal('new')} style={{ color: 'rgba(255,255,255,0.35)' }}>
            <span className="icon">＋</span> New Category
          </button>
        </div>
        <div className="sidebar-footer">
          <div className="user-pill">
            <div className="user-avatar">{initials}</div>
            <div className="user-email">{user?.email}</div>
            <button className="btn-signout" onClick={signOut} title="Sign out">↪</button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main">
        {/* Top bar */}
        <div className="topbar">
          <div>
            <div className="topbar-title">
              {project?.emoji && <span style={{ marginRight: 8 }}>{project.emoji}</span>}
              {project?.name || 'Project'}
            </div>
            <div className="topbar-sub">{project?.description || ''}</div>
          </div>
          <div className="topbar-actions">
            <button className="btn btn-secondary btn-sm"
              onClick={() => exportToExcel(project, categories, tasks)}>
              ⬇ Export Excel
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setCatModal('new')}>
              ＋ Category
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setTaskModal('new')}>
              ＋ Add Task
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-bar">
          <div className="stat-card s-completed">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{completed}</div>
          </div>
          <div className="stat-card s-inprogress">
            <div className="stat-label">In Progress</div>
            <div className="stat-value">{inprogress}</div>
          </div>
          <div className="stat-card s-pending">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{pending}</div>
          </div>
          <div className="stat-card s-total">
            <div className="stat-label">Total Tasks</div>
            <div className="stat-value">{total}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-bar-wrap">
          <span className="progress-label">Overall Progress</span>
          <div className="progress-track">
            <div className="progress-fill-completed" style={{ width: pct + '%' }} />
            <div className="progress-fill-inprogress" style={{ width: ipct + '%' }} />
          </div>
          <span className="progress-pct">{pct}%</span>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <span className="filter-label">Filter:</span>
          {['all', 'completed', 'inprogress', 'pending', 'onhold', 'tbd'].map(f => (
            <button key={f} className={`filter-btn ${filterStatus === f ? 'active' : ''}`}
              onClick={() => setFilterStatus(f)}>
              {f === 'all' ? 'All' : STATUS_LABELS[f]}
            </button>
          ))}
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Search tasks…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Tasks */}
        <div className="content">
          {total === 0 ? (
            <div className="empty-state">
              <div className="icon">📋</div>
              <h3>No tasks yet</h3>
              <p>Add your first task to get started.</p>
              <br />
              <button className="btn btn-primary" onClick={() => setTaskModal('new')}>＋ Add Task</button>
            </div>
          ) : (
            <>
              {grouped.map(({ cat, tasks: catTasks }) => (
                <CategoryGroup
                  key={cat.id}
                  category={cat}
                  tasks={catTasks}
                  expandedTasks={expandedTasks}
                  setExpandedTasks={setExpandedTasks}
                  updateForms={updateForms}
                  setUpdateForms={setUpdateForms}
                  onEditTask={t => setTaskModal(t)}
                  onDeleteTask={t => setConfirmDelete({ type: 'task', item: t })}
                  onEditCat={() => setCatModal(cat)}
                  onDeleteCat={() => setConfirmDelete({ type: 'category', item: cat })}
                  onAddUpdate={handleAddUpdate}
                  onDeleteUpdate={handleDeleteUpdate}
                  onAddTask={() => setTaskModal('new')}
                />
              ))}
              {uncategorized.length > 0 && (
                <CategoryGroup
                  category={{ id: 'uncategorized', name: 'Uncategorized' }}
                  tasks={uncategorized}
                  expandedTasks={expandedTasks}
                  setExpandedTasks={setExpandedTasks}
                  updateForms={updateForms}
                  setUpdateForms={setUpdateForms}
                  onEditTask={t => setTaskModal(t)}
                  onDeleteTask={t => setConfirmDelete({ type: 'task', item: t })}
                  onAddUpdate={handleAddUpdate}
                  onDeleteUpdate={handleDeleteUpdate}
                  onAddTask={() => setTaskModal('new')}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {taskModal && (
        <TaskModal
          task={taskModal !== 'new' ? taskModal : null}
          categories={categories}
          onSave={handleSaveTask}
          onClose={() => setTaskModal(null)}
        />
      )}

      {catModal && (
        <CategoryModal
          category={catModal !== 'new' ? catModal : null}
          onSave={handleSaveCat}
          onClose={() => setCatModal(null)}
        />
      )}

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                Delete {confirmDelete.type === 'task' ? 'Task' : 'Category'}
              </div>
              <button className="modal-close" onClick={() => setConfirmDelete(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{confirmDelete.item.name}</strong>?
              {confirmDelete.type === 'category' && ' All tasks in this category will become uncategorized.'}
              {confirmDelete.type === 'task' && ' All status history for this task will also be deleted.'}
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() =>
                confirmDelete.type === 'task'
                  ? handleDeleteTask(confirmDelete.item)
                  : handleDeleteCat(confirmDelete.item)
              }>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── CategoryGroup ─────────────────────────────────────────────────────────────
function CategoryGroup({ category, tasks, expandedTasks, setExpandedTasks, updateForms, setUpdateForms,
  onEditTask, onDeleteTask, onEditCat, onDeleteCat, onAddUpdate, onDeleteUpdate, onAddTask }) {

  return (
    <div className="category-group">
      <div className="category-header">
        <div className="category-name">{category.name}</div>
        <div className="category-count">{tasks.length}</div>
        {onEditCat && (
          <div className="category-actions">
            <button className="btn btn-icon btn-sm" style={{ fontSize: 11 }} onClick={onEditCat} title="Edit category">✎</button>
            <button className="btn btn-icon btn-sm" style={{ fontSize: 11, color: 'var(--red)' }} onClick={onDeleteCat} title="Delete category">🗑</button>
          </div>
        )}
        <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto', fontSize: 11 }} onClick={onAddTask}>
          ＋ Task
        </button>
      </div>

      {tasks.map((task, idx) => (
        <TaskCard
          key={task.id}
          task={task}
          index={idx + 1}
          expanded={!!expandedTasks[task.id]}
          onToggle={() => setExpandedTasks(e => ({ ...e, [task.id]: !e[task.id] }))}
          updateForm={updateForms[task.id] || { note: '', status: task.status }}
          setUpdateForm={v => setUpdateForms(f => ({ ...f, [task.id]: v }))}
          onEdit={() => onEditTask(task)}
          onDelete={() => onDeleteTask(task)}
          onAddUpdate={() => onAddUpdate(task)}
          onDeleteUpdate={(uid) => onDeleteUpdate(task, uid)}
        />
      ))}
    </div>
  )
}

// ── TaskCard ──────────────────────────────────────────────────────────────────
function TaskCard({ task, index, expanded, onToggle, updateForm, setUpdateForm, onEdit, onDelete, onAddUpdate, onDeleteUpdate }) {
  const updates = [...(task.status_updates || [])].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

  return (
    <div className={`task-card ${expanded ? 'expanded' : ''}`}>
      <div className="task-row" onClick={onToggle}>
        <div className="task-num">{index}</div>
        <div className="task-name">{task.name}</div>
        <div className="task-meta-inline">{task.description || task.protocol_target || '—'}</div>
        <div className="task-deadline">
          <small>Deadline</small>
          {task.deadline || '—'}
        </div>
        <div>
          <span className={`badge ${STATUS_CLASS[task.status] || 'badge-tbd'}`}>
            {STATUS_LABELS[task.status] || task.status}
          </span>
        </div>
        <div className="expand-chevron">▼</div>
      </div>

      <div className="task-detail">
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
          <button className="btn btn-secondary btn-sm" onClick={onEdit}>✎ Edit Task</button>
          <button className="btn btn-danger btn-sm" onClick={onDelete}>🗑 Delete</button>
        </div>

        <div className="detail-meta">
          {task.description && <div className="meta-field"><strong>Description</strong>{task.description}</div>}
          {task.protocol_target && <div className="meta-field"><strong>Protocol Target</strong>{task.protocol_target}</div>}
          {task.activity_target && <div className="meta-field"><strong>Activity Target</strong>{task.activity_target}</div>}
          {task.assignee && <div className="meta-field"><strong>Assignee</strong>{task.assignee}</div>}
          {task.deadline && <div className="meta-field"><strong>Deadline</strong>{task.deadline}</div>}
        </div>

        <div className="detail-section-label">Status History</div>
        <div className="timeline">
          {updates.length === 0 && (
            <p style={{ fontSize: 12, color: 'var(--muted)', padding: '6px 0 0 22px' }}>No updates yet. Add one below.</p>
          )}
          {updates.map((u, i) => (
            <div key={u.id} className="tl-entry">
              <div className={`tl-dot ${DOT_CLASS[u.status] || ''}`} />
              <div>
                <div className={`tl-body ${i === updates.length - 1 ? 'latest' : ''}`}>{u.note}</div>
                <div className="tl-date-label">
                  {new Date(u.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  {u.status && <span className={`badge ${STATUS_CLASS[u.status]}`} style={{ marginLeft: 8, fontSize: 10, padding: '1px 7px' }}>{STATUS_LABELS[u.status]}</span>}
                </div>
              </div>
              <div className="tl-actions">
                <button className="btn btn-icon btn-sm" style={{ fontSize: 11, color: 'var(--red)' }}
                  onClick={() => onDeleteUpdate(u.id)} title="Delete update">✕</button>
              </div>
            </div>
          ))}
        </div>

        {/* Add update form */}
        <div className="add-update-form">
          <select
            value={updateForm.status || task.status}
            onChange={e => setUpdateForm({ ...updateForm, status: e.target.value })}
            style={{ flexShrink: 0 }}
          >
            {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <textarea
            placeholder="Add a status update or note…"
            value={updateForm.note || ''}
            onChange={e => setUpdateForm({ ...updateForm, note: e.target.value })}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) onAddUpdate() }}
          />
          <button className="btn btn-primary btn-sm" onClick={onAddUpdate} disabled={!updateForm.note?.trim()}>
            Add Update
          </button>
        </div>
      </div>
    </div>
  )
}
