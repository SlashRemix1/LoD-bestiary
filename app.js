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

  const locations = [
    { ko: "All", en: "All" },
    ...Array.from(new Set(data.monsters.map((m) => m.location)))
      .sort()
      .map((ko) => ({
        ko,
        en: data.monsters.find((m) => m.location === ko)?.location_en || ko,
      })),
  ];
  loc.innerHTML = locations
    .map(
      (l) =>
        `<option value="${escapeAttr(l.ko)}">${escapeHtml(
          l.ko === "All" ? "All / 전체" : `${l.en} / ${l.ko}`,
        )}</option>`,
    )
    .join("");

  statsEl.innerHTML = [
    ["Monsters / 몬스터", data.stats.total],
    ["With HP / 체력", data.stats.hp],
    ["With EXP / 경험치", data.stats.exp],
    ["HP + EXP", data.stats.both],
    ["With image / 이미지", data.stats.image],
    ["Sprites / 스프라이트", data.stats.sprites],
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

  function bilingual(en, ko) {
    const e = (en || "").trim();
    const k = (ko || "").trim();
    if (e && k && e !== k) {
      return `<span class="en">${escapeHtml(e)}</span><span class="ko">${escapeHtml(k)}</span>`;
    }
    return escapeHtml(e || k);
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
    const blob = [
      m.name,
      m.name_en,
      m.location,
      m.location_en,
      m.level,
      m.description,
      m.description_en,
      m.hp,
      m.hp_en,
      m.exp,
      m.exp_en,
    ]
      .join(" ")
      .toLowerCase();
    return blob.includes(query);
  }

  function renderBestiary() {
    const list = data.monsters.filter(matches);
    count.textContent = `${list.length} shown / ${list.length}마리`;
    grid.innerHTML = list
      .map((m) => {
        const thumb = m.image
          ? `<img src="${escapeAttr(m.image)}" alt="${escapeAttr(m.name_en || m.name)}" loading="lazy" />`
          : `<span class="empty">no image<br>이미지 없음</span>`;
        const chips = [];
        if (m.hp) {
          chips.push(
            `<span class="chip hp">HP ${escapeHtml(m.hp_en || m.hp)} <span class="chip-ko">${escapeHtml(m.hp)}</span></span>`,
          );
        }
        if (m.exp) chips.push(`<span class="chip exp">EXP</span>`);
        if (!m.hp && !m.exp) chips.push(`<span class="chip">stats incomplete / 불완전</span>`);
        const expBlock = m.exp
          ? `<p class="fine exp-line"><span class="en">${escapeHtml(m.exp_en || m.exp)}</span><span class="ko">${escapeHtml(m.exp)}</span></p>`
          : "";
        return `<article class="card">
          <div class="thumb">${thumb}</div>
          <div>
            <h3>${bilingual(m.name_en, m.name)}</h3>
            <div class="meta">${bilingual(m.location_en, m.location)}${
              m.level ? ` · Lv ${escapeHtml(m.level)}` : ""
            }</div>
            <p class="desc">${bilingual(m.description_en, m.description)}</p>
            <div class="chips">${chips.join("")}</div>
            ${expBlock}
          </div>
        </article>`;
      })
      .join("");
  }

  let activeHabitat = data.habitats[0]?.location || "";
  function renderHabitatTabs() {
    habitatTabs.innerHTML = data.habitats
      .map((h) => {
        const label = `${h.location_en || h.location} / ${h.location} (${h.monsters.length})`;
        return `<button type="button" class="pill ${
          h.location === activeHabitat ? "active" : ""
        }" data-h="${escapeAttr(h.location)}">${escapeHtml(label)}</button>`;
      })
      .join("");
  }
  function renderHabitat() {
    const h = data.habitats.find((x) => x.location === activeHabitat) || data.habitats[0];
    if (!h) return;
    habitatBody.innerHTML = h.monsters
      .map((row) => {
        const name = row.name ?? row[0];
        const nameEn = row.name_en || "";
        const desc = row.description ?? row[1];
        const descEn = row.description_en || "";
        const level = row.level ?? row[2];
        return `<tr>
          <td><strong>${bilingual(nameEn, name)}</strong></td>
          <td>${bilingual(descEn, desc)}</td>
          <td>${escapeHtml(level)}</td>
        </tr>`;
      })
      .join("");
  }

  function renderSprites() {
    const fromMonsters = data.monsters
      .filter((m) => m.image)
      .map((m) => ({
        name: m.name,
        name_en: m.name_en,
        loc: m.location,
        loc_en: m.location_en,
        file: m.image,
      }));
    const orphans = (data.orphanImages || []).map((o) => ({
      name: o.name,
      name_en: o.name_en || o.name,
      loc: o.folder,
      loc_en: o.folder_en || o.folder,
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
          <img src="${escapeAttr(s.file)}" alt="${escapeAttr(s.name_en || s.name)}" loading="lazy" />
          <div class="name">${bilingual(s.name_en, s.name)}</div>
          <div class="loc">${bilingual(s.loc_en, s.loc)}</div>
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
