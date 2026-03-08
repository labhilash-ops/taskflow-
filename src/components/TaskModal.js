import { useState } from 'react'
import Modal from './Modal'

const STATUSES = ['pending', 'inprogress', 'completed', 'onhold', 'tbd']
const STATUS_LABELS = { pending: 'Pending', inprogress: 'In Progress', completed: 'Completed', onhold: 'On Hold', tbd: 'TBD' }

export default function TaskModal({ task, categories, onSave, onClose }) {
  const [name, setName]               = useState(task?.name || '')
  const [description, setDesc]        = useState(task?.description || '')
  const [categoryId, setCategoryId]   = useState(task?.category_id || (categories[0]?.id ?? ''))
  const [status, setStatus]           = useState(task?.status || 'pending')
  const [deadline, setDeadline]       = useState(task?.deadline || '')
  const [protocolTarget, setProto]    = useState(task?.protocol_target || '')
  const [activityTarget, setActivity] = useState(task?.activity_target || '')
  const [assignee, setAssignee]       = useState(task?.assignee || '')
  const [loading, setLoading]         = useState(false)

  async function handleSave() {
    if (!name.trim()) return
    setLoading(true)
    await onSave({
      name: name.trim(),
      description: description.trim(),
      category_id: categoryId || null,
      status,
      deadline: deadline || null,
      protocol_target: protocolTarget || null,
      activity_target: activityTarget || null,
      assignee: assignee || null,
    })
    setLoading(false)
  }

  return (
    <Modal
      title={task ? 'Edit Task' : 'New Task'}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading || !name.trim()}>
            {loading ? 'Saving…' : task ? 'Save Changes' : 'Add Task'}
          </button>
        </>
      }
    >
      <div className="form-group">
        <label className="form-label">Task Name <span>*</span></label>
        <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Related substances by HPLC" autoFocus />
      </div>

      <div className="form-group">
        <label className="form-label">Description / Protocol Action</label>
        <textarea className="form-textarea" value={description} onChange={e => setDesc(e.target.value)} placeholder="What needs to be done?" rows={2} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-select" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
            <option value="">— No category —</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
            {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Deadline</label>
          <input className="form-input" type="text" value={deadline} onChange={e => setDeadline(e.target.value)} placeholder="e.g. End October" />
        </div>
        <div className="form-group">
          <label className="form-label">Assignee</label>
          <input className="form-input" type="text" value={assignee} onChange={e => setAssignee(e.target.value)} placeholder="Name or team" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Protocol Target Date</label>
          <input className="form-input" type="text" value={protocolTarget} onChange={e => setProto(e.target.value)} placeholder="e.g. 20 Sep 2025" />
        </div>
        <div className="form-group">
          <label className="form-label">Activity Target Date</label>
          <input className="form-input" type="text" value={activityTarget} onChange={e => setActivity(e.target.value)} placeholder="e.g. 11 Oct 2025" />
        </div>
      </div>
    </Modal>
  )
}
