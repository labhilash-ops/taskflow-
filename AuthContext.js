@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:        #f5f6f8;
  --white:     #ffffff;
  --navy:      #1a1a2e;
  --navy-light:#252540;
  --border:    #e0e3e8;
  --border2:   #c8cdd8;
  --text:      #1a1a2e;
  --muted:     #6b7280;
  --light:     #f0f2f5;

  --green:     #22a06b;
  --green-bg:  #e3fcef;
  --blue:      #2684ff;
  --blue-bg:   #e8f0fe;
  --amber:     #e5a00d;
  --amber-bg:  #fff8e1;
  --red:       #e53e3e;
  --red-bg:    #fff5f5;
  --gray:      #9ca3af;
  --gray-bg:   #f0f2f5;

  --radius:    8px;
  --shadow:    0 1px 4px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.12);
}

body {
  font-family: 'Inter', sans-serif;
  background: var(--bg);
  color: var(--text);
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: inherit; }
button { font-family: inherit; cursor: pointer; }
input, select, textarea { font-family: inherit; }

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

/* ── Layout ── */
.app-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ── Sidebar ── */
.sidebar {
  width: 240px;
  min-width: 240px;
  background: var(--navy);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-logo {
  padding: 22px 20px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.sidebar-logo h1 {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.3px;
}

.sidebar-logo span { color: var(--blue); }

.sidebar-logo p {
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  margin-top: 2px;
}

.sidebar-section {
  padding: 16px 12px 8px;
}

.sidebar-section-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.3);
  padding: 0 8px;
  margin-bottom: 6px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  color: rgba(255,255,255,0.6);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.sidebar-item:hover { background: rgba(255,255,255,0.08); color: #fff; }
.sidebar-item.active { background: rgba(38,132,255,0.25); color: #fff; }
.sidebar-item .icon { font-size: 15px; width: 20px; text-align: center; }

.sidebar-item-actions {
  margin-left: auto;
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.15s;
}

.sidebar-item:hover .sidebar-item-actions { opacity: 1; }

.sidebar-item-actions button {
  background: none;
  border: none;
  color: rgba(255,255,255,0.5);
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.sidebar-item-actions button:hover { background: rgba(255,255,255,0.15); color: #fff; }

.sidebar-footer {
  margin-top: auto;
  padding: 12px;
  border-top: 1px solid rgba(255,255,255,0.08);
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 6px;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.user-email {
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.btn-signout {
  background: none;
  border: none;
  color: rgba(255,255,255,0.4);
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.15s;
}

.btn-signout:hover { color: #fff; background: rgba(255,255,255,0.1); }

/* ── Main content ── */
.main {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* ── Top bar ── */
.topbar {
  background: var(--white);
  border-bottom: 1px solid var(--border);
  padding: 14px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.topbar-title { font-size: 17px; font-weight: 700; color: var(--navy); }
.topbar-sub   { font-size: 12px; color: var(--muted); margin-top: 1px; }

.topbar-actions { display: flex; gap: 8px; align-items: center; }

/* ── Buttons ── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.btn-primary   { background: var(--navy); color: #fff; }
.btn-primary:hover   { background: var(--navy-light); }
.btn-secondary { background: var(--light); color: var(--text); border: 1px solid var(--border); }
.btn-secondary:hover { background: var(--border); }
.btn-blue      { background: var(--blue); color: #fff; }
.btn-blue:hover { background: #1a6de0; }
.btn-danger    { background: var(--red-bg); color: var(--red); border: 1px solid #fca5a5; }
.btn-danger:hover { background: #fee2e2; }
.btn-sm        { padding: 5px 12px; font-size: 12px; }
.btn-icon      { padding: 7px; border-radius: 6px; background: var(--light); border: 1px solid var(--border); color: var(--muted); font-size: 14px; }
.btn-icon:hover { background: var(--border); color: var(--text); }

/* ── Stats bar ── */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 20px 28px;
  background: var(--white);
  border-bottom: 1px solid var(--border);
}

.stat-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 18px;
  border-left: 4px solid transparent;
}

.stat-card.s-completed  { border-left-color: var(--green); }
.stat-card.s-inprogress { border-left-color: var(--blue);  }
.stat-card.s-pending    { border-left-color: var(--amber); }
.stat-card.s-total      { border-left-color: var(--navy);  }

.stat-label { font-size: 11px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.stat-value { font-size: 26px; font-weight: 700; color: var(--navy); }

/* ── Progress ── */
.progress-bar-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 28px;
  background: var(--white);
  border-bottom: 1px solid var(--border);
}

.progress-track {
  flex: 1;
  height: 8px;
  background: var(--border);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
}

.progress-fill-completed  { height: 100%; background: var(--green); transition: width 0.6s ease; }
.progress-fill-inprogress { height: 100%; background: var(--blue);  transition: width 0.6s ease; }

.progress-label { font-size: 12px; color: var(--muted); font-weight: 600; white-space: nowrap; }
.progress-pct   { font-size: 13px; font-weight: 700; color: var(--green); white-space: nowrap; min-width: 36px; text-align: right; }

/* ── Filter bar ── */
.filter-bar {
  padding: 12px 28px;
  display: flex;
  gap: 8px;
  align-items: center;
  background: var(--white);
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}

.filter-label { font-size: 12px; color: var(--muted); font-weight: 600; margin-right: 2px; }

.filter-btn {
  background: var(--light);
  border: 1px solid var(--border);
  color: var(--muted);
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.filter-btn:hover  { background: var(--border); color: var(--text); }
.filter-btn.active { background: var(--navy); border-color: var(--navy); color: #fff; }

.search-wrap { margin-left: auto; position: relative; }

.search-input {
  background: var(--light);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 6px 12px 6px 30px;
  border-radius: 6px;
  font-size: 12px;
  width: 200px;
  outline: none;
  transition: border-color 0.15s;
}

.search-input:focus { border-color: var(--blue); background: var(--white); }
.search-icon { position: absolute; left: 9px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 12px; pointer-events: none; }

/* ── Content area ── */
.content { padding: 24px 28px; flex: 1; }

/* ── Category group ── */
.category-group { margin-bottom: 28px; }

.category-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 8px;
  margin-bottom: 10px;
  border-bottom: 2px solid var(--border);
}

.category-name {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--muted);
}

.category-count {
  background: var(--border);
  color: var(--muted);
  padding: 1px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.category-actions { margin-left: auto; display: flex; gap: 6px; }

/* ── Task card ── */
.task-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 8px;
  overflow: hidden;
  transition: box-shadow 0.15s, border-color 0.15s;
}

.task-card:hover { box-shadow: var(--shadow); border-color: var(--border2); }
.task-card.expanded { border-color: var(--blue); }

.task-row {
  display: grid;
  grid-template-columns: 40px 1fr 140px 110px 100px 32px;
  gap: 12px;
  align-items: center;
  padding: 11px 14px;
  cursor: pointer;
  user-select: none;
}

.task-num  { font-size: 13px; font-weight: 700; color: #ccc; text-align: center; }
.task-name { font-size: 13px; font-weight: 500; color: var(--navy); }
.task-meta-inline { font-size: 11px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.task-deadline { font-size: 11px; color: var(--muted); text-align: right; white-space: nowrap; }
.task-deadline small { display: block; font-size: 10px; text-transform: uppercase; color: #bbb; margin-bottom: 1px; }

/* ── Status badges ── */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.badge-completed  { background: var(--green-bg); color: var(--green); }
.badge-inprogress { background: var(--blue-bg);  color: var(--blue);  }
.badge-pending    { background: var(--amber-bg); color: var(--amber); }
.badge-tbd        { background: var(--gray-bg);  color: var(--gray);  }
.badge-onhold     { background: #fdf4ff; color: #a855f7; }

.expand-chevron { color: #bbb; font-size: 11px; transition: transform 0.2s; text-align: center; }
.task-card.expanded .expand-chevron { transform: rotate(180deg); }

/* ── Task detail drawer ── */
.task-detail {
  display: none;
  background: #fafbfc;
  border-top: 1px solid var(--border);
  padding: 16px 14px 18px 66px;
}

.task-card.expanded .task-detail { display: block; }

.detail-meta {
  display: flex;
  gap: 28px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.meta-field { font-size: 11px; color: var(--muted); }
.meta-field strong { display: block; color: var(--text); font-size: 12px; margin-bottom: 2px; }

.detail-section-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #bbb;
  margin-bottom: 10px;
}

/* ── Timeline ── */
.timeline { position: relative; }

.timeline::before {
  content: '';
  position: absolute;
  left: 4px; top: 8px; bottom: 8px;
  width: 1px;
  background: var(--border);
}

.tl-entry {
  display: grid;
  grid-template-columns: 10px 1fr auto;
  gap: 12px;
  padding: 5px 0;
  align-items: flex-start;
  position: relative;
}

.tl-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  margin-top: 4px;
  position: relative; z-index: 1;
  border: 2px solid var(--border);
  background: var(--white);
  flex-shrink: 0;
}

.tl-dot.completed  { background: var(--green); border-color: var(--green); }
.tl-dot.inprogress { background: var(--blue);  border-color: var(--blue);  }
.tl-dot.pending    { background: var(--amber); border-color: var(--amber); }
.tl-dot.onhold     { background: #a855f7; border-color: #a855f7; }

.tl-body { font-size: 12px; color: var(--muted); line-height: 1.5; }
.tl-body.latest { color: var(--text); font-weight: 500; }
.tl-date-label { font-size: 10px; color: #bbb; white-space: nowrap; margin-top: 4px; }

.tl-actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.15s; }
.tl-entry:hover .tl-actions { opacity: 1; }

/* ── Add update form ── */
.add-update-form {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 8px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.add-update-form select,
.add-update-form textarea {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 7px 10px;
  font-size: 12px;
  color: var(--text);
  outline: none;
  transition: border-color 0.15s;
}

.add-update-form select:focus,
.add-update-form textarea:focus { border-color: var(--blue); }

.add-update-form textarea {
  flex: 1;
  min-width: 200px;
  resize: vertical;
  min-height: 36px;
  max-height: 120px;
}

/* ── Modal ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal {
  background: var(--white);
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.modal-header {
  padding: 18px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title { font-size: 16px; font-weight: 700; }

.modal-close {
  background: none;
  border: none;
  font-size: 18px;
  color: var(--muted);
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.15s;
}

.modal-close:hover { background: var(--light); color: var(--text); }

.modal-body { padding: 20px; }
.modal-footer {
  padding: 14px 20px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* ── Form ── */
.form-group { margin-bottom: 16px; }
.form-label { display: block; font-size: 12px; font-weight: 600; color: var(--text); margin-bottom: 6px; }
.form-label span { color: var(--red); }

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 13px;
  color: var(--text);
  outline: none;
  transition: border-color 0.15s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus { border-color: var(--blue); }

.form-textarea { resize: vertical; min-height: 80px; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

/* ── Empty state ── */
.empty-state {
  text-align: center;
  padding: 60px 24px;
  color: var(--muted);
}

.empty-state .icon { font-size: 48px; margin-bottom: 12px; }
.empty-state h3 { font-size: 16px; font-weight: 600; color: var(--text); margin-bottom: 6px; }
.empty-state p  { font-size: 13px; }

/* ── Login ── */
.login-page {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.login-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 36px 32px;
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow-md);
}

.login-logo {
  text-align: center;
  margin-bottom: 28px;
}

.login-logo h1 { font-size: 24px; font-weight: 700; color: var(--navy); }
.login-logo h1 span { color: var(--blue); }
.login-logo p { font-size: 13px; color: var(--muted); margin-top: 4px; }

.login-tabs {
  display: flex;
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 20px;
}

.login-tab {
  flex: 1;
  padding: 8px;
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 500;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.15s;
}

.login-tab.active { background: var(--navy); color: #fff; }

.error-msg {
  background: var(--red-bg);
  border: 1px solid #fca5a5;
  color: var(--red);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  margin-bottom: 14px;
}

.success-msg {
  background: var(--green-bg);
  border: 1px solid #6ee7b7;
  color: var(--green);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  margin-bottom: 14px;
}

/* ── Project cards (home) ── */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  padding: 24px 28px;
}

.project-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  cursor: pointer;
  transition: all 0.15s;
  position: relative;
}

.project-card:hover { box-shadow: var(--shadow-md); border-color: var(--blue); transform: translateY(-1px); }

.project-card-color {
  width: 36px; height: 36px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
  margin-bottom: 12px;
}

.project-card h3 { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
.project-card p  { font-size: 12px; color: var(--muted); margin-bottom: 14px; min-height: 18px; }

.project-card-stats {
  display: flex;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.project-stat { font-size: 11px; color: var(--muted); }
.project-stat strong { display: block; font-size: 16px; font-weight: 700; color: var(--navy); }

.project-card-menu {
  position: absolute;
  top: 14px; right: 14px;
  opacity: 0;
  transition: opacity 0.15s;
}

.project-card:hover .project-card-menu { opacity: 1; }

/* ── Dropdown menu ── */
.dropdown { position: relative; }

.dropdown-menu {
  position: absolute;
  right: 0; top: calc(100% + 4px);
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow-md);
  min-width: 150px;
  z-index: 100;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  font-size: 13px;
  color: var(--text);
  cursor: pointer;
  transition: background 0.1s;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.dropdown-item:hover { background: var(--light); }
.dropdown-item.danger { color: var(--red); }
.dropdown-item.danger:hover { background: var(--red-bg); }

/* ── Toast ── */
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toast {
  background: var(--navy);
  color: #fff;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  box-shadow: var(--shadow-md);
  animation: slideIn 0.2s ease;
  max-width: 300px;
}

.toast.success { background: var(--green); }
.toast.error   { background: var(--red);   }

@keyframes slideIn {
  from { transform: translateX(20px); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}

/* ── Loading ── */
.spinner {
  width: 36px; height: 36px;
  border: 3px solid var(--border);
  border-top-color: var(--blue);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin: 60px auto;
}

@keyframes spin { to { transform: rotate(360deg); } }

.loading-center { display: flex; justify-content: center; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .sidebar { display: none; }
  .stats-bar { grid-template-columns: repeat(2, 1fr); }
  .task-row { grid-template-columns: 32px 1fr auto 28px; }
  .task-meta-inline, .task-deadline small { display: none; }
  .content { padding: 16px; }
  .projects-grid { grid-template-columns: 1fr; padding: 16px; }
}
