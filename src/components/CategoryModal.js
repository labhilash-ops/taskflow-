import { useState } from 'react'
import Modal from './Modal'

export default function CategoryModal({ category, onSave, onClose }) {
  const [name, setName]   = useState(category?.name || '')
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    if (!name.trim()) return
    setLoading(true)
    await onSave({ name: name.trim() })
    setLoading(false)
  }

  return (
    <Modal
      title={category ? 'Edit Category' : 'New Category'}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading || !name.trim()}>
            {loading ? 'Saving…' : category ? 'Save Changes' : 'Add Category'}
          </button>
        </>
      }
    >
      <div className="form-group">
        <label className="form-label">Category Name <span>*</span></label>
        <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. API Testing, Excipients, Packaging…" autoFocus />
      </div>
    </Modal>
  )
}
