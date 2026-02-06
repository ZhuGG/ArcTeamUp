const STORAGE_KEY = "aiki_app_state_v1";
const CONSENT_KEY = "aiki_consent_v1";

const defaultSettings = {
  theme: "system",
  fontScale: 100,
  teacherModeEnabled: false,
  teacherValidationKey: "",
  notificationsEnabled: false,
  teacherModeAcknowledgedAt: ""
};

const state = {
  contentItems: [],
  templates: [],
  logs: [],
  settings: { ...defaultSettings },
  currentTemplate: null,
  currentSession: null,
  sessionIndex: 0,
  sessionRemaining: 0,
  sessionTimer: null
};

const views = {
  onboarding: document.getElementById("view-onboarding"),
  home: document.getElementById("view-home"),
  builder: document.getElementById("view-builder"),
  dojo: document.getElementById("view-dojo"),
  library: document.getElementById("view-library"),
  journal: document.getElementById("view-journal"),
  help: document.getElementById("view-help"),
  settings: document.getElementById("view-settings")
};

function saveState() {
  const payload = {
    contentItems: state.contentItems,
    templates: state.templates,
    logs: state.logs,
    settings: state.settings
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  refreshDebug();
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  try {
    const payload = JSON.parse(raw);
    state.contentItems = payload.contentItems || [];
    state.templates = payload.templates || [];
    state.logs = payload.logs || [];
    state.settings = { ...defaultSettings, ...(payload.settings || {}) };
    return true;
  } catch (error) {
    console.error("State parse error", error);
    return false;
  }
}

async function loadSeed() {
  const response = await fetch("data/seed.json");
  const seed = await response.json();
  state.contentItems = seed.contentItems;
  state.templates = seed.templates;
  state.logs = [];
  state.settings = { ...defaultSettings };
  saveState();
}

function applyTheme() {
  const root = document.documentElement;
  if (state.settings.theme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", state.settings.theme);
  }
  root.style.setProperty("--font-scale", `${state.settings.fontScale}%`);
}

function showView(name) {
  Object.values(views).forEach((view) => view.classList.remove("active"));
  const view = views[name];
  if (view) {
    view.classList.add("active");
    view.focus();
  }
}

function route() {
  const hash = window.location.hash || "#/home";
  const routeName = hash.replace("#/", "");
  if (!localStorage.getItem(CONSENT_KEY)) {
    showView("onboarding");
    return;
  }
  switch (routeName) {
    case "builder":
      showView("builder");
      renderBuilder();
      break;
    case "dojo":
      showView("dojo");
      renderDojo();
      break;
    case "library":
      showView("library");
      renderLibrary();
      break;
    case "journal":
      showView("journal");
      renderJournal();
      break;
    case "help":
      showView("help");
      break;
    case "settings":
      showView("settings");
      renderSettings();
      break;
    default:
      showView("home");
      renderHome();
  }
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function isAllowed(item) {
  if (!item.requiresTeacherValidation) return true;
  return state.settings.teacherModeEnabled;
}

function findAlternatives(item) {
  return state.contentItems.filter(
    (candidate) =>
      candidate.type === item.type &&
      candidate.autonome &&
      !candidate.requiresTeacherValidation
  );
}

function renderHome() {
  const lastSession = state.logs[state.logs.length - 1];
  const lastSessionEl = document.getElementById("last-session");
  if (lastSession) {
    const template = state.templates.find((t) => t.id === lastSession.templateId);
    lastSessionEl.textContent = `${template?.title || "Séance"} — ${new Date(
      lastSession.endedAt
    ).toLocaleString()}`;
  } else {
    lastSessionEl.textContent = "Aucune séance enregistrée.";
  }

  const list = document.getElementById("template-list");
  list.innerHTML = "";
  state.templates.forEach((template) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${template.title}</h4>
      <p class="muted">${template.intent}</p>
      <p>Durée: ${Math.round(template.durationTotalSec / 60)} min</p>
      <button data-template="${template.id}" class="primary">Démarrer</button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      startSession(template.id);
    });
    list.appendChild(card);
  });
}

function renderBuilder() {
  const blocksContainer = document.getElementById("builder-blocks");
  blocksContainer.innerHTML = "";
  if (!state.currentTemplate) return;

  state.currentTemplate.blocks.forEach((block, blockIndex) => {
    const blockEl = document.createElement("div");
    blockEl.className = "block";
    blockEl.innerHTML = `
      <div class="block-header">
        <div>
          <strong>${block.label}</strong>
          <div class="muted">Phase: ${block.phase}</div>
        </div>
        <div>
          <button data-action="move-up">↑</button>
          <button data-action="move-down">↓</button>
        </div>
      </div>
      <div class="block-items"></div>
      <div class="builder-actions">
        <select data-role="item-select"></select>
        <input type="number" min="60" step="30" value="300" data-role="duration" />
        <button data-action="add-item" class="primary">Ajouter</button>
      </div>
    `;

    blockEl.querySelector("[data-action='move-up']").addEventListener("click", () => {
      if (blockIndex === 0) return;
      const temp = state.currentTemplate.blocks[blockIndex - 1];
      state.currentTemplate.blocks[blockIndex - 1] = block;
      state.currentTemplate.blocks[blockIndex] = temp;
      renderBuilder();
    });

    blockEl.querySelector("[data-action='move-down']").addEventListener("click", () => {
      if (blockIndex === state.currentTemplate.blocks.length - 1) return;
      const temp = state.currentTemplate.blocks[blockIndex + 1];
      state.currentTemplate.blocks[blockIndex + 1] = block;
      state.currentTemplate.blocks[blockIndex] = temp;
      renderBuilder();
    });

    const select = blockEl.querySelector("[data-role='item-select']");
    const availableItems = state.contentItems.filter((item) => item.type !== "kihon" || block.phase === "kihon");
    availableItems.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.title} ${item.requiresTeacherValidation ? "(validation)" : ""}`;
      select.appendChild(option);
    });

    const itemsContainer = blockEl.querySelector(".block-items");
    block.items.forEach((blockItem, itemIndex) => {
      const content = state.contentItems.find((item) => item.id === blockItem.contentItemId);
      const itemEl = document.createElement("div");
      itemEl.className = "card";
      itemEl.innerHTML = `
        <strong>${content?.title || "Item"}</strong>
        <div class="muted">${blockItem.durationSec} sec — ${blockItem.intensity}</div>
        <div class="builder-actions">
          <button data-action="item-up">↑</button>
          <button data-action="item-down">↓</button>
          <button data-action="remove" class="danger">Retirer</button>
        </div>
      `;
      itemEl.querySelector("[data-action='remove']").addEventListener("click", () => {
        block.items.splice(itemIndex, 1);
        renderBuilder();
      });
      itemEl.querySelector("[data-action='item-up']").addEventListener("click", () => {
        if (itemIndex === 0) return;
        const temp = block.items[itemIndex - 1];
        block.items[itemIndex - 1] = blockItem;
        block.items[itemIndex] = temp;
        renderBuilder();
      });
      itemEl.querySelector("[data-action='item-down']").addEventListener("click", () => {
        if (itemIndex === block.items.length - 1) return;
        const temp = block.items[itemIndex + 1];
        block.items[itemIndex + 1] = blockItem;
        block.items[itemIndex] = temp;
        renderBuilder();
      });
      itemsContainer.appendChild(itemEl);
    });

    const addButton = blockEl.querySelector("[data-action='add-item']");
    addButton.addEventListener("click", () => {
      const itemId = select.value;
      const duration = Number(blockEl.querySelector("[data-role='duration']").value) || 300;
      const item = state.contentItems.find((it) => it.id === itemId);
      const warning = document.getElementById("builder-warning");
      if (!item) return;
      if (!isAllowed(item)) {
        warning.textContent = "Cet item nécessite une validation enseignant. Ajout bloqué en mode autonome.";
        warning.classList.remove("hidden");
        return;
      }
      if (item.requiresTeacherValidation && state.settings.teacherModeEnabled) {
        warning.textContent = "Validation enseignant requise : vous confirmez la responsabilité associée.";
        warning.classList.remove("hidden");
        if (!state.settings.teacherModeAcknowledgedAt) {
          state.settings.teacherModeAcknowledgedAt = new Date().toISOString();
          saveState();
        }
      } else {
        warning.classList.add("hidden");
      }
      block.items.push({
        contentItemId: item.id,
        durationSec: duration,
        intensity: "normal",
        guidanceMode: "normal"
      });
      renderBuilder();
    });

    if (block.phase === "discussion") {
      blockEl.querySelector(".builder-actions").classList.add("hidden");
    }

    blocksContainer.appendChild(blockEl);
  });
}

function generateSkeleton() {
  const form = document.getElementById("builder-form");
  const formData = new FormData(form);
  const title = formData.get("title");
  const intent = formData.get("intent");
  const durationTotalSec = Number(formData.get("duration"));
  const baseBlocks = [
    { id: crypto.randomUUID(), phase: "misogi", label: "Misogi — entrée", items: [] },
    { id: crypto.randomUUID(), phase: "kihon", label: "Kihon — référence", items: [] },
    { id: crypto.randomUUID(), phase: "programme", label: "Programme — mise en place", items: [] },
    { id: crypto.randomUUID(), phase: "programme", label: "Programme — mise à l'épreuve", items: [] },
    { id: crypto.randomUUID(), phase: "programme", label: "Programme — intégration", items: [] },
    { id: crypto.randomUUID(), phase: "retour_stable", label: "Retour stable", items: [] },
    { id: crypto.randomUUID(), phase: "discussion", label: "Discussion / notes", items: [] }
  ];
  state.currentTemplate = {
    id: crypto.randomUUID(),
    title,
    intent,
    durationTotalSec,
    blocks: baseBlocks
  };
  renderBuilder();
}

function saveTemplate() {
  if (!state.currentTemplate) return;
  const total = state.currentTemplate.blocks
    .flatMap((block) => block.items)
    .reduce((sum, item) => sum + item.durationSec, 0);
  state.currentTemplate.durationTotalSec = total || state.currentTemplate.durationTotalSec;
  state.templates.push(state.currentTemplate);
  state.currentTemplate = null;
  saveState();
  renderHome();
  alert("Template enregistré.");
}

function resetBuilder() {
  state.currentTemplate = null;
  document.getElementById("builder-blocks").innerHTML = "";
}

function renderLibrary() {
  const filters = document.getElementById("library-filters");
  const query = filters.querySelector("[name='query']").value.toLowerCase();
  const type = filters.querySelector("[name='type']").value;
  const level = filters.querySelector("[name='level']").value;
  const list = document.getElementById("library-list");
  list.innerHTML = "";

  state.contentItems
    .filter((item) => (!type || item.type === type))
    .filter((item) => (!level || item.level === level))
    .filter((item) =>
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.tags.join(" ").toLowerCase().includes(query)
    )
    .forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";
      const allowed = isAllowed(item);
      card.innerHTML = `
        <h4>${item.title}</h4>
        <p class="muted">${item.description}</p>
        <div class="tag">${item.type}</div>
        <div class="tag">${item.level}</div>
        <p>${item.instructions}</p>
        <p class="muted">Sécurité: ${item.safetyNotes.join(" · ")}</p>
        <p>${allowed ? "Autonome" : "Validation enseignant requise"}</p>
        <button data-action="edit">Éditer</button>
      `;
      card.querySelector("[data-action='edit']").addEventListener("click", () => {
        fillLibraryForm(item);
      });
      list.appendChild(card);
    });
}

function fillLibraryForm(item) {
  const form = document.getElementById("library-form");
  form.id.value = item.id;
  form.title.value = item.title;
  form.type.value = item.type;
  form.durationDefaultSec.value = item.durationDefaultSec;
  form.level.value = item.level;
  form.tags.value = item.tags.join(", ");
  form.autonome.value = item.autonome ? "true" : "false";
  form.description.value = item.description;
  form.instructions.value = item.instructions;
  form.safetyNotes.value = item.safetyNotes.join("; ");
}

function resetLibraryForm() {
  const form = document.getElementById("library-form");
  form.reset();
  form.id.value = "";
}

function saveLibraryItem() {
  const form = document.getElementById("library-form");
  const formData = new FormData(form);
  const autonomie = formData.get("autonome") === "true";
  const requiresValidation = !autonomie;
  const item = {
    id: formData.get("id") || crypto.randomUUID(),
    type: formData.get("type"),
    title: formData.get("title"),
    description: formData.get("description"),
    instructions: formData.get("instructions"),
    durationDefaultSec: Number(formData.get("durationDefaultSec")),
    level: formData.get("level"),
    tags: formData
      .get("tags")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    autonome: autonomie,
    requiresTeacherValidation: requiresValidation,
    safetyNotes: formData
      .get("safetyNotes")
      .split(";")
      .map((note) => note.trim())
      .filter(Boolean),
    media: { kind: "none" }
  };

  const existingIndex = state.contentItems.findIndex((entry) => entry.id === item.id);
  if (existingIndex >= 0) {
    state.contentItems[existingIndex] = item;
  } else {
    state.contentItems.push(item);
  }
  saveState();
  resetLibraryForm();
  renderLibrary();
}

function renderJournal() {
  const list = document.getElementById("journal-list");
  list.innerHTML = "";
  state.logs
    .slice()
    .reverse()
    .forEach((log) => {
      const template = state.templates.find((t) => t.id === log.templateId);
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h4>${template?.title || "Séance"}</h4>
        <p class="muted">${new Date(log.startedAt).toLocaleString()}</p>
        <p>Ressenti: ${log.ratings.ressenti} | Fatigue: ${log.ratings.fatigue} | Calme: ${log.ratings.calme} | Mobilité: ${log.ratings.mobilite}</p>
        <p>${log.notes || ""}</p>
      `;
      list.appendChild(card);
    });
  renderStats();
}

function renderStats() {
  const canvas = document.getElementById("stats-canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (state.logs.length === 0) {
    ctx.fillStyle = "#999";
    ctx.fillText("Aucune donnée", 10, 20);
    return;
  }
  const averages = {
    ressenti: 0,
    fatigue: 0,
    calme: 0,
    mobilite: 0
  };
  state.logs.forEach((log) => {
    averages.ressenti += log.ratings.ressenti;
    averages.fatigue += log.ratings.fatigue;
    averages.calme += log.ratings.calme;
    averages.mobilite += log.ratings.mobilite;
  });
  Object.keys(averages).forEach((key) => {
    averages[key] = averages[key] / state.logs.length;
  });

  const labels = Object.keys(averages);
  const barWidth = 50;
  labels.forEach((label, index) => {
    const value = averages[label];
    const height = value * 30;
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(20 + index * (barWidth + 20), 200 - height, barWidth, height);
    ctx.fillStyle = "#999";
    ctx.fillText(label, 20 + index * (barWidth + 20), 220);
  });
}

function renderSettings() {
  document.getElementById("setting-theme").value = state.settings.theme;
  document.getElementById("setting-font").value = state.settings.fontScale;
  document.getElementById("setting-teacher-mode").value = state.settings.teacherModeEnabled ? "true" : "false";
  document.getElementById("setting-teacher-key").value = state.settings.teacherValidationKey;
  document.getElementById("setting-notifications").value = state.settings.notificationsEnabled ? "true" : "false";
  refreshDebug();
}

function refreshDebug() {
  const debug = document.getElementById("debug-json");
  if (debug) {
    debug.textContent = JSON.stringify(
      {
        contentItems: state.contentItems.length,
        templates: state.templates.length,
        logs: state.logs.length,
        settings: state.settings
      },
      null,
      2
    );
  }
}

function startSession(templateId) {
  const template = state.templates.find((t) => t.id === templateId);
  if (!template) return;

  const blockedItems = template.blocks.flatMap((block) =>
    block.items.filter((item) => {
      const content = state.contentItems.find((it) => it.id === item.contentItemId);
      return content && !isAllowed(content);
    })
  );

  if (blockedItems.length > 0) {
    template.blocks.forEach((block) => {
      const nextItems = [];
      block.items.forEach((item) => {
        const content = state.contentItems.find((it) => it.id === item.contentItemId);
        if (content && isAllowed(content)) {
          nextItems.push(item);
          return;
        }
        const alternatives = content ? findAlternatives(content) : [];
        if (alternatives.length > 0) {
          const replacement = alternatives[0];
          nextItems.push({
            contentItemId: replacement.id,
            durationSec: item.durationSec,
            intensity: item.intensity,
            guidanceMode: item.guidanceMode
          });
        }
      });
      block.items = nextItems;
    });
    alert("Certains éléments réservés ont été remplacés par des alternatives autonomes.");
  }
  if (state.settings.teacherModeEnabled) {
    const reserved = template.blocks.flatMap((block) =>
      block.items.filter((item) => {
        const content = state.contentItems.find((it) => it.id === item.contentItemId);
        return content?.requiresTeacherValidation;
      })
    );
    if (reserved.length > 0) {
      if (!state.settings.teacherModeAcknowledgedAt) {
        state.settings.teacherModeAcknowledgedAt = new Date().toISOString();
        saveState();
      }
      alert("Séance contenant des éléments réservés : validation enseignant requise.");
    }
  }

  state.currentTemplate = template;
  state.currentSession = template.blocks.flatMap((block) =>
    block.items.map((item) => ({
      ...item,
      phase: block.phase,
      label: block.label
    }))
  );
  state.sessionIndex = 0;
  state.sessionRemaining = state.currentSession[0]?.durationSec || 0;
  window.location.hash = "#/dojo";
  renderDojo();
}

function renderDojo() {
  const title = document.getElementById("dojo-session-title");
  const intent = document.getElementById("dojo-intent");
  const phase = document.getElementById("dojo-phase");
  const instruction = document.getElementById("dojo-instruction");
  const timer = document.getElementById("dojo-timer");
  const remaining = document.getElementById("dojo-remaining");
  const complete = document.getElementById("dojo-complete");

  if (!state.currentTemplate || !state.currentSession) {
    title.textContent = "Séance";
    instruction.textContent = "Sélectionnez une séance depuis l'accueil.";
    return;
  }

  const current = state.currentSession[state.sessionIndex];
  const content = state.contentItems.find((item) => item.id === current.contentItemId);
  title.textContent = state.currentTemplate.title;
  intent.textContent = state.currentTemplate.intent;
  phase.textContent = current.phase;
  instruction.textContent = content?.instructions || "";
  timer.textContent = formatDuration(state.sessionRemaining);
  remaining.textContent = `Temps restant: ${formatDuration(
    state.currentSession.reduce((sum, item) => sum + item.durationSec, 0) -
      state.currentSession
        .slice(0, state.sessionIndex)
        .reduce((sum, item) => sum + item.durationSec, 0) -
      (current.durationSec - state.sessionRemaining)
  )}`;
  complete.classList.add("hidden");
}

function tickSession() {
  if (!state.currentSession) return;
  if (state.sessionRemaining <= 0) {
    nextSessionItem();
    return;
  }
  state.sessionRemaining -= 1;
  renderDojo();
}

function nextSessionItem() {
  if (!state.currentSession) return;
  if (state.sessionIndex < state.currentSession.length - 1) {
    state.sessionIndex += 1;
    state.sessionRemaining = state.currentSession[state.sessionIndex].durationSec;
    renderDojo();
  } else {
    stopSession();
    document.getElementById("dojo-complete").classList.remove("hidden");
  }
}

function prevSessionItem() {
  if (!state.currentSession) return;
  if (state.sessionIndex > 0) {
    state.sessionIndex -= 1;
    state.sessionRemaining = state.currentSession[state.sessionIndex].durationSec;
    renderDojo();
  }
}

function toggleSession() {
  const toggleBtn = document.getElementById("dojo-toggle");
  if (state.sessionTimer) {
    stopSession();
    toggleBtn.textContent = "Reprendre";
  } else {
    state.sessionTimer = setInterval(tickSession, 1000);
    toggleBtn.textContent = "Pause";
  }
}

function stopSession() {
  clearInterval(state.sessionTimer);
  state.sessionTimer = null;
  document.getElementById("dojo-toggle").textContent = "Démarrer";
}

function saveJournalEntry() {
  if (!state.currentTemplate) {
    alert("Aucune séance associée.");
    return;
  }
  const form = document.getElementById("journal-form");
  const formData = new FormData(form);
  const log = {
    id: crypto.randomUUID(),
    templateId: state.currentTemplate.id,
    startedAt: new Date().toISOString(),
    endedAt: new Date().toISOString(),
    ratings: {
      ressenti: Number(formData.get("ressenti")),
      fatigue: Number(formData.get("fatigue")),
      calme: Number(formData.get("calme")),
      mobilite: Number(formData.get("mobilite"))
    },
    notes: formData.get("notes"),
    tags: formData
      .get("tags")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    sharedWithTeacher: false
  };
  state.logs.push(log);
  saveState();
  form.reset();
  renderJournal();
  window.location.hash = "#/journal";
}

function exportData() {
  const payload = {
    contentItems: state.contentItems,
    templates: state.templates,
    logs: state.logs,
    settings: state.settings
  };
  document.getElementById("export-output").textContent = JSON.stringify(payload, null, 2);
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(reader.result);
      state.contentItems = payload.contentItems || [];
      state.templates = payload.templates || [];
      state.logs = payload.logs || [];
      state.settings = { ...defaultSettings, ...(payload.settings || {}) };
      saveState();
      applyTheme();
      renderHome();
      alert("Import terminé.");
    } catch (error) {
      alert("Import invalide.");
    }
  };
  reader.readAsText(file);
}

function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(CONSENT_KEY);
  window.location.reload();
}

function initEventListeners() {
  document.getElementById("onboarding-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const mode = new FormData(event.target).get("mode");
    state.settings.teacherModeEnabled = mode === "teacher";
    if (state.settings.teacherModeEnabled) {
      state.settings.teacherModeAcknowledgedAt = new Date().toISOString();
    }
    localStorage.setItem(CONSENT_KEY, "true");
    saveState();
    applyTheme();
    window.location.hash = "#/home";
  });

  document.getElementById("start-session-btn").addEventListener("click", () => {
    const last = state.templates[0];
    if (last) startSession(last.id);
  });

  document.getElementById("generate-template-btn").addEventListener("click", generateSkeleton);
  document.getElementById("save-template-btn").addEventListener("click", saveTemplate);
  document.getElementById("reset-template-btn").addEventListener("click", resetBuilder);

  document.getElementById("library-filters").addEventListener("input", renderLibrary);
  document.getElementById("save-item-btn").addEventListener("click", saveLibraryItem);
  document.getElementById("reset-item-btn").addEventListener("click", resetLibraryForm);

  document.getElementById("dojo-prev").addEventListener("click", prevSessionItem);
  document.getElementById("dojo-next").addEventListener("click", nextSessionItem);
  document.getElementById("dojo-toggle").addEventListener("click", toggleSession);
  document.getElementById("dojo-fullscreen").addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  document.getElementById("open-journal-entry").addEventListener("click", () => {
    window.location.hash = "#/journal";
  });

  document.getElementById("save-journal-btn").addEventListener("click", saveJournalEntry);

  document.getElementById("export-data").addEventListener("click", exportData);
  document.getElementById("import-data").addEventListener("change", (event) => {
    if (event.target.files[0]) {
      importData(event.target.files[0]);
    }
  });
  document.getElementById("reset-data").addEventListener("click", resetData);

  document.getElementById("setting-theme").addEventListener("change", (event) => {
    state.settings.theme = event.target.value;
    applyTheme();
    saveState();
  });
  document.getElementById("setting-font").addEventListener("input", (event) => {
    state.settings.fontScale = Number(event.target.value);
    applyTheme();
    saveState();
  });
  document.getElementById("setting-teacher-mode").addEventListener("change", (event) => {
    state.settings.teacherModeEnabled = event.target.value === "true";
    if (state.settings.teacherModeEnabled && !state.settings.teacherModeAcknowledgedAt) {
      state.settings.teacherModeAcknowledgedAt = new Date().toISOString();
    }
    saveState();
    renderLibrary();
  });
  document.getElementById("setting-teacher-key").addEventListener("input", (event) => {
    state.settings.teacherValidationKey = event.target.value;
    saveState();
  });
  document.getElementById("setting-notifications").addEventListener("change", (event) => {
    state.settings.notificationsEnabled = event.target.value === "true";
    saveState();
  });

  window.addEventListener("hashchange", route);
}

async function init() {
  const hasState = loadState();
  if (!hasState) {
    await loadSeed();
  }
  applyTheme();
  initEventListeners();
  route();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
  }
}

init();
