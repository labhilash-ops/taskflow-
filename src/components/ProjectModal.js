import { useState } from 'react'
import Modal from './Modal'

const COLORS = [
  { bg: '#e8f0fe', emoji: '📋' },
  { bg: '#e3fcef', emoji: '🧪' },
  { bg: '#fff8e1', emoji: '🏗️' },
  { bg: '#fdf4ff', emoji: '🔬' },
  { bg: '#fff5f5', emoji: '📊' },
  { bg: '#f0f9ff', emoji: '💊' },
  { bg: '#fef3c7', emoji: '⚙️' },
  { bg: '#f0fdf4', emoji: '🎯' },
]

export default function ProjectModal({ project, onSave, onClose }) {
  const [name, setName]         = useState(project?.name || '')
  const [description, setDesc]  = useState(project?.description || '')
  const [color, setColor]       = useState(project?.color || COLORS[0].bg)
  const [emoji, setEmoji]       = useState(project?.emoji || COLORS[0].emoji)
  const [loading, setLoading]   = useState(false)

  async function handleSave() {
    if (!name.trim()) return
    setLoading(true)
    await onSave({ name: name.trim(), description: description.trim(), color, emoji })
    setLoading(false)
  }

  return (
    <Modal
      title={project ? 'Edit Project' : 'New Project'}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading || !name.trim()}>
            {loading ? 'Saving…' : project ? 'Save Changes' : 'Create Project'}
          </button>
        </>
      }
    >
      <div className="form-group">
        <label className="form-label">Project Name <span>*</span></label>
        <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Clindamycin HCL Validation" autoFocus />
      </div>
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea className="form-textarea" value={description} onChange={e => setDesc(e.target.value)} placeholder="Brief description of this project…" rows={3} />
      </div>
      <div className="form-group">
        <label className="form-label">Icon &amp; Colour</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {COLORS.map(c => (
            <button
              key={c.bg}
              onClick={() => { setColor(c.bg); setEmoji(c.emoji) }}
              style={{
                width: 40, height: 40, borderRadius: 8, background: c.bg,
                border: color === c.bg ? '2px solid #2684ff' : '2px solid transparent',
                fontSize: 18, cursor: 'pointer', transition: 'border 0.15s'
              }}
            >
              {c.emoji}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  )
}
