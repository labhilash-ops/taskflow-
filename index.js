import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Projects ──────────────────────────────────────────────────────────────────
export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createProject(project) {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateProject(id, updates) {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProject(id) {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}

// ── Categories ────────────────────────────────────────────────────────────────
export async function getCategories(projectId) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('project_id', projectId)
    .order('position', { ascending: true })
  if (error) throw error
  return data
}

export async function createCategory(category) {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateCategory(id, updates) {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteCategory(id) {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}

// ── Tasks ─────────────────────────────────────────────────────────────────────
export async function getTasks(projectId) {
  const { data, error } = await supabase
    .from('tasks')
    .select(`*, categories(name), status_updates(*)`)
    .eq('project_id', projectId)
    .order('position', { ascending: true })
  if (error) throw error
  return data
}

export async function createTask(task) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateTask(id, updates) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteTask(id) {
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw error
}

// ── Status Updates ────────────────────────────────────────────────────────────
export async function getStatusUpdates(taskId) {
  const { data, error } = await supabase
    .from('status_updates')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function addStatusUpdate(update) {
  const { data, error } = await supabase
    .from('status_updates')
    .insert([update])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteStatusUpdate(id) {
  const { error } = await supabase.from('status_updates').delete().eq('id', id)
  if (error) throw error
}
