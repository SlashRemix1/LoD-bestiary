(() => {
  const data = window.LOD_DATA;
  if (!data) return;
  const unnamed = Array.isArray(window.LOD_UNNAMED) ? window.LOD_UNNAMED : [];
  if (unnamed.length) {
    data.monsters = data.monsters.concat(unnamed);
    data.stats.unnamed = unnamed.length;
    data.stats.total = data.monsters.length;
    data.stats.image = data.monsters.filter((m) => m.image).length;
  }
  const extras = window.LOD_EXTRAS || {};
  for (const m of data.monsters) {
    const extra = extras[m.name];
    if (!extra) continue;
    m.element = extra.element || [];
    m.parts = extra.parts || [];
    m.crafts = extra.crafts || [];
    m.quests = extra.quests || [];
    m.client_notes = extra.notes || [];
  }
  data.stats.extras = Object.keys(extras).length;

  const $ = (sel) => document.querySelector(sel);
  const statsEl = $("#stats");
  const grid = $("#bestiary");
  const q = $("#q");
  const loc = $("#loc");
  const filt = $("#filt");
  const count = $("#count");
  const habitatTabs = $("#habitat-tabs");
  const habitatBody = $("#habitat-body");
  const habitatBlurb = $("#habitat-blurb");
  const sprites = $("#sprites");
  const pageTabs = $("#page-tabs");
  const officialFrame = $("#official-frame");

  const habitatOrder = (data.habitats || []).map((h) => h.location);
  const locations = [
    { ko: "All", en: "All" },
    ...Array.from(new Set(data.monsters.map((m) => m.location)))
      .sort((a, b) => zoneRank(a) - zoneRank(b) || a.localeCompare(b, "ko"))
      .map((ko) => ({
        ko,
        en: data.monsters.find((m) => m.location === ko)?.location_en || ko,
      })),
  ];
  function zoneRank(name) {
    if (name === "Unnamed") return 10_000;
    const i = habitatOrder.indexOf(name);
    return i === -1 ? 5_000 : i;
  }
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
    ["Unnamed sprites / 이름 없음", data.stats.unnamed || 0],
    ["Client extras / 부가정보", data.stats.extras || 0],
    ["Yuki server / 유키", (window.LOD_YUKI && window.LOD_YUKI.stats && window.LOD_YUKI.stats.total) || 0],
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
    if (filter === "extras" && !(m.parts?.length || m.crafts?.length || m.quests?.length || m.element?.length || m.client_notes?.length)) return false;
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
      m.sprite,
      m.source,
      ...(m.parts || []),
      ...(m.crafts || []),
      ...(m.quests || []),
      ...(m.element || []),
    ]
      .join(" ")
      .toLowerCase();
    return blob.includes(query);
  }

  const pageSize = 36;
  const zonePage = new Map();

  function levelValue(m) {
    const n = Number(m.level);
    return Number.isFinite(n) && m.level !== "" ? n : 9999;
  }

  function spriteValue(m) {
    const n = Number(m.sprite);
    return Number.isFinite(n) ? n : 999999;
  }

  function cardHtml(m) {
    const thumb = m.image
      ? `<img src="${escapeAttr(m.image)}" alt="${escapeAttr(m.name_en || m.name)}" loading="lazy" />`
      : `<span class="empty">no image<br>이미지 없음</span>`;
    const chips = [];
    if (m.sprite) chips.push(`<span class="chip">Sprite ${escapeHtml(m.sprite)}</span>`);
    if (m.hp) chips.push(`<span class="chip hp">HP ${escapeHtml(m.hp)}</span>`);
    if (m.exp) chips.push(`<span class="chip exp">EXP ${escapeHtml(m.exp)}</span>`);
    if (m.element?.length) chips.push(`<span class="chip">DEF ${escapeHtml(m.element.join("/"))}</span>`);
    if (!m.unnamed && !m.hp && !m.exp) chips.push(`<span class="chip">no official HP/EXP · 공식 수치 없음</span>`);
    const extra = m.source ? ` · ${escapeHtml(m.source)}` : "";
    const lines = [];
    if (m.parts?.length) lines.push(`<div class="extra"><span>Parts · 재료</span>${escapeHtml(m.parts.join(", "))}</div>`);
    if (m.crafts?.length) lines.push(`<div class="extra"><span>Used in · 제작</span>${escapeHtml(m.crafts.join(", "))}</div>`);
    if (m.quests?.length) lines.push(`<div class="extra"><span>Quests · 퀘스트</span>${escapeHtml(m.quests.join(" · "))}</div>`);
    return `<article class="card">
      <div class="thumb">${thumb}</div>
      <div>
        <h3>${bilingual(m.name_en, m.name)}</h3>
        <div class="meta">${bilingual(m.location_en, m.location)}${
          m.level ? ` · Lv ${escapeHtml(m.level)}` : ""
        }${extra}</div>
        <p class="desc">${bilingual(m.description_en, m.description)}</p>
        <div class="chips">${chips.join("")}</div>
        ${lines.join("")}
      </div>
    </article>`;
  }

  function renderBestiary() {
    const list = data.monsters.filter(matches);
    count.textContent = `${list.length} shown / ${list.length}마리`;
    const groups = new Map();
    for (const m of list) {
      if (!groups.has(m.location)) groups.set(m.location, []);
      groups.get(m.location).push(m);
    }
    const zones = [...groups.keys()].sort((a, b) => zoneRank(a) - zoneRank(b) || a.localeCompare(b, "ko"));
    grid.innerHTML = zones
      .map((zone) => {
        const rows = groups.get(zone).slice().sort((a, b) => {
          const byLevel = levelValue(a) - levelValue(b);
          if (byLevel) return byLevel;
          const bySprite = spriteValue(a) - spriteValue(b);
          if (bySprite) return bySprite;
          return String(a.name).localeCompare(String(b.name), "ko");
        });
        const pages = Math.max(1, Math.ceil(rows.length / pageSize));
        const page = Math.min(zonePage.get(zone) || 0, pages - 1);
        zonePage.set(zone, page);
        const slice = rows.slice(page * pageSize, (page + 1) * pageSize);
        const sample = rows[0];
        const pager =
          pages > 1
            ? `<div class="pager">
                <button type="button" data-zone="${escapeAttr(zone)}" data-page="${page - 1}" ${page === 0 ? "disabled" : ""}>Prev · 이전</button>
                <span>${page + 1} / ${pages}</span>
                <button type="button" data-zone="${escapeAttr(zone)}" data-page="${page + 1}" ${page === pages - 1 ? "disabled" : ""}>Next · 다음</button>
              </div>`
            : "";
        return `<section class="zone" data-zone-section="${escapeAttr(zone)}">
          <h2>${bilingual(sample.location_en, zone)} <span>${rows.length}</span></h2>
          <div class="grid">${slice.map(cardHtml).join("")}</div>
          ${pager}
        </section>`;
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
    const blurbs = (data.officialAreas || []).filter((a) => a.location === h.location);
    if (habitatBlurb) {
      habitatBlurb.innerHTML = blurbs
        .map(
          (a) => `<article class="area-blurb">
            <h2>${bilingual(a.title_en, a.title_ko)}</h2>
            <p>${bilingual(a.text_en, a.text_ko)}</p>
          </article>`,
        )
        .join("");
    }
    const other = document.querySelector("#other-areas");
    if (other && !other.dataset.ready) {
      other.dataset.ready = "1";
      other.innerHTML = (data.officialAreas || [])
        .filter((a) => !a.location)
        .map(
          (a) => `<article class="area-blurb">
            <h2>${bilingual(a.title_en, a.title_ko)}</h2>
            <p>${bilingual(a.text_en, a.text_ko)}</p>
          </article>`,
        )
        .join("");
    }
    habitatBody.innerHTML = h.monsters
      .map((row) => {
        const name = row.name ?? row[0];
        const nameEn = row.name_en || "";
        const desc = row.description ?? row[1];
        const descEn = row.description_en || "";
        const level = row.level ?? row[2];
        const stat = data.monsters.find((m) => m.name === name && m.location === h.location);
        const hp = stat?.hp || row.hp || "";
        const exp = stat?.exp || row.exp || "";
        const cell = (value) =>
          value
            ? `<td class="num">${escapeHtml(value)}</td>`
            : `<td class="num missing">—</td>`;
        return `<tr>
          <td><strong>${bilingual(nameEn, name)}</strong></td>
          <td>${bilingual(descEn, desc)}</td>
          <td class="num">${escapeHtml(level)}</td>
          ${cell(hp)}
          ${cell(exp)}
        </tr>`;
      })
      .join("");
  }

  const pages = data.officialPages || [];
  let activePage = pages[0]?.file || "";
  function renderPages() {
    if (!pageTabs || !officialFrame) return;
    pageTabs.innerHTML = pages
      .map((p) => {
        const label = `${p.label_en} / ${p.label_ko}${p.page ? ` · ${p.page}` : ""}`;
        return `<button type="button" class="pill ${
          p.file === activePage ? "active" : ""
        }" data-page="${escapeAttr(p.file)}">${escapeHtml(label)}</button>`;
      })
      .join("");
    if (activePage) officialFrame.src = activePage;
  }

  function renderSprites() {
    const fromMonsters = data.monsters
      .filter((m) => m.image && !m.unnamed)
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
      if (panel) {
        panel.classList.add("active");
        panel.scrollIntoView({ block: "start" });
      }
    });
  });

  if (pageTabs) {
    pageTabs.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-page]");
      if (!btn) return;
      activePage = btn.dataset.page;
      renderPages();
    });
  }

  habitatTabs.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-h]");
    if (!btn) return;
    activeHabitat = btn.dataset.h;
    renderHabitatTabs();
    renderHabitat();
  });

  [q, loc, filt].forEach((el) =>
    el.addEventListener("input", () => {
      zonePage.clear();
      renderBestiary();
    }),
  );
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-zone][data-page]");
    if (!btn || btn.disabled) return;
    const zone = btn.dataset.zone;
    zonePage.set(zone, Number(btn.dataset.page));
    renderBestiary();
    document.querySelector(`[data-zone-section="${CSS.escape(zone)}"]`)?.scrollIntoView({ block: "start" });
  });

  renderBestiary();
  renderHabitatTabs();
  renderHabitat();
  renderSprites();
  renderPages();
  setupYuki();

  function setupYuki() {
    const yuki = window.LOD_YUKI;
    const grid = $("#yuki-grid");
    const q = $("#yuki-q");
    const loc = $("#yuki-loc");
    const filt = $("#yuki-filt");
    const count = $("#yuki-count");
    if (!yuki || !grid || !q || !loc || !filt || !count) return;
    const list = yuki.monsters || [];
    const zones = [...new Set(list.map((m) => m.zone))].sort((a, b) =>
      a.localeCompare(b, "ko"),
    );
    loc.innerHTML =
      `<option value="All">All / 전체</option>` +
      zones
        .map((z) => {
          const en = list.find((m) => m.zone === z)?.zone_en || z;
          return `<option value="${escapeAttr(z)}">${escapeHtml(`${en} / ${z}`)}</option>`;
        })
        .join("");
    const pageSize = 36;
    const zonePage = new Map();

    function yukiMatches(m) {
      if (loc.value !== "All" && m.zone !== loc.value) return false;
      if (filt.value === "drops" && !(m.drops && m.drops.length)) return false;
      if (filt.value === "image" && !m.image) return false;
      const query = (q.value || "").trim().toLowerCase();
      if (!query) return true;
      const blob = [
        m.name,
        m.spawn_id,
        m.zone,
        m.zone_en,
        m.hp,
        m.exp,
        m.sprite,
        ...(m.drops || []).map((d) => d.item),
        ...(m.maps || []).map((x) => x.map),
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(query);
    }

    function yukiCard(m) {
      const thumb = m.image
        ? `<img src="${escapeAttr(m.image)}" alt="${escapeAttr(m.name)}" loading="lazy" />`
        : `<span class="empty">no image<br>이미지 없음</span>`;
      const chips = [];
      if (m.hp) chips.push(`<span class="chip hp">HP ${escapeHtml(m.hp)}</span>`);
      if (m.exp) chips.push(`<span class="chip exp">EXP ${escapeHtml(m.exp)}</span>`);
      if (m.ac) chips.push(`<span class="chip">AC ${escapeHtml(m.ac)}</span>`);
      if (m.atk_min || m.atk_max) chips.push(`<span class="chip">ATK ${escapeHtml(m.atk_min || "?")}–${escapeHtml(m.atk_max || "?")}</span>`);
      if (m.gold) chips.push(`<span class="chip">Gold ${escapeHtml(m.gold)}${m.gold_rate ? ` (${escapeHtml(m.gold_rate)}%)` : ""}</span>`);
      if (m.sprite) chips.push(`<span class="chip">Sprite ${escapeHtml(m.sprite)}</span>`);
      const lines = [];
      if (m.drops?.length) {
        lines.push(`<div class="extra"><span>Drops · 드롭</span>${escapeHtml(m.drops.map((d) => `${d.item} ${d.rate}%`).join(" · "))}</div>`);
      }
      if (m.maps?.length) {
        lines.push(`<div class="extra"><span>Maps · 맵</span>${escapeHtml(m.maps.map((x) => `${x.map} ×${x.count}`).join(" · "))}</div>`);
      }
      return `<article class="card">
        <div class="thumb">${thumb}</div>
        <div>
          <h3>${escapeHtml(m.name)} <span class="ko">${escapeHtml(m.spawn_id)}</span></h3>
          <div class="meta">${escapeHtml(m.zone_en)} / ${escapeHtml(m.zone)} · Yuki</div>
          <div class="chips">${chips.join("")}</div>
          ${lines.join("")}
        </div>
      </article>`;
    }

    function render() {
      const shown = list.filter(yukiMatches);
      count.textContent = `${shown.length} shown / ${shown.length}마리`;
      const groups = new Map();
      for (const m of shown) {
        if (!groups.has(m.zone)) groups.set(m.zone, []);
        groups.get(m.zone).push(m);
      }
      const keys = [...groups.keys()].sort((a, b) => a.localeCompare(b, "ko"));
      grid.innerHTML = keys
        .map((zone) => {
          const rows = groups.get(zone);
          const pages = Math.max(1, Math.ceil(rows.length / pageSize));
          const page = Math.min(zonePage.get(zone) || 0, pages - 1);
          zonePage.set(zone, page);
          const slice = rows.slice(page * pageSize, (page + 1) * pageSize);
          const sample = rows[0];
          const pager =
            pages > 1
              ? `<div class="pager">
                  <button type="button" data-yuki-zone="${escapeAttr(zone)}" data-page="${page - 1}" ${page === 0 ? "disabled" : ""}>Prev · 이전</button>
                  <span>${page + 1} / ${pages}</span>
                  <button type="button" data-yuki-zone="${escapeAttr(zone)}" data-page="${page + 1}" ${page === pages - 1 ? "disabled" : ""}>Next · 다음</button>
                </div>`
              : "";
          return `<section class="zone" data-yuki-section="${escapeAttr(zone)}">
            <h2>${escapeHtml(sample.zone_en)} / ${escapeHtml(zone)} <span>${rows.length}</span></h2>
            <div class="grid">${slice.map(yukiCard).join("")}</div>
            ${pager}
          </section>`;
        })
        .join("");
    }

    [q, loc, filt].forEach((el) =>
      el.addEventListener("input", () => {
        zonePage.clear();
        render();
      }),
    );
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-yuki-zone][data-page]");
      if (!btn || btn.disabled) return;
      const zone = btn.dataset.yukiZone;
      zonePage.set(zone, Number(btn.dataset.page));
      render();
      document.querySelector(`[data-yuki-section="${CSS.escape(zone)}"]`)?.scrollIntoView({ block: "start" });
    });
    render();
  }
})();
