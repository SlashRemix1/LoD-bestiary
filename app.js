(() => {
  const data = window.LOD_DATA;
  if (!data) return;

  const $ = (sel) => document.querySelector(sel);
  const statsEl = $("#stats");
  const grid = $("#bestiary");
  const q = $("#q");
  const loc = $("#loc");
  const filt = $("#filt");
  const count = $("#count");
  const habitatTabs = $("#habitat-tabs");
  const habitatBody = $("#habitat-body");
  const sprites = $("#sprites");

  const locations = ["All", ...Array.from(new Set(data.monsters.map((m) => m.location))).sort()];
  loc.innerHTML = locations.map((l) => `<option value="${escapeAttr(l)}">${escapeHtml(l)}</option>`).join("");

  statsEl.innerHTML = [
    ["Monsters", data.stats.total],
    ["With HP", data.stats.hp],
    ["With EXP", data.stats.exp],
    ["HP + EXP", data.stats.both],
    ["With image", data.stats.image],
    ["Sprites archived", data.stats.sprites],
  ]
    .map(
      ([label, value]) =>
        `<div class="stat"><strong>${value}</strong><span>${escapeHtml(label)}</span></div>`,
    )
    .join("");

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }
  function escapeAttr(s) {
    return escapeHtml(s).replaceAll("'", "&#39;");
  }

  function matches(m) {
    const query = (q.value || "").trim().toLowerCase();
    const location = loc.value;
    const filter = filt.value;
    if (location !== "All" && m.location !== location) return false;
    if (filter === "hp" && !m.hp) return false;
    if (filter === "exp" && !m.exp) return false;
    if (filter === "both" && !(m.hp && m.exp)) return false;
    if (filter === "image" && !m.image) return false;
    if (!query) return true;
    const blob = [m.name, m.location, m.level, m.description, m.hp, m.exp].join(" ").toLowerCase();
    return blob.includes(query);
  }

  function renderBestiary() {
    const list = data.monsters.filter(matches);
    count.textContent = `${list.length} shown`;
    grid.innerHTML = list
      .map((m) => {
        const thumb = m.image
          ? `<img src="${escapeAttr(m.image)}" alt="${escapeAttr(m.name)}" loading="lazy" />`
          : `<span class="empty">no image</span>`;
        const chips = [];
        if (m.hp) chips.push(`<span class="chip hp">HP ${escapeHtml(m.hp)}</span>`);
        if (m.exp) chips.push(`<span class="chip exp">EXP</span>`);
        if (!m.hp && !m.exp) chips.push(`<span class="chip">stats incomplete</span>`);
        return `<article class="card">
          <div class="thumb">${thumb}</div>
          <div>
            <h3>${escapeHtml(m.name)}</h3>
            <div class="meta">${escapeHtml(m.location)}${m.level ? ` · Lv ${escapeHtml(m.level)}` : ""}</div>
            <p class="desc">${escapeHtml(m.description || "")}</p>
            <div class="chips">${chips.join("")}</div>
            ${m.exp ? `<p class="fine" style="margin-top:8px">${escapeHtml(m.exp)}</p>` : ""}
          </div>
        </article>`;
      })
      .join("");
  }

  let activeHabitat = data.habitats[0]?.location || "";
  function renderHabitatTabs() {
    habitatTabs.innerHTML = data.habitats
      .map(
        (h) =>
          `<button type="button" class="pill ${h.location === activeHabitat ? "active" : ""}" data-h="${escapeAttr(h.location)}">${escapeHtml(h.location)} (${h.monsters.length})</button>`,
      )
      .join("");
  }
  function renderHabitat() {
    const h = data.habitats.find((x) => x.location === activeHabitat) || data.habitats[0];
    if (!h) return;
    habitatBody.innerHTML = h.monsters
      .map(
        ([name, desc, level]) =>
          `<tr><td><strong>${escapeHtml(name)}</strong></td><td>${escapeHtml(desc)}</td><td>${escapeHtml(level)}</td></tr>`,
      )
      .join("");
  }

  function renderSprites() {
    const fromMonsters = data.monsters
      .filter((m) => m.image)
      .map((m) => ({ name: m.name, loc: m.location, file: m.image }));
    const orphans = (data.orphanImages || []).map((o) => ({
      name: o.name,
      loc: o.folder,
      file: o.file,
    }));
    const seen = new Set();
    const all = [...fromMonsters, ...orphans].filter((x) => {
      if (seen.has(x.file)) return false;
      seen.add(x.file);
      return true;
    });
    sprites.innerHTML = all
      .map(
        (s) => `<div class="sprite">
          <img src="${escapeAttr(s.file)}" alt="${escapeAttr(s.name)}" loading="lazy" />
          <div class="name">${escapeHtml(s.name)}</div>
          <div class="loc">${escapeHtml(s.loc)}</div>
        </div>`,
      )
      .join("");
  }

  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      const panel = document.getElementById(`panel-${btn.dataset.panel}`);
      if (panel) panel.classList.add("active");
    });
  });

  habitatTabs.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-h]");
    if (!btn) return;
    activeHabitat = btn.dataset.h;
    renderHabitatTabs();
    renderHabitat();
  });

  [q, loc, filt].forEach((el) => el.addEventListener("input", renderBestiary));

  renderBestiary();
  renderHabitatTabs();
  renderHabitat();
  renderSprites();
})();
