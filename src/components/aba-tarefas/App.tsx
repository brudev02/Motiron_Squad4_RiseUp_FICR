import { FormEvent, ReactNode, useMemo, useState } from 'react'
import type { Task, TaskDraft, TaskPriority, TaskStatus } from './types/task'

type IconName =
  | 'bell'
  | 'building'
  | 'calendar'
  | 'check'
  | 'chevron'
  | 'dashboard'
  | 'document'
  | 'edit'
  | 'filter'
  | 'help'
  | 'logout'
  | 'menu'
  | 'plus'
  | 'search'
  | 'settings'
  | 'tasks'
  | 'users'
  | 'x'

const iconPaths: Record<IconName, ReactNode> = {
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
  building: <><path d="M3 21h18" /><path d="M6 21V4h12v17" /><path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  document: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></>,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" /></>,
  filter: <path d="M4 5h16M7 12h10M10 19h4" />,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.6 2.6 0 1 1 4.2 2c-1 .7-1.7 1.2-1.7 2.5M12 17h.01" /></>,
  logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M15 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" /></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  plus: <path d="M12 5v14M5 12h14" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1v.1h-4v-.1A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1-.4h-.1v-4H3A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1v-.1h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.15.37.36.72.6 1 .28.25.63.39 1 .4h.1v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
  tasks: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="m7 8 1.5 1.5L11 7M14 8h3M7 14l1.5 1.5L11 13M14 14h3" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  x: <path d="m6 6 12 12M18 6 6 18" />,
}

function Icon({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  )
}

const initialTasks: Task[] = [
  { id: '1', title: 'Renovar alvará de funcionamento', description: 'Providenciar renovação anual junto à prefeitura.', unit: 'Matriz São Paulo', assignee: 'Marina Costa', dueDate: '2026-09-12', status: 'pending', priority: 'high' },
  { id: '2', title: 'Atualizar documentos dos colaboradores', description: 'Revisar e atualizar os documentos pendentes.', unit: 'Filial Campinas', assignee: 'Rafael Lima', dueDate: '2026-09-15', status: 'in_progress', priority: 'medium' },
  { id: '3', title: 'Revisar plano de segurança', description: 'Validar plano de segurança e rotas de evacuação.', unit: 'Matriz São Paulo', assignee: 'Carlos Mendes', dueDate: '2026-09-18', status: 'in_progress', priority: 'high' },
  { id: '4', title: 'Enviar relatório mensal', description: 'Consolidar indicadores e enviar para a diretoria.', unit: 'Filial Santos', assignee: 'Ana Júlia', dueDate: '2026-09-20', status: 'pending', priority: 'medium' },
  { id: '5', title: 'Agendar treinamento obrigatório', description: 'Organizar treinamento de boas práticas.', unit: 'Filial Campinas', assignee: 'Beatriz Alves', dueDate: '2026-09-23', status: 'pending', priority: 'low' },
  { id: '6', title: 'Atualizar inventário de equipamentos', description: 'Conferir equipamentos e registrar alterações.', unit: 'Centro Logístico', assignee: 'Lucas Rocha', dueDate: '2026-09-06', status: 'completed', priority: 'low' },
  { id: '7', title: 'Revisar contratos de fornecedores', description: 'Revisão semestral dos contratos ativos.', unit: 'Matriz São Paulo', assignee: 'Marina Costa', dueDate: '2026-09-08', status: 'completed', priority: 'medium' },
]

const statusLabels: Record<TaskStatus, string> = {
  pending: 'Pendente',
  in_progress: 'Em andamento',
  completed: 'Concluída',
}

const priorityLabels: Record<TaskPriority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
}

const emptyDraft: TaskDraft = {
  title: '',
  description: '',
  unit: '',
  assignee: '',
  dueDate: '',
  status: 'pending',
  priority: 'medium',
}

const navItems: Array<{ icon: IconName; label: string }> = [
  { icon: 'dashboard', label: 'Visão geral' },
  { icon: 'building', label: 'Unidades' },
  { icon: 'document', label: 'Documentos' },
  { icon: 'tasks', label: 'Tarefas' },
  { icon: 'users', label: 'Equipe' },
]

function MetricCard({ icon, label, value, tone, note }: { icon: IconName; label: string; value: number; tone: 'teal' | 'amber' | 'green'; note: string }) {
  const tones = {
    teal: 'bg-brand-50 text-brand-700',
    amber: 'bg-amber-50 text-amber-600',
    green: 'bg-emerald-50 text-emerald-600',
  }
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <strong className="mt-2 block text-3xl font-bold tracking-tight text-slate-900">{value}</strong>
        </div>
        <span className={`grid h-11 w-11 place-items-center rounded-xl ${tones[tone]}`}><Icon name={icon} size={21} /></span>
      </div>
      <p className="mt-4 text-xs text-slate-400">{note}</p>
    </article>
  )
}

function TaskModal({ task, onClose, onSave }: { task: Task | null; onClose: () => void; onSave: (draft: TaskDraft) => void }) {
  const [draft, setDraft] = useState<TaskDraft>(task ? { ...task } : emptyDraft)
  const [errors, setErrors] = useState<Partial<Record<keyof TaskDraft, string>>>({})

  function update<K extends keyof TaskDraft>(key: K, value: TaskDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    const nextErrors: Partial<Record<keyof TaskDraft, string>> = {}
    if (!draft.title.trim()) nextErrors.title = 'Informe o título da tarefa.'
    if (!draft.unit) nextErrors.unit = 'Selecione uma unidade.'
    if (!draft.assignee.trim()) nextErrors.assignee = 'Informe o responsável.'
    if (!draft.dueDate) nextErrors.dueDate = 'Informe o prazo.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    if (draft.status === 'completed' && task?.status !== 'completed' && !window.confirm('Deseja confirmar a conclusão desta tarefa?')) return
    onSave(draft)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
      <div className="max-h-[94vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white px-6 py-5">
          <div>
            <h2 id="task-modal-title" className="text-xl font-bold text-slate-900">{task ? 'Editar tarefa' : 'Nova tarefa'}</h2>
            <p className="mt-1 text-sm text-slate-500">{task ? 'Atualize as informações e o andamento.' : 'Preencha os dados para adicionar uma nova tarefa.'}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Fechar modal"><Icon name="x" /></button>
        </div>
        <form onSubmit={submit} className="space-y-5 p-6">
          <Field label="Título da tarefa" error={errors.title}>
            <input value={draft.title} onChange={(e) => update('title', e.target.value)} className="field" placeholder="Ex.: Renovar licença ambiental" autoFocus />
          </Field>
          <Field label="Descrição" optional>
            <textarea value={draft.description} onChange={(e) => update('description', e.target.value)} className="field min-h-24 resize-none" placeholder="Adicione detalhes importantes sobre a tarefa..." />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Unidade" error={errors.unit}>
              <select value={draft.unit} onChange={(e) => update('unit', e.target.value)} className="field">
                <option value="">Selecione uma unidade</option>
                <option>Matriz São Paulo</option>
                <option>Filial Campinas</option>
                <option>Filial Santos</option>
                <option>Centro Logístico</option>
              </select>
            </Field>
            <Field label="Responsável" error={errors.assignee}>
              <input value={draft.assignee} onChange={(e) => update('assignee', e.target.value)} className="field" placeholder="Nome do responsável" />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Status">
              <select value={draft.status} onChange={(e) => update('status', e.target.value as TaskStatus)} className="field">
                {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </Field>
            <Field label="Prioridade">
              <select value={draft.priority} onChange={(e) => update('priority', e.target.value as TaskPriority)} className="field">
                {Object.entries(priorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </Field>
            <Field label="Prazo" error={errors.dueDate}>
              <input type="date" value={draft.dueDate} onChange={(e) => update('dueDate', e.target.value)} className="field" />
            </Field>
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">{task ? 'Salvar alterações' : 'Criar tarefa'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, error, optional, children }: { label: string; error?: string; optional?: boolean; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label} {optional && <span className="font-normal text-slate-400">(opcional)</span>}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  )
}

export default function App() {
  const [tasks, setTasks] = useState(initialTasks)
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all')
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [toast, setToast] = useState('')

  const counts = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter((task) => task.status !== 'completed').length,
    completed: tasks.filter((task) => task.status === 'completed').length,
  }), [tasks])

  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const haystack = `${task.title} ${task.unit} ${task.assignee}`.toLowerCase()
    return matchesStatus && haystack.includes(query.toLowerCase())
  }), [query, statusFilter, tasks])

  function openNewTask() {
    setEditingTask(null)
    setModalOpen(true)
  }

  function openEditTask(task: Task) {
    setEditingTask(task)
    setModalOpen(true)
  }

  function saveTask(draft: TaskDraft) {
    if (editingTask) {
      setTasks((current) => current.map((task) => task.id === editingTask.id ? { ...draft, id: task.id } : task))
      setToast('Tarefa atualizada com sucesso.')
    } else {
      setTasks((current) => [{ ...draft, id: crypto.randomUUID() }, ...current])
      setToast('Nova tarefa criada com sucesso.')
    }
    setModalOpen(false)
    window.setTimeout(() => setToast(''), 3000)
  }

  return (
    <div className="min-h-screen bg-[#f3f8f7] text-slate-900">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#073c45] text-white transition-transform lg:translate-x-0 ${mobileMenu ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 items-center gap-3 border-b border-white/8 px-6">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 shadow-lg shadow-black/20"><Icon name="building" size={19} /></span>
          <div><p className="text-[15px] font-bold leading-tight tracking-tight">Gestão Central</p><p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">Plataforma corporativa</p></div>
          <button onClick={() => setMobileMenu(false)} className="ml-auto p-1 text-slate-400 lg:hidden" aria-label="Fechar menu"><Icon name="x" /></button>
        </div>
        <nav className="flex-1 px-3 py-6" aria-label="Menu principal">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-500">Menu principal</p>
          <div className="space-y-1">
            {navItems.map((item) => (
              <button key={item.label} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${item.label === 'Tarefas' ? 'bg-brand-500 text-white shadow-lg shadow-black/20' : 'text-teal-100/60 hover:bg-white/5 hover:text-white'}`}>
                <Icon name={item.icon} size={19} /><span>{item.label}</span>
                {item.label === 'Tarefas' && counts.pending > 0 && <span className="ml-auto rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-bold">{counts.pending}</span>}
              </button>
            ))}
          </div>
        </nav>
        <div className="border-t border-white/8 p-3">
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white"><Icon name="settings" size={18} />Configurações</button>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white"><Icon name="help" size={18} />Central de ajuda</button>
          <div className="mt-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-300 to-brand-600 text-xs font-bold text-[#073c45]">MC</span>
            <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">Marina Costa</p><p className="truncate text-[11px] text-slate-500">Administradora</p></div>
            <Icon name="logout" size={17} className="text-slate-500" />
          </div>
        </div>
      </aside>

      {mobileMenu && <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setMobileMenu(false)} aria-label="Fechar menu" />}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-20 items-center border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur md:px-8">
          <button onClick={() => setMobileMenu(true)} className="mr-3 rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Abrir menu"><Icon name="menu" /></button>
          <div className="hidden items-center gap-2 text-sm text-slate-400 sm:flex"><span>Gestão</span><Icon name="chevron" size={14} /><span className="font-medium text-slate-700">Tarefas</span></div>
          <div className="ml-auto flex items-center gap-2">
            <button className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100" aria-label="Notificações"><Icon name="bell" size={20} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" /></button>
            <div className="mx-2 hidden h-7 w-px bg-slate-200 sm:block" />
            <div className="hidden items-center gap-2 sm:flex"><span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-800">MC</span><div><p className="text-xs font-semibold">Marina Costa</p><p className="text-[10px] text-slate-400">Administradora</p></div></div>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] px-4 py-7 md:px-8 md:py-9">
          <section className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-brand-700">Organização e controle</p><h1 className="text-3xl font-bold tracking-tight text-[#073c45] md:text-4xl">Tarefas</h1><p className="mt-2 text-sm text-slate-500">Acompanhe prazos, prioridades e o andamento da sua equipe.</p></div>
            <button onClick={openNewTask} className="btn-primary shrink-0"><Icon name="plus" size={18} />Nova tarefa</button>
          </section>

          <section className="mb-7 grid gap-4 sm:grid-cols-3">
            <MetricCard icon="tasks" label="Total de tarefas" value={counts.total} tone="teal" note="Todas as tarefas cadastradas" />
            <MetricCard icon="calendar" label="Tarefas pendentes" value={counts.pending} tone="amber" note="Pendentes ou em andamento" />
            <MetricCard icon="check" label="Tarefas concluídas" value={counts.completed} tone="green" note={`${counts.total ? Math.round((counts.completed / counts.total) * 100) : 0}% do total concluído`} />
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
            <div className="border-b border-slate-100 p-4 md:p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="relative w-full xl:max-w-sm"><Icon name="search" size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar tarefa, unidade ou responsável..." className="field pl-10" aria-label="Buscar tarefas" /></div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0">
                  <span className="mr-1 flex shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-400"><Icon name="filter" size={15} />Situação:</span>
                  {([
                    ['all', 'Todas'],
                    ['pending', 'Pendentes'],
                    ['in_progress', 'Em andamento'],
                    ['completed', 'Concluídas'],
                  ] as const).map(([value, label]) => <button key={value} onClick={() => setStatusFilter(value)} className={`filter-chip ${statusFilter === value ? 'filter-chip-active' : ''}`}>{label}</button>)}
                </div>
              </div>
            </div>

            {filteredTasks.length > 0 ? (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[920px] text-left">
                    <thead><tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-bold uppercase tracking-[.12em] text-slate-400"><th className="px-6 py-4">Tarefa</th><th className="px-4 py-4">Unidade</th><th className="px-4 py-4">Responsável</th><th className="px-4 py-4">Prioridade</th><th className="px-4 py-4">Prazo</th><th className="px-4 py-4">Status</th><th className="px-5 py-4 text-right">Ações</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredTasks.map((task) => (
                        <tr key={task.id} className="group transition hover:bg-slate-50/70">
                          <td className="px-6 py-4"><p className="max-w-xs truncate text-sm font-semibold text-slate-800">{task.title}</p><p className="mt-1 max-w-xs truncate text-xs text-slate-400">{task.description || 'Sem descrição'}</p></td>
                          <td className="px-4 py-4 text-sm text-slate-600">{task.unit}</td>
                          <td className="px-4 py-4"><div className="flex items-center gap-2.5"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">{task.assignee.split(' ').map((word) => word[0]).slice(0, 2).join('')}</span><span className="text-sm text-slate-600">{task.assignee}</span></div></td>
                          <td className="px-4 py-4"><PriorityBadge priority={task.priority} /></td>
                          <td className="px-4 py-4"><span className="flex items-center gap-1.5 whitespace-nowrap text-sm text-slate-600"><Icon name="calendar" size={15} className="text-slate-400" />{formatDate(task.dueDate)}</span></td>
                          <td className="px-4 py-4"><StatusBadge status={task.status} /></td>
                          <td className="px-5 py-4 text-right"><button onClick={() => openEditTask(task)} className="rounded-lg p-2 text-slate-400 transition hover:bg-brand-50 hover:text-brand-700" aria-label={`Editar ${task.title}`}><Icon name="edit" size={17} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="divide-y divide-slate-100 md:hidden">
                  {filteredTasks.map((task) => (
                    <article key={task.id} className="p-4">
                      <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-800">{task.title}</p><p className="mt-1 text-xs text-slate-400">{task.unit}</p></div><button onClick={() => openEditTask(task)} className="rounded-lg border border-slate-200 p-2 text-slate-500"><Icon name="edit" size={16} /></button></div>
                      <div className="mt-4 flex flex-wrap gap-2"><StatusBadge status={task.status} /><PriorityBadge priority={task.priority} /></div>
                      <div className="mt-4 flex items-center justify-between text-xs text-slate-500"><span>{task.assignee}</span><span className="flex items-center gap-1"><Icon name="calendar" size={14} />{formatDate(task.dueDate)}</span></div>
                    </article>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-xs text-slate-400"><span>Exibindo <strong className="text-slate-600">{filteredTasks.length}</strong> de {tasks.length} tarefas</span><span className="hidden sm:inline">Dados atualizados agora</span></div>
              </>
            ) : (
              <div className="flex flex-col items-center px-5 py-16 text-center"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-500"><Icon name="search" size={24} /></span><h3 className="mt-4 font-semibold text-slate-800">Nenhuma tarefa encontrada</h3><p className="mt-1 max-w-sm text-slate-400">Ajuste sua busca ou altere o filtro de situação para encontrar outras tarefas.</p><button onClick={() => { setQuery(''); setStatusFilter('all') }} className="mt-5 text-sm font-semibold text-brand-700 hover:text-brand-800">Limpar filtros</button></div>
            )}
          </section>
        </main>
      </div>

      {modalOpen && <TaskModal task={editingTask} onClose={() => setModalOpen(false)} onSave={saveTask} />}
      {toast && <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl"><span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500"><Icon name="check" size={13} /></span>{toast}</div>}
    </div>
  )
}

function StatusBadge({ status }: { status: TaskStatus }) {
  const styles: Record<TaskStatus, string> = {
    pending: 'bg-amber-50 text-amber-700 ring-amber-600/10',
    in_progress: 'bg-brand-50 text-brand-800 ring-brand-600/10',
    completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  }
  const dots: Record<TaskStatus, string> = { pending: 'bg-amber-500', in_progress: 'bg-brand-500', completed: 'bg-emerald-500' }
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}><span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} />{statusLabels[status]}</span>
}

function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const styles: Record<TaskPriority, string> = {
    low: 'bg-slate-100 text-slate-600',
    medium: 'bg-amber-50 text-amber-700',
    high: 'bg-red-50 text-red-700',
  }
  return <span className={`inline-flex rounded-md px-2 py-1 text-[11px] font-bold ${styles[priority]}`}>{priorityLabels[priority]}</span>
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`)).replace('.', '')
}
