import * as XLSX from 'xlsx'

const STATUS_LABELS = {
  pending: 'Pending',
  inprogress: 'In Progress',
  completed: 'Completed',
  onhold: 'On Hold',
  tbd: 'TBD',
}

export function exportToExcel(project, categories, tasks) {
  const wb = XLSX.utils.book_new()

  // ── Summary sheet ──────────────────────────────────────────────────────────
  const total     = tasks.length
  const completed = tasks.filter(t => t.status === 'completed').length
  const inprog    = tasks.filter(t => t.status === 'inprogress').length
  const pending   = tasks.filter(t => t.status === 'pending').length

  const summaryData = [
    ['Project', project.name],
    ['Description', project.description || ''],
    ['Exported', new Date().toLocaleString()],
    [],
    ['Total Tasks', total],
    ['Completed',   completed],
    ['In Progress', inprog],
    ['Pending',     pending],
    ['% Complete',  total ? Math.round((completed / total) * 100) + '%' : '0%'],
  ]

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary')

  // ── Tasks sheet ────────────────────────────────────────────────────────────
  const headers = ['#', 'Task Name', 'Category', 'Status', 'Assignee', 'Deadline', 'Protocol Target', 'Activity Target', 'Description', 'Latest Update']

  const rows = tasks.map((t, i) => {
    const cat    = categories.find(c => c.id === t.category_id)
    const latest = t.status_updates?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
    return [
      i + 1,
      t.name,
      cat?.name || '',
      STATUS_LABELS[t.status] || t.status,
      t.assignee || '',
      t.deadline || '',
      t.protocol_target || '',
      t.activity_target || '',
      t.description || '',
      latest ? `[${new Date(latest.created_at).toLocaleDateString()}] ${latest.note}` : '',
    ]
  })

  const wsTasks = XLSX.utils.aoa_to_sheet([headers, ...rows])

  // Column widths
  wsTasks['!cols'] = [
    { wch: 4 }, { wch: 36 }, { wch: 20 }, { wch: 14 },
    { wch: 16 }, { wch: 14 }, { wch: 16 }, { wch: 16 },
    { wch: 40 }, { wch: 50 },
  ]

  XLSX.utils.book_append_sheet(wb, wsTasks, 'Tasks')

  // ── Status history sheet ───────────────────────────────────────────────────
  const histHeaders = ['Task', 'Category', 'Status', 'Note', 'Date']
  const histRows = []

  tasks.forEach(t => {
    const cat = categories.find(c => c.id === t.category_id)
    const updates = t.status_updates || []
    updates
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .forEach(u => {
        histRows.push([
          t.name,
          cat?.name || '',
          STATUS_LABELS[u.status] || u.status,
          u.note,
          new Date(u.created_at).toLocaleString(),
        ])
      })
  })

  const wsHist = XLSX.utils.aoa_to_sheet([histHeaders, ...histRows])
  wsHist['!cols'] = [{ wch: 36 }, { wch: 20 }, { wch: 14 }, { wch: 60 }, { wch: 18 }]
  XLSX.utils.book_append_sheet(wb, wsHist, 'Status History')

  XLSX.writeFile(wb, `${project.name.replace(/[^a-z0-9]/gi, '_')}_export.xlsx`)
}
