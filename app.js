(function () {
  "use strict";
  const cards = window.AP2_CARDS;
  const decks = window.AP2_DECKS;
  const $ = (id) => document.getElementById(id);
  const getProgress = () => { try { return JSON.parse(localStorage.getItem("ap2-swipecards-progress")) || {}; } catch { return {}; } };
  const saveProgress = (progress) => localStorage.setItem("ap2-swipecards-progress", JSON.stringify(progress));
  const state = { queue: [], position: 0, flipped: false, dragging: false, x: 0, deferredInstall: null };
  const shuffle = (items) => [...items].sort(() => Math.random() - .5);
  const escaped = (value) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

  function updateDashboard() {
    const progress = getProgress();
    const known = Object.values(progress).filter((item) => item.status === "known").length;
    const learn = Object.values(progress).filter((item) => item.status === "learn").length;
    $("known-count").textContent = known;
    $("learn-count").textContent = learn;
    $("open-count").textContent = cards.length - known - learn;
    $("deck-list").innerHTML = Object.entries(decks).map(([id, deck]) => {
      const inDeck = cards.filter((card) => card.deck === id);
      const done = inDeck.filter((card) => progress[card.id]).length;
      return `<button class="deck-card ${deck.color}" type="button" data-deck="${id}"><span class="deck-icon">${deck.title[0]}</span><span class="deck-copy"><strong>${deck.title}</strong><small>${deck.subtitle}</small><i>${done} / ${inDeck.length} bewertet</i></span><span class="deck-arrow">→</span></button>`;
    }).join("");
    document.querySelectorAll("[data-deck]").forEach((button) => button.addEventListener("click", () => start(cards.filter((card) => card.deck === button.dataset.deck), decks[button.dataset.deck].title)));
  }

  function show(id) { document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === id)); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function start(list, label, learningMode = false) { state.queue = shuffle(list); state.position = 0; state.label = label; state.learningMode = learningMode; renderCard(); show("study-view"); }
  function renderCard() {
    state.flipped = Boolean(state.learningMode);
    const card = state.queue[state.position];
    const done = !card;
    $("study-card").className = `study-card${state.flipped ? " flipped" : ""}`;
    $("study-card").style.transform = "";
    $("controls").classList.toggle("hidden", done);
    $("swipe-help").classList.toggle("hidden", done);
    $("empty-state").classList.toggle("hidden", !done);
    if (done) { $("card-counter").textContent = state.label || "Durchgang"; $("progress-bar").style.width = "100%"; return; }
    const deck = decks[card.deck];
    $("card-category").textContent = deck.title;
    $("back-category").textContent = deck.title;
    $("card-length").textContent = `${card.length === "kurz" ? "Kurzkarte" : "Erklärkarte"} · ${card.priority}`;
    $("card-title").textContent = card.title;
    $("card-prompt").textContent = card.prompt;
    $("card-answer").innerHTML = escaped(card.answer).replace(/\n/g, "<br>");
    const next = state.queue[state.position + 1];
    $("next-card").textContent = next ? next.title : "";
    $("card-counter").textContent = `${state.position + 1} / ${state.queue.length} · ${state.label}`;
    $("progress-bar").style.width = `${(state.position / state.queue.length) * 100}%`;
  }
  function flip() { if (!state.queue[state.position]) return; state.flipped = !state.flipped; $("study-card").classList.toggle("flipped", state.flipped); }
  function decide(status) {
    const card = state.queue[state.position]; if (!card) return;
    const progress = getProgress(); progress[card.id] = { status, updatedAt: new Date().toISOString() }; saveProgress(progress);
    const element = $("study-card"); element.classList.add(status === "known" ? "leave-right" : "leave-left");
    setTimeout(() => { state.position += 1; renderCard(); updateDashboard(); }, 210);
  }
  function priority() { const progress = getProgress(); const pile = cards.filter((card) => progress[card.id]?.status !== "known"); start(pile.length ? pile : cards, "Schwächen zuerst"); }
  function learningPath() { const essentials = cards.filter((card) => card.priority === "hoch").sort((a, b) => a.deck.localeCompare(b.deck)); start(essentials, "Grundlagen · Erklärung zuerst", true); }

  let startX = 0, startY = 0;
  function pointerDown(event) { if (!state.queue[state.position]) return; state.dragging = true; startX = event.clientX; startY = event.clientY; $("study-card").setPointerCapture?.(event.pointerId); }
  function pointerMove(event) { if (!state.dragging) return; state.x = event.clientX - startX; const y = event.clientY - startY; if (Math.abs(state.x) < Math.abs(y)) return; event.preventDefault(); const card = $("study-card"); card.style.transform = `translateX(${state.x}px) rotate(${state.x / 18}deg)`; card.classList.toggle("intent-left", state.x < -45); card.classList.toggle("intent-right", state.x > 45); }
  function pointerUp(event) { if (!state.dragging) return; state.dragging = false; const wasSwipe = Math.abs(state.x) > 105; $("study-card").style.transform = ""; $("study-card").classList.remove("intent-left", "intent-right"); if (wasSwipe) decide(state.x > 0 ? "known" : "learn"); else if (Math.abs(event.clientY - startY) < 18) flip(); state.x = 0; }

  $("study-card").addEventListener("pointerdown", pointerDown); $("study-card").addEventListener("pointermove", pointerMove); $("study-card").addEventListener("pointerup", pointerUp); $("study-card").addEventListener("pointercancel", pointerUp);
  $("learn-button").addEventListener("click", () => decide("learn")); $("know-button").addEventListener("click", () => decide("known")); $("flip-button").addEventListener("click", flip);
  $("back-button").addEventListener("click", () => { updateDashboard(); show("start-view"); }); $("home-button").addEventListener("click", () => { updateDashboard(); show("start-view"); });
  $("restart-button").addEventListener("click", () => start(state.queue, state.label)); $("start-priority").addEventListener("click", priority); $("start-learning").addEventListener("click", learningPath);
  $("reset-button").addEventListener("click", () => { if (confirm("Diesen Lernfortschritt wirklich löschen?")) { localStorage.removeItem("ap2-swipecards-progress"); updateDashboard(); } });
  document.addEventListener("keydown", (event) => { if (!$("study-view").classList.contains("active")) return; if (event.key === "ArrowLeft") { event.preventDefault(); decide("learn"); } if (event.key === "ArrowRight") { event.preventDefault(); decide("known"); } if (event.key === " " || event.key === "Enter") { event.preventDefault(); flip(); } });
  window.addEventListener("beforeinstallprompt", (event) => { event.preventDefault(); state.deferredInstall = event; $("install-button").classList.remove("hidden"); });
  $("install-button").addEventListener("click", async () => { if (!state.deferredInstall) return; await state.deferredInstall.prompt(); state.deferredInstall = null; $("install-button").classList.add("hidden"); });
  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js"));
  updateDashboard();
})();
