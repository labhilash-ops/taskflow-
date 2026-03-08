import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProjects, createProject, updateProject, deleteProject, getTasks } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import ProjectModal from '../components/ProjectModal'

export default function HomePage() {
  const { user, signOut }   = useAuth()
  const toast               = useToast()
  const navigate            = useNavigate()
  const [projects, setProjects]   = useState([])
  const [taskCounts, setTaskCounts] = useState({})
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => { loadProjects() }, [])

  async function loadProjects() {
    setLoading(true)
    try {
      const data = await getProjects()
      setProjects(data)
      // load task counts for each project
      const counts = {}
      await Promise.all(data.map(async p => {
        try {
          const tasks = await getTasks(p.id)
          counts[p.id] = {
            total:     tasks.length,
            completed: tasks.filter(t => t.status === 'completed').length,
            inprogress: tasks.filter(t => t.status === 'inprogress').length,
          }
        } catch { counts[p.id] = { total: 0, completed: 0, inprogress: 0 } }
      }))
      setTaskCounts(counts)
    } catch (e) { toast(e.message, 'error') }
    setLoading(false)
  }

  async function handleSave(values) {
    try {
      if (editing) {
        const updated = await updateProject(editing.id, values)
        setProjects(p => p.map(x => x.id === editing.id ? updated : x))
        toast('Project updated', 'success')
      } else {
        const created = await createProject({ ...values, user_id: user.id })
        setProjects(p => [created, ...p])
        toast('Project created', 'success')
      }
      setShowModal(false); setEditing(null)
    } catch (e) { toast(e.message, 'error') }
  }

  async function handleDelete(id) {
    try {
      await deleteProject(id)
      setProjects(p => p.filter(x => x.id !== id))
      toast('Project deleted')
    } catch (e) { toast(e.message, 'error') }
    setConfirmDelete(null)
  }

  const initials = user?.email?.slice(0, 2).toUpperCase()

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>Task<span>Flow</span></h1>
          <p>Project Tracker</p>
        </div>
        <div className="sidebar-section">
          <div className="sidebar-section-label">Navigation</div>
          <button className="sidebar-item active">
            <span className="icon">🏠</span> All Projects
          </button>
        </div>
        <div className="sidebar-section">
          <div className="sidebar-section-label">Projects</div>
          {projects.map(p => (
            <button key={p.id} className="sidebar-item" onClick={() => navigate(`/project/${p.id}`)}>
              <span className="icon">{p.emoji}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
            </button>
          ))}
          <button className="sidebar-item" onClick={() => setShowModal(true)} style={{ color: 'rgba(255,255,255,0.35)' }}>
            <span className="icon">＋</span> New Project
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
        <div className="topbar">
          <div>
            <div className="topbar-title">All Projects</div>
            <div className="topbar-sub">{projects.length} project{projects.length !== 1 ? 's' : ''}</div>
          </div>
          <div className="topbar-actions">
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>＋ New Project</button>
          </div>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📋</div>
            <h3>No projects yet</h3>
            <p>Create your first project to start tracking tasks.</p>
            <br />
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>＋ Create Project</button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map(p => {
              const c = taskCounts[p.id] || { total: 0, completed: 0, inprogress: 0 }
              const pct = c.total ? Math.round((c.completed / c.total) * 100) : 0
              return (
                <div key={p.id} className="project-card" onClick={() => navigate(`/project/${p.id}`)}>
                  <div className="project-card-menu" onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-icon btn-sm" style={{ fontSize: 12 }}
                        onClick={e => { e.stopPropagation(); setEditing(p); setShowModal(true) }}>✎</button>
                      <button className="btn btn-icon btn-sm" style={{ fontSize: 12, color: 'var(--red)' }}
                        onClick={e => { e.stopPropagation(); setConfirmDelete(p) }}>🗑</button>
                    </div>
                  </div>
                  <div className="project-card-color" style={{ background: p.color }}>{p.emoji}</div>
                  <h3>{p.name}</h3>
                  <p>{p.description || 'No description'}</p>
                  {c.total > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>
                        <span>Progress</span><span style={{ fontWeight: 600, color: 'var(--green)' }}>{pct}%</span>
                      </div>
                      <div className="progress-track" style={{ height: 6 }}>
                        <div className="progress-fill-completed" style={{ width: pct + '%' }} />
                        <div className="progress-fill-inprogress" style={{ width: (c.total ? Math.round((c.inprogress / c.total) * 100) : 0) + '%' }} />
                      </div>
                    </div>
                  )}
                  <div className="project-card-stats">
                    <div className="project-stat"><strong>{c.total}</strong>Tasks</div>
                    <div className="project-stat"><strong style={{ color: 'var(--green)' }}>{c.completed}</strong>Done</div>
                    <div className="project-stat"><strong style={{ color: 'var(--blue)' }}>{c.inprogress}</strong>Active</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showModal && (
        <ProjectModal
          project={editing}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditing(null) }}
        />
      )}

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Delete Project</div>
              <button className="modal-close" onClick={() => setConfirmDelete(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This will permanently delete all tasks and history within this project.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete.id)}>Delete Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
