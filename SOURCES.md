# Source links (name / HP / EXP)

Fields were **merged by Korean monster name** from separate archival sources.

## 1. Name / location / level / description — lod-mind (2003)

Fan site mirrored at `home.megapass.co.kr/~dungeons/lod/` via Wayback (EUC-KR). Use the Habitat tab for readable UTF-8. When the official list has the same monster, its level and description replace the lod-mind text.

## 2. HP and EXP — official Nexon monster list only

Darkstory.net numbers are **not used**.

## 3. Official Nexon monster list (where archived)

The dungeon pages (for example `http://lod.nexon.com/game_info/dungeon/dungeon9.asp`) framed `game_info/monster/list.asp?category=N`. Wayback still has these iframe documents:

| Category | Area | Pages saved |
|---|---|---|
| 1 | 우드랜드 | 1–2. Page 2 also lists 완두콩 and 브라운 맨티스 (stats marked ? ) and 녹색말벌 at HP 1200, EXP 4500. |
| 2 | 지하묘지 | 1 (later pages were not captured) |
| 4 | 포테의숲 | 1 |
| 8 | 죽음의마을 | 1 |

Columns are level, **HP (A)**, **EXP (B)**, description. For a monster on these pages, that level, description, HP, and EXP replace every other source. An official “?” is stored as blank. Spelling variants (엔트/앤트, 팜펫/팜팻, 트랜트/트렌트, 블루엘리멘탈/블루엔리멘탈, 브라운 팜펫/팜팻) were merged onto the lod-mind name.

Monsters outside those captured pages keep the lod-mind name, place, level, and description. Their HP and EXP are blank.

Dungeon shells `dungeon1.asp`–`dungeon9.asp` (Wayback 2020–2025) are saved under `sources/official-iframes/dungeons/`. Their area text is on the Habitat tab. A second Wayback pass (CDX through 2024) still has no monster-list capture for any category except 1, 2, 4, and 8, and no page 3. Monster tables for 서아벨 해안, 서뤼케시온 해안, 호러캐슬, 오피온 동굴, 노에스엔도르탑, 지하수로, the mine, and the other dungeon9 categories were **not** captured. No public Korean monster table with HP/EXP for those areas turned up outside the rejected Dark Ages, quick-dungeon, and darkstory sets.

Rejected sources:

| Candidate | Why rejected |
|---|---|
| Quick-dungeon tip board 7056 | Inflated HP/MP-bracket values |
| Dark Ages (EN) Library / private-server JSON | Different areas and balance from KR LoD (적룡굴, 죽음의마을, etc. missing or wrong) |
| Nageling / S-solo Sense tables | Different modern content |

Still seeking: **Korean LoD** Sense Monster dumps, official 2005 guidebook Chapter 5 scans, or **KR** private-server/emulator monster tables (not Dark Ages).

### KR private servers checked (no public monster-EXP dump yet)

| Lead | Notes |
|---|---|
| **Yuki** | Name suggested by user; no public index (Discord/homepage/GitHub pack) found under 유키/Yuki + 어둠의전설 |
| Legacy (`darklegacy.online` → often `darklegacy123.online`) | Claims 본섭 balance; **use `https://darklegacy.online/`** (not `/home` — 404). `darklegacy.co.kr` DNS dead. Discord via homepage 1:1 (public invites dead). |
| Legacy drop table | `https://darklegacy.online/drop/` — map→monster→items only; **no EXP/HP/AC** |
| Origin (`discord.gg/wVbQssd4XQ`, 오리진대피소) | Custom/season rates (자동사냥, 뉴비부스트); Discord-only; not classic EXP |
| Highway / Maya / Miles | Promo-board ads; Discord/blog installs; no Sense dumps |
| BOX / Black | Active KR free-server ads; Discord-gated; no published monster tables |
| 2017 gamezone “구축법” | Describes a KR pack `db/` with `experience` / `abilityexp` (player level curves), not per-monster EXP |

### Promo boards scanned for Sense / EXP dumps (ads only)

Boards: oraksil.cc, freebene.com, uami6.net, linfree.net, todaycp.com, gamezone.live.

| Find | Result |
|---|---|
| oraksil / freebene / linfree LoD posts | Server ads + Discord links only; no Sense tables |
| Origin Google Sheet (`1e-ca3yFbpX-…`) | Newbie guide / hunting tips / cash shop — not monster EXP |
| gamezone `어둠의전설 몬스터정보` ([306104](http://gamezone.live/board_vJGK77/306104)) | Pointer to official `game_info/dungeon/dungeon1.asp` (Wayback = no per-monster EXP) |
| gamezone `몬스터 뷰어` ([14024008](http://gamezone.live/board_RoFI68/14024008)) | `hades.dat` sprite/animation viewer only; download login-gated |
| gamezone howto “몬스터에 대해서” ([301823](http://gamezone.live/board_JggX25/301823)) | PS-dev board **403** without membership |
| Official Sense posts (Nageling / S-solo / tip 7056) | Modern or quick-dungeon — already rejected for classic habitat EXP |

### Korean archive pass for a classic Sense dump

Searched official board posts, Namu/DC/thewiki, Naver blogs, and Wayback CDX for a table that pairs classic habitat names (그림록, 데스나이트, 드라코, 에리얼, 크라켄, 적룡굴) with fixed HP and EXP. Nothing like that is public.

| Find | What it actually is |
|---|---|
| [7056](https://lod.nexon.com/board/1493172227/7056) (2019, from Naver cafe 성천직자의 어둠의전설) | Quick-dungeon brackets. Classic names appear (그림록 at 4서클 level 85) but EXP is “필경의 13%” or the same million-scale bracket as every other dungeon. Not habitat HP. |
| [7581](https://lod.nexon.com/Community/game/7581) (2023-12-12) | S-solo 15–20단. EXP 23.5M–56.6M and ability, not habitat HP. |
| [7822](https://lod.nexon.com/Community/game/7822) (2025-12-13) | Nageling tower Sense. EXP in the billions. |
| [1712](https://lod.nexon.com/community/game/1712) (2006 thief guide) | Sense shows name and EXP at low skill, then HP, attack element, and defense element (skill 91). No numeric dump. |
| [964](https://lod.nexon.com/board/1493172227/964) | 지하수로 defense-element order by circle (슬라임 수, 프로그 토, …). No HP or EXP. |
| [3449](https://lod.nexon.com/board/1493172227/3449) (2008-01-14) | Boss names only: 포테의정령, 해안의광폭자, 해안의폭군. |
| [4550](https://lod.nexon.com/board/1493172227/4550) / [4505](https://lod.nexon.com/board/1493172227/4505) (2009) | 구피 quest. Says 체력의오크 has more HP than 오크전사. No numbers. |
| Namu, DC wiki, thewiki, Naver “순수도적 육성” | How Sense works, or character HP. No per-monster table. |
| Wayback CDX for `list.asp` and Inven/cafe URLs | No extra official list categories, and no archived copy of the board posts above. |

Those posts were not imported. Blank HP/EXP stays blank.

No open GitHub/KR LoD emulator repo with compiled habitat monster EXP (적룡굴, 죽음의마을, etc.) has surfaced.

**Still best path for classic EXP:** in-game Sense on a 1×/본섭-balance KR server (e.g. Legacy), 2005 guidebook Ch.5 scans, or a leaked classic pack monster table (not player `experience` curves).

## 4. Sprites

darkstory.net `/Monster/*/*.gif` via Wayback CDX (54 GIFs). A monster is given an image only when that file is in `images/`.

Official `http://s.nx.com/.../mns*.gif` sprites were **not** captured by the Wayback Machine, and `s.nx.com` no longer resolves. Those images are skipped.

## 5. Unnamed client sprites

`SMonster` in Legend of Darkness names a sprite id. `hades.dat` `mns*.mpf` files and LoD R `monster000` / `monster001` sequences use the same id. An id that is not a clear `SMonster` sprite column is listed under **Unnamed**, with an idle GIF from `hades.dat` when that file exists. These rows have no habitat, HP, or EXP. Rows whose sprite column was missing or shifted stay out of the named-id set, so a few named monsters can also appear here until that row is repaired.

## 6. Client extras (not a drop table)

The LoD client does **not** store per-monster loot tables. HP/EXP/AC and drop rates live on the server.

What *is* in the client, and is now on matching Bestiary cards:

- Defense element from `SMonster` descriptions (`방어속성 <수/토>`)
- Promotion relics named in those descriptions (유물반지, 데스나이트의 투구, 데몬의턱뼈, 생명의 구슬, 드라코의눈)
- Item names in `ItemDesc` / `Transforms` that start with the monster name plus `의` or a body-part suffix (비늘, 머리, 꼬리, …), and the recipes that consume them
- Quest kill steps (`Quest*_KILLED*`) whose display name matches a monster

These are links in client text, not confirmed drop rates.

## 7. Original iframes

UTF-8 copies of the list documents live in `sources/official-iframes/` and are shown on the Official pages tab. The parent dungeon shells (`dungeon9.asp`, `dungeon1.asp`) are saved next to them. Broken `s.nx.com` images are removed when the archived page loads.
