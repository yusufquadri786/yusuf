(() => {
  'use strict';

  const STORAGE_KEY = 'nexora-clientdesk-v1';
  const STAGES = ['Discovery', 'Planning', 'Building', 'Testing', 'Delivered'];
  const DEFAULT_TASKS = [
    'Customer requirements confirmed',
    'Scope and budget approved',
    'Design or prototype approved',
    'Build completed',
    'Quality checks passed',
    'Final access and handover provided'
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const els = {
    form: $('#projectForm'), projectName: $('#projectName'), clientLabel: $('#clientLabel'), serviceType: $('#serviceType'),
    priority: $('#priority'), customerBudget: $('#customerBudget'), plannedCost: $('#plannedCost'), dueDate: $('#dueDate'),
    customerNeed: $('#customerNeed'), features: $('#features'), formError: $('#formError'), projectList: $('#projectList'),
    activeCount: $('#activeCount'), budgetTotal: $('#budgetTotal'), openTasks: $('#openTasks'), handoverReady: $('#handoverReady'),
    projectCount: $('#projectCount'), searchInput: $('#searchInput'), stageFilter: $('#stageFilter'), dialog: $('#projectDialog'),
    dialogContent: $('#dialogContent'), toast: $('#toast'), exportBtn: $('#exportBtn'), importBtn: $('#importBtn'), importFile: $('#importFile')
  };

  let projects = loadProjects();
  let activeProjectId = null;
  let toastTimer = null;

  function uid() {
    return (window.crypto && typeof window.crypto.randomUUID === 'function')
      ? window.crypto.randomUUID()
      : `p-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }

  function money(value) {
    const amount = Number(value) || 0;
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    } catch (_) {
      return `₹${Math.round(amount).toLocaleString('en-IN')}`;
    }
  }

  function safeDate(value) {
    if (!value) return 'Not set';
    const parsed = new Date(`${value}T12:00:00`);
    if (Number.isNaN(parsed.getTime())) return 'Not set';
    return parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function normalizeProject(item) {
    if (!item || typeof item !== 'object') return null;
    const budget = Number(item.budget);
    const plannedCost = Number(item.plannedCost) || 0;
    if (!String(item.name || '').trim() || !Number.isFinite(budget) || budget <= 0) return null;
    const tasks = Array.isArray(item.tasks) ? item.tasks.slice(0, 100).map((task) => ({
      id: String(task.id || uid()),
      text: String(task.text || '').slice(0, 140),
      done: Boolean(task.done)
    })).filter((task) => task.text.trim()) : DEFAULT_TASKS.map((text) => ({ id: uid(), text, done: false }));
    return {
      id: String(item.id || uid()),
      name: String(item.name).slice(0, 70),
      client: String(item.client || '').slice(0, 50),
      service: String(item.service || 'Website').slice(0, 30),
      priority: ['Low', 'Normal', 'High'].includes(item.priority) ? item.priority : 'Normal',
      budget: Math.round(budget),
      plannedCost: Math.max(0, Math.round(plannedCost)),
      spent: Math.max(0, Math.round(Number(item.spent) || 0)),
      dueDate: /^\d{4}-\d{2}-\d{2}$/.test(String(item.dueDate || '')) ? item.dueDate : '',
      need: String(item.need || '').slice(0, 700),
      features: String(item.features || '').slice(0, 700),
      stage: STAGES.includes(item.stage) ? item.stage : 'Discovery',
      tasks,
      createdAt: (Number.isFinite(Number(item.createdAt)) && Math.abs(Number(item.createdAt)) <= 8640000000000000) ? Number(item.createdAt) : Date.now()
    };
  }

  function loadProjects() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map(normalizeProject).filter(Boolean).slice(0, 250);
    } catch (error) {
      console.warn('Could not read saved NEXORA ClientDesk data:', error);
      return [];
    }
  }

  function saveProjects() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      return true;
    } catch (error) {
      console.error('Could not save NEXORA ClientDesk data:', error);
      showToast('Browser storage is full or unavailable. Export a backup.');
      return false;
    }
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => els.toast.classList.remove('show'), 2600);
  }

  function completion(project) {
    const total = project.tasks.length;
    const done = project.tasks.filter((task) => task.done).length;
    return { total, done, percent: total ? Math.round((done / total) * 100) : 0 };
  }

  function renderStats() {
    const active = projects.filter((project) => project.stage !== 'Delivered');
    const budget = active.reduce((sum, project) => sum + project.budget, 0);
    const open = projects.reduce((sum, project) => sum + project.tasks.filter((task) => !task.done).length, 0);
    const ready = projects.filter((project) => project.tasks.length > 0 && project.tasks.every((task) => task.done)).length;
    els.activeCount.textContent = String(active.length);
    els.budgetTotal.textContent = money(budget);
    els.openTasks.textContent = String(open);
    els.handoverReady.textContent = String(ready);
    els.projectCount.textContent = `${projects.length} PROJECT${projects.length === 1 ? '' : 'S'}`;
  }

  function renderProjects() {
    const query = els.searchInput.value.trim().toLowerCase();
    const stage = els.stageFilter.value;
    const filtered = projects.filter((project) => {
      const matchesQuery = !query || `${project.name} ${project.client} ${project.service}`.toLowerCase().includes(query);
      const matchesStage = stage === 'all' || project.stage === stage;
      return matchesQuery && matchesStage;
    }).sort((a, b) => b.createdAt - a.createdAt);

    if (!filtered.length) {
      const isEmpty = projects.length === 0;
      els.projectList.innerHTML = `<div class="empty-state"><div><div class="empty-icon">${isEmpty ? '＋' : '⌕'}</div><strong>${isEmpty ? 'Your pipeline is ready.' : 'No matching projects found.'}</strong><p>${isEmpty ? 'Create your first project to start tracking customer needs, budget and delivery checks.' : 'Try another search term or change the stage filter.'}</p></div></div>`;
      renderStats();
      return;
    }

    els.projectList.innerHTML = filtered.map((project) => {
      const progress = completion(project);
      const budgetRatio = project.budget ? Math.round((project.spent / project.budget) * 100) : 0;
      const overBudget = project.spent > project.budget;
      return `<article class="project-card">
        <div class="card-topline"><span class="service-chip">${escapeHTML(project.service)}</span><span class="stage-chip">${escapeHTML(project.stage)}</span></div>
        <h3>${escapeHTML(project.name)}</h3>
        <p class="client-name">${escapeHTML(project.client || 'Client label not added')} · ${escapeHTML(project.priority)} priority</p>
        <div class="card-metrics"><div><span class="metric-label">CUSTOMER BUDGET</span><span class="metric-value">${money(project.budget)}</span></div><div><span class="metric-label">BUDGET USED</span><span class="metric-value ${overBudget ? 'budget-warning' : ''}">${money(project.spent)}</span></div></div>
        <div class="progress-track" aria-label="Checklist completion ${progress.percent}%"><div class="progress-fill" style="width:${progress.percent}%"></div></div>
        <div class="progress-caption"><span>${progress.done}/${progress.total} CHECKS DONE</span><span class="${overBudget ? 'budget-warning' : ''}">${overBudget ? `${budgetRatio}% · OVER` : `${progress.percent}%`}</span></div>
        <div class="card-footer"><span class="due-date">DUE · ${safeDate(project.dueDate)}</span><button class="text-button" type="button" data-open-project="${escapeHTML(project.id)}">Open workspace ↗</button></div>
      </article>`;
    }).join('');
    renderStats();
  }

  function renderAll() {
    renderProjects();
    renderStats();
  }

  function createProject(event) {
    event.preventDefault();
    els.formError.textContent = '';
    const name = els.projectName.value.trim();
    const budget = Number(els.customerBudget.value);
    const plannedCost = Number(els.plannedCost.value || 0);
    const need = els.customerNeed.value.trim();
    if (!name || !need || !Number.isFinite(budget) || budget <= 0) {
      els.formError.textContent = 'Add a project name, customer need and a valid budget above ₹0.';
      return;
    }
    if (!Number.isFinite(plannedCost) || plannedCost < 0) {
      els.formError.textContent = 'Planned cost must be zero or a positive amount.';
      return;
    }
    if (plannedCost > budget) {
      els.formError.textContent = 'Planned cost is above the customer budget. Adjust the scope or estimate first.';
      return;
    }
    const project = normalizeProject({
      id: uid(), name, client: els.clientLabel.value.trim(), service: els.serviceType.value,
      priority: els.priority.value, budget, plannedCost, spent: 0, dueDate: els.dueDate.value,
      need, features: els.features.value.trim(), stage: 'Discovery',
      tasks: DEFAULT_TASKS.map((text) => ({ id: uid(), text, done: false })), createdAt: Date.now()
    });
    if (!project) {
      els.formError.textContent = 'This project could not be created. Check the entered details.';
      return;
    }
    projects.unshift(project);
    saveProjects();
    els.form.reset();
    els.formError.textContent = '';
    renderAll();
    showToast('Project added to your pipeline.');
    openProject(project.id);
  }

  function projectBrief(project) {
    return [
      `NEXORA AI — PROJECT BRIEF`,
      `Project: ${project.name}`,
      `Client label: ${project.client || 'Not supplied'}`,
      `Service: ${project.service}`,
      `Priority: ${project.priority}`,
      `Stage: ${project.stage}`,
      `Customer budget: ${money(project.budget)}`,
      `Planned cost: ${money(project.plannedCost)}`,
      `Budget used: ${money(project.spent)}`,
      `Target date: ${safeDate(project.dueDate)}`,
      '', 'CUSTOMER NEED', project.need,
      '', 'REQUESTED FEATURES', project.features || 'Not supplied',
      '', 'DELIVERY CHECKLIST',
      ...project.tasks.map((task) => `${task.done ? '[x]' : '[ ]'} ${task.text}`),
      '', 'Note: Budget and scope must be confirmed with the customer before work or paid services begin.'
    ].join('\n');
  }

  function openProject(id) {
    const project = projects.find((item) => item.id === id);
    if (!project) return;
    activeProjectId = id;
    const progress = completion(project);
    const overBudget = project.spent > project.budget;
    els.dialogContent.innerHTML = `<div class="dialog-inner">
      <div class="dialog-head"><div><p class="eyebrow">PROJECT WORKSPACE / ${escapeHTML(project.service.toUpperCase())}</p><h2 id="dialogTitle">${escapeHTML(project.name)}</h2><p>${escapeHTML(project.client || 'Client label not added')} · Created ${safeDate(new Date(project.createdAt).toISOString().slice(0,10))}</p></div><button class="icon-button" type="button" data-action="close" aria-label="Close project details">×</button></div>
      <div class="detail-grid">
        <div class="detail-box"><span class="metric-label">CUSTOMER BUDGET</span><strong>${money(project.budget)}</strong><p>Planned cost: ${money(project.plannedCost)}</p></div>
        <div class="detail-box"><span class="metric-label">BUDGET USED</span><strong class="${overBudget ? 'budget-warning' : ''}">${money(project.spent)}</strong><p class="${overBudget ? 'budget-warning' : ''}">${overBudget ? 'Over the customer budget — pause and review scope.' : `${money(project.budget - project.spent)} remaining`}</p></div>
      </div>
      <div class="detail-section"><h3>Project controls</h3><div class="detail-controls">
        <label><span class="metric-label">CURRENT STAGE</span><select class="field" id="editStage">${STAGES.map((item) => `<option value="${item}" ${item === project.stage ? 'selected' : ''}>${item}</option>`).join('')}</select></label>
        <label><span class="metric-label">ACTUAL SPEND (₹)</span><input class="field" id="editSpent" type="number" min="0" max="100000000" step="1" value="${project.spent}"></label>
      </div></div>
      <div class="detail-section"><h3>Customer need</h3><div class="detail-box"><p>${escapeHTML(project.need)}</p></div></div>
      <div class="detail-section"><h3>Requested features</h3><div class="detail-box"><p>${escapeHTML(project.features || 'No separate feature list added.')}</p></div></div>
      <div class="detail-section"><h3>Delivery checklist <span class="count-chip">${progress.done}/${progress.total} DONE</span></h3><div class="task-list">${project.tasks.map((task) => `<label class="task-row ${task.done ? 'done' : ''}"><input type="checkbox" data-task-id="${escapeHTML(task.id)}" ${task.done ? 'checked' : ''}><span>${escapeHTML(task.text)}</span></label>`).join('')}</div>
        <form class="task-add" id="taskAddForm"><input class="field" id="newTaskText" maxlength="140" placeholder="Add a delivery check..." aria-label="New delivery check"><button class="button button-quiet" type="submit">Add check ＋</button></form>
      </div>
      <div class="dialog-actions"><button class="button button-primary" type="button" data-action="save">Save changes</button><button class="button button-quiet" type="button" data-action="copy">Copy project brief</button><button class="button button-quiet" type="button" data-action="download">Download brief</button><button class="button button-danger" type="button" data-action="delete">Delete project</button></div>
    </div>`;
    if (typeof els.dialog.showModal === 'function') {
      if (!els.dialog.open) els.dialog.showModal();
    } else if (!els.dialog.open) {
      els.dialog.setAttribute('open', '');
    }
  }

  function getActiveProject() {
    return projects.find((project) => project.id === activeProjectId) || null;
  }

  function saveDialogChanges() {
    const project = getActiveProject();
    if (!project) return;
    const stage = $('#editStage', els.dialogContent).value;
    const spent = Number($('#editSpent', els.dialogContent).value);
    if (!STAGES.includes(stage) || !Number.isFinite(spent) || spent < 0) {
      showToast('Enter a valid stage and spend amount.');
      return;
    }
    project.stage = stage;
    project.spent = Math.round(spent);
    saveProjects();
    renderAll();
    openProject(project.id);
    showToast(project.spent > project.budget ? 'Saved — budget review needed.' : 'Project changes saved.');
  }

  async function copyBrief() {
    const project = getActiveProject();
    if (!project) return;
    const text = projectBrief(project);
    try {
      await navigator.clipboard.writeText(text);
      showToast('Project brief copied.');
    } catch (_) {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      let copied = false;
      try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
      area.remove();
      showToast(copied ? 'Project brief copied.' : 'Copy is unavailable in this browser.');
    }
  }

  function downloadBrief() {
    const project = getActiveProject();
    if (!project) return;
    downloadText(`${slugify(project.name)}-brief.txt`, projectBrief(project));
    showToast('Project brief downloaded.');
  }

  function slugify(value) {
    return String(value).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'nexora-project';
  }

  function downloadText(filename, content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function exportBackup() {
    const payload = { app: 'NEXORA ClientDesk', version: 1, exportedAt: new Date().toISOString(), projects };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nexora-clientdesk-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast('Backup exported. Keep it somewhere safe.');
  }

  function importBackup(file) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('Backup file is too large (maximum 2 MB).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || ''));
        const incoming = Array.isArray(parsed) ? parsed : parsed.projects;
        if (!Array.isArray(incoming)) throw new Error('Missing projects array');
        const cleaned = incoming.map(normalizeProject).filter(Boolean).slice(0, 250);
        if (!cleaned.length && incoming.length) throw new Error('No valid project records');
        const replace = window.confirm(`Import ${cleaned.length} project(s)? This replaces the projects currently stored in this browser.`);
        if (!replace) return;
        projects = cleaned;
        saveProjects();
        renderAll();
        showToast(`${cleaned.length} project(s) imported.`);
      } catch (error) {
        showToast('Could not import this file. Check that it is a NEXORA JSON backup.');
      } finally {
        els.importFile.value = '';
      }
    };
    reader.onerror = () => showToast('Could not read the selected file.');
    reader.readAsText(file);
  }

  els.form.addEventListener('submit', createProject);
  els.searchInput.addEventListener('input', renderProjects);
  els.stageFilter.addEventListener('change', renderProjects);
  els.projectList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-open-project]');
    if (button) openProject(button.dataset.openProject);
  });
  els.dialogContent.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'close') els.dialog.close();
    if (action === 'save') saveDialogChanges();
    if (action === 'copy') copyBrief();
    if (action === 'download') downloadBrief();
    if (action === 'delete') {
      const project = getActiveProject();
      if (project && window.confirm(`Delete “${project.name}” from this browser? This cannot be undone unless you have a backup.`)) {
        projects = projects.filter((item) => item.id !== project.id);
        saveProjects();
        els.dialog.close();
        activeProjectId = null;
        renderAll();
        showToast('Project deleted.');
      }
    }
  });
  els.dialogContent.addEventListener('change', (event) => {
    const checkbox = event.target.closest('[data-task-id]');
    if (!checkbox) return;
    const project = getActiveProject();
    if (!project) return;
    const task = project.tasks.find((item) => item.id === checkbox.dataset.taskId);
    if (!task) return;
    task.done = checkbox.checked;
    saveProjects();
    renderAll();
    openProject(project.id);
  });
  els.dialogContent.addEventListener('submit', (event) => {
    if (event.target.id !== 'taskAddForm') return;
    event.preventDefault();
    const project = getActiveProject();
    const input = $('#newTaskText', els.dialogContent);
    const text = input.value.trim();
    if (!project || !text) return;
    if (project.tasks.length >= 100) {
      showToast('This project already has the maximum of 100 checks.');
      return;
    }
    project.tasks.push({ id: uid(), text: text.slice(0, 140), done: false });
    saveProjects();
    renderAll();
    openProject(project.id);
    showToast('Delivery check added.');
  });
  els.exportBtn.addEventListener('click', exportBackup);
  els.importBtn.addEventListener('click', () => els.importFile.click());
  els.importFile.addEventListener('change', () => importBackup(els.importFile.files && els.importFile.files[0]));
  els.dialog.addEventListener('click', (event) => {
    if (event.target === els.dialog) els.dialog.close();
  });

  renderAll();
})();
