
'use strict';


const SUSHI_NAMES = [
  'Nigiri de Salmão', 'Nigiri de Atum', 'Uramaki', 'Hosomaki',
  'Temaki', 'Gunkan', 'Tamago', 'Ebi', 'Onigiri'
];

const SUSHI_INNER = [
  // 0 Nigiri Salmão — laranja salmão, tamanho médio
  `<rect x="7" y="33" width="50" height="22" rx="10" fill="#FBF6E9" stroke="#DCC79C" stroke-width="1.8"/>
   <rect x="9" y="11" width="46" height="26" rx="11" fill="#EE8E67" stroke="#D9713E" stroke-width="1.2"/>
   <path d="M14 20 Q32 15 50 20" stroke="#F9C6A8" stroke-width="2.4" fill="none" stroke-linecap="round"/>
   <path d="M14 28 Q32 23 50 28" stroke="#F9C6A8" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
  // 1 Nigiri Atum — vermelho-vinho escuro (alto contraste com o salmão)
  `<rect x="7" y="33" width="50" height="22" rx="10" fill="#FBF6E9" stroke="#DCC79C" stroke-width="1.8"/>
   <rect x="9" y="11" width="46" height="26" rx="11" fill="#96263A" stroke="#701A29" stroke-width="1.2"/>
   <path d="M14 20 Q32 15 50 20" stroke="#C96C7C" stroke-width="2.4" fill="none" stroke-linecap="round"/>
   <path d="M14 28 Q32 23 50 28" stroke="#C96C7C" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
  // 2 Uramaki — o maior da bandeja, centro colorido vívido
  `<circle cx="32" cy="32" r="28" fill="#FBF6E9" stroke="#DCC79C" stroke-width="1.8"/>
   <g fill="#3E362E" opacity="0.45">
     <circle cx="18" cy="14" r="1.7"/><circle cx="30" cy="8" r="1.7"/><circle cx="44" cy="13" r="1.7"/>
     <circle cx="9" cy="30" r="1.7"/><circle cx="55" cy="30" r="1.7"/>
     <circle cx="16" cy="49" r="1.7"/><circle cx="34" cy="55" r="1.7"/><circle cx="48" cy="47" r="1.7"/>
   </g>
   <circle cx="32" cy="32" r="14" fill="#2B2620"/>
   <circle cx="32" cy="32" r="10.5" fill="#F5EADB"/>
   <circle cx="27" cy="29.5" r="3.6" fill="#2E8E86"/>
   <circle cx="37.5" cy="35" r="3.6" fill="#E0A83C"/>`,
  // 3 Hosomaki — deliberadamente pequeno (rolinho fino), verde vívido
  `<circle cx="32" cy="32" r="14" fill="#2B2620"/>
   <circle cx="32" cy="32" r="10" fill="#FBF6E9"/>
   <circle cx="32" cy="32" r="4.6" fill="#4C8A47"/>`,
  // 4 Temaki — cone alto, o mais dominante em altura
  `<path d="M32 5 L58 58 Q32 48 6 58 Z" fill="#4A6640" stroke="#37492F" stroke-width="1"/>
   <path d="M32 12 L50 52 Q32 44 14 52 Z" fill="#FBF6E9"/>
   <circle cx="32" cy="23" r="6" fill="#EE8E67"/>
   <circle cx="23" cy="31" r="4" fill="#2E8E86"/>
   <circle cx="41" cy="31" r="4" fill="#E0A83C"/>`,
  // 5 Gunkan — faixa de nori + ovas laranja saturado
  `<rect x="13" y="26" width="38" height="25" rx="11" fill="#2B2620"/>
   <rect x="16.5" y="29.5" width="31" height="18" rx="8.5" fill="#FBF6E9"/>
   <g fill="#D97A16">
     <circle cx="22" cy="24" r="3.4"/><circle cx="30" cy="18" r="3.4"/><circle cx="38" cy="19" r="3.4"/>
     <circle cx="45" cy="25" r="3.4"/><circle cx="32" cy="27" r="3.4"/>
   </g>`,
  // 6 Tamago — retângulo amarelo vivo, tamanho médio-pequeno
  `<rect x="9" y="36" width="46" height="18" rx="8" fill="#FBF6E9" stroke="#DCC79C" stroke-width="1.8"/>
   <rect x="13" y="15" width="38" height="21" rx="6" fill="#F2C43E" stroke="#D8A61E" stroke-width="1.2"/>
   <rect x="13" y="24" width="38" height="4.5" fill="#2B2620" opacity="0.85"/>`,
  // 7 Ebi — camarão rosa-coral grande e curvo
  `<rect x="7" y="38" width="50" height="16" rx="8" fill="#FBF6E9" stroke="#DCC79C" stroke-width="1.8"/>
   <path d="M10 36 Q19 5 34 12 Q52 19 54 36 Q34 27 10 36 Z" fill="#E2688A" stroke="#C94F71" stroke-width="1"/>
   <path d="M17 29 Q30 20 45 27" stroke="#F3AFC0" stroke-width="2.4" fill="none" stroke-linecap="round"/>
   <path d="M15 33.5 Q30 25 48 32.5" stroke="#F3AFC0" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
  // 8 Onigiri — triângulo grande e dominante, faixa de nori larga
  `<path d="M32 4 L59 56 L5 56 Z" fill="#FBF6E9" stroke="#DCC79C" stroke-width="1.8"/>
   <path d="M9 56 L55 56 L55 42 L9 42 Z" fill="#2B2620"/>`
];

function sushiSVG(typeIndex, extraClass) {
  return `<svg viewBox="0 0 64 64" class="${extraClass || ''}" aria-hidden="true">${SUSHI_INNER[typeIndex]}</svg>`;
}

/* ---------------------------------------------------------
   2. GERADOR / SOLVER DE SUDOKU
   --------------------------------------------------------- */
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle(arr, rng) {
  rng = rng || Math.random;
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateFullGrid(rng) {
  const g = new Array(81).fill(0);
  const rows = new Array(9).fill(0), cols = new Array(9).fill(0), boxes = new Array(9).fill(0);
  function backtrack(pos) {
    if (pos === 81) return true;
    const r = (pos / 9) | 0, c = pos % 9, b = ((r / 3) | 0) * 3 + ((c / 3) | 0);
    const used = rows[r] | cols[c] | boxes[b];
    const candidates = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rng);
    for (const v of candidates) {
      const bit = 1 << (v - 1);
      if (used & bit) continue;
      rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit; g[pos] = v;
      if (backtrack(pos + 1)) return true;
      rows[r] &= ~bit; cols[c] &= ~bit; boxes[b] &= ~bit; g[pos] = 0;
    }
    return false;
  }
  backtrack(0);
  return g;
}

function countSolutions(grid, limit) {
  const g = grid.slice();
  const rows = new Array(9).fill(0), cols = new Array(9).fill(0), boxes = new Array(9).fill(0);
  const empties = [];
  for (let i = 0; i < 81; i++) {
    const r = (i / 9) | 0, c = i % 9, b = ((r / 3) | 0) * 3 + ((c / 3) | 0);
    if (g[i]) {
      const bit = 1 << (g[i] - 1);
      rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit;
    } else empties.push(i);
  }
  let count = 0;
  function backtrack(pos) {
    if (count >= limit) return;
    if (pos === empties.length) { count++; return; }
    const i = empties[pos];
    const r = (i / 9) | 0, c = i % 9, b = ((r / 3) | 0) * 3 + ((c / 3) | 0);
    const used = rows[r] | cols[c] | boxes[b];
    for (let v = 1; v <= 9; v++) {
      const bit = 1 << (v - 1);
      if (used & bit) continue;
      rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit; g[i] = v;
      backtrack(pos + 1);
      rows[r] &= ~bit; cols[c] &= ~bit; boxes[b] &= ~bit; g[i] = 0;
      if (count >= limit) return;
    }
  }
  backtrack(0);
  return count;
}

function generatePuzzle(clueTarget, rng) {
  const full = generateFullGrid(rng);
  const puzzle = full.slice();
  const order = shuffle([...Array(81).keys()], rng);
  let clues = 81;
  for (const i of order) {
    if (clues <= clueTarget) break;
    const backup = puzzle[i];
    puzzle[i] = 0;
    const cnt = countSolutions(puzzle, 2);
    if (cnt !== 1) puzzle[i] = backup; else clues--;
  }
  return { puzzle, solution: full, clues };
}

/* ---------------------------------------------------------
   3. CONFIGURAÇÃO DE DIFICULDADES E TEMAS
   --------------------------------------------------------- */
const DIFFICULTIES = [
  { key: 'iniciante', label: 'Iniciante', clues: 50, desc: 'bem tranquilo' },
  { key: 'facil', label: 'Fácil', clues: 42, desc: 'aquecendo' },
  { key: 'medio', label: 'Médio', clues: 36, desc: 'equilibrado' },
  { key: 'dificil', label: 'Difícil', clues: 30, desc: 'concentração' },
  { key: 'mestre', label: 'Mestre', clues: 26, desc: 'experientes' },
  { key: 'especialista', label: 'Especialista', clues: 22, desc: 'desafio máximo' },
];

const THEMES = [
  { key: 'sakura', name: 'Primavera (Sakura)', swatch: ['#F7F1E6', '#F3C9D0', '#A8B79A'],
    vars: { cream:'#F7F1E6', creamDeep:'#EFE5D3', paper:'#FFFDF8', sakura:'#F3C9D0', sakuraDeep:'#E7A7B4', sage:'#A8B79A', sageDeep:'#8A9E7B', wood:'#8B6F52', woodDeep:'#6F5640', ink:'#3E362E', warmGray:'#7A6F63', gold:'#C9A66B', line:'#E1D4BE' } },
  { key: 'outono', name: 'Outono Japonês', swatch: ['#F6E8D6', '#E3A15E', '#B98354'],
    vars: { cream:'#F6E8D6', creamDeep:'#EDD8BC', paper:'#FFF9F0', sakura:'#E3A15E', sakuraDeep:'#C97D3D', sage:'#B98354', sageDeep:'#96683F', wood:'#7A4B32', woodDeep:'#5E3822', ink:'#43301F', warmGray:'#8A6C50', gold:'#D98E3B', line:'#E3C79E' } },
  { key: 'zen', name: 'Jardim Zen', swatch: ['#EEF1E4', '#C7D6B8', '#7E9B6E'],
    vars: { cream:'#EEF1E4', creamDeep:'#DFE6CD', paper:'#FAFBF4', sakura:'#C7D6B8', sakuraDeep:'#A9BF95', sage:'#7E9B6E', sageDeep:'#647F55', wood:'#5B6B4F', woodDeep:'#455038', ink:'#333B2C', warmGray:'#6F7A63', gold:'#9CB37B', line:'#D3DEC3' } },
  { key: 'matsuri', name: 'Festival Matsuri', swatch: ['#FBE9DE', '#E86A5C', '#4F8C82'],
    vars: { cream:'#FBE9DE', creamDeep:'#F6D4BF', paper:'#FFF5EC', sakura:'#E86A5C', sakuraDeep:'#CC4E42', sage:'#4F8C82', sageDeep:'#3B6E65', wood:'#7A3B2E', woodDeep:'#5C2A20', ink:'#3D231C', warmGray:'#8C5C4C', gold:'#E8B14A', line:'#F0C3A8' } },
  { key: 'chuva', name: 'Chuva no Japão', swatch: ['#E4E8EA', '#A9C1CC', '#7A93A0'],
    vars: { cream:'#E4E8EA', creamDeep:'#D2D9DC', paper:'#F3F6F7', sakura:'#A9C1CC', sakuraDeep:'#87A6B3', sage:'#7A93A0', sageDeep:'#607A88', wood:'#4C5C63', woodDeep:'#37444A', ink:'#2E383C', warmGray:'#647178', gold:'#9CADAF', line:'#C4D0D4' } },
  { key: 'inverno', name: 'Inverno', swatch: ['#EEF3F5', '#D7E4EA', '#8FA9AE'],
    vars: { cream:'#EEF3F5', creamDeep:'#DCE7EB', paper:'#FBFDFE', sakura:'#D7E4EA', sakuraDeep:'#B7CCD6', sage:'#8FA9AE', sageDeep:'#72908F', wood:'#5E6E75', woodDeep:'#455055', ink:'#31383B', warmGray:'#6C7A7E', gold:'#B7C6C9', line:'#D3E1E5' } },
];
const VAR_MAP = { cream:'--cream', creamDeep:'--cream-deep', paper:'--paper', sakura:'--sakura', sakuraDeep:'--sakura-deep', sage:'--sage', sageDeep:'--sage-deep', wood:'--wood', woodDeep:'--wood-deep', ink:'--ink', warmGray:'--warm-gray', gold:'--gold', line:'--line' };

function applyTheme(themeKey) {
  const theme = THEMES.find(t => t.key === themeKey) || THEMES[0];
  for (const k in theme.vars) document.documentElement.style.setProperty(VAR_MAP[k], theme.vars[k]);
  state.settings.theme = themeKey;
}

/* ---------------------------------------------------------
   4. ESTADO DO JOGO
   --------------------------------------------------------- */
const state = {
  board: new Array(81).fill(0),
  given: new Array(81).fill(false),
  solution: new Array(81).fill(0),
  notes: Array.from({ length: 81 }, () => new Set()),
  selected: -1,
  selectedTray: 0,
  notesMode: false,
  hintsLeft: 3,
  seconds: 0,
  timerId: null,
  paused: false,
  history: [],
  future: [],
  difficulty: DIFFICULTIES[2],
  inProgress: false,
  isDaily: false,
  settings: { theme: 'sakura', reducedMotion: false, sound: false },
  session: { solved: 0, bestTime: null, played: 0 },
};

/* ---------------------------------------------------------
   5. DOM REFS
   --------------------------------------------------------- */
const $ = (sel) => document.querySelector(sel);
const screenAuth = $('#screen-auth');
const screenHome = $('#screen-home');
const screenGame = $('#screen-game');
const boardEl = $('#board');
const trayEl = $('#tray');
const legendGrid = $('#legendGrid');
const timerLabel = $('#timerLabel');
const difficultyLabel = $('#difficultyLabel');
const progressFill = $('#progressFill');
const progressCount = $('#progressCount');
const notesBadge = $('#notesBadge');
const hintCountEl = $('#hintCount');

let cellEls = [];

/* ---------------------------------------------------------
   6. INICIALIZAÇÃO DO TABULEIRO (DOM)
   --------------------------------------------------------- */
function buildBoardDOM() {
  boardEl.innerHTML = '';
  cellEls = [];
  for (let i = 0; i < 81; i++) {
    const r = (i / 9) | 0, c = i % 9;
    const div = document.createElement('div');
    div.className = 'cell';
    div.dataset.index = i;
    div.dataset.br = (c === 2 || c === 5) ? '1' : '0';
    div.dataset.bb = (r === 2 || r === 5) ? '1' : '0';
    div.addEventListener('click', () => onCellClick(i));
    boardEl.appendChild(div);
    cellEls.push(div);
  }
}

function buildTrayDOM() {
  trayEl.innerHTML = '';
  for (let v = 1; v <= 9; v++) {
    const btn = document.createElement('button');
    btn.className = 'tray-item';
    btn.dataset.value = v;
    btn.title = SUSHI_NAMES[v - 1];
    btn.innerHTML = sushiSVG(v - 1) + `<span class="tray-remaining">9</span>`;
    btn.addEventListener('click', () => onTrayClick(v));
    trayEl.appendChild(btn);
  }
}

function buildLegendDOM() {
  legendGrid.innerHTML = '';
  for (let v = 1; v <= 9; v++) {
    const div = document.createElement('div');
    div.className = 'legend-cell';
    div.title = SUSHI_NAMES[v - 1];
    div.innerHTML = sushiSVG(v - 1);
    legendGrid.appendChild(div);
  }
}

/* ---------------------------------------------------------
   7. HISTÓRICO (desfazer/refazer)
   --------------------------------------------------------- */
function snapshot() {
  return {
    board: state.board.slice(),
    notes: state.notes.map(s => new Set(s)),
    hintsLeft: state.hintsLeft,
  };
}
function restoreSnapshot(snap) {
  state.board = snap.board.slice();
  state.notes = snap.notes.map(s => new Set(s));
  state.hintsLeft = snap.hintsLeft;
}
function pushHistory() {
  state.history.push(snapshot());
  if (state.history.length > 200) state.history.shift();
  state.future = [];
}
function undo() {
  if (!state.history.length) return;
  state.future.push(snapshot());
  restoreSnapshot(state.history.pop());
  renderAll();
}
function redo() {
  if (!state.future.length) return;
  state.history.push(snapshot());
  restoreSnapshot(state.future.pop());
  renderAll();
}

/* ---------------------------------------------------------
   8. LÓGICA DE JOGO
   --------------------------------------------------------- */
function peersOf(index) {
  const r = (index / 9) | 0, c = index % 9, b = ((r / 3) | 0) * 3 + ((c / 3) | 0);
  const set = new Set();
  for (let k = 0; k < 9; k++) { set.add(r * 9 + k); set.add(k * 9 + c); }
  const br = (b / 3 | 0) * 3, bc = (b % 3) * 3;
  for (let rr = 0; rr < 3; rr++) for (let cc = 0; cc < 3; cc++) set.add((br + rr) * 9 + (bc + cc));
  set.delete(index);
  return set;
}

function placeValue(index, value) {
  if (state.given[index] || state.paused) return false;

  if (state.notesMode) {
    if (state.board[index] !== 0) return false;
    pushHistory();
    if (state.notes[index].has(value)) state.notes[index].delete(value);
    else state.notes[index].add(value);
    renderAll();
    return true;
  }

  if (state.board[index] === value) {
    // clicar na mesma peça já colocada remove ela
    pushHistory();
    state.board[index] = 0;
    renderAll();
    return true;
  }

  if (value !== state.solution[index]) {
    // peça errada: nunca é colocada no tabuleiro
    flashReject(index);
    return false;
  }

  pushHistory();
  state.board[index] = value;
  state.notes[index].clear();
  renderAll();
  checkWin();
  return true;
}

function flashReject(index) {
  const el = cellEls[index];
  if (!el) return;
  el.classList.remove('reject-flash'); void el.offsetWidth; el.classList.add('reject-flash');
}

function eraseCell(index) {
  if (index < 0 || state.given[index] || state.paused) return;
  pushHistory();
  state.board[index] = 0;
  state.notes[index].clear();
  renderAll();
}

function giveHint() {
  if (state.hintsLeft <= 0 || state.paused) return;
  let target = state.selected;
  if (target < 0 || state.given[target] || state.board[target] === state.solution[target]) {
    target = state.board.findIndex((v, i) => !state.given[i] && v !== state.solution[i]);
  }
  if (target < 0) return;
  pushHistory();
  state.board[target] = state.solution[target];
  state.notes[target].clear();
  state.hintsLeft--;
  state.selected = target;
  renderAll();
  const el = cellEls[target];
  el.classList.remove('hint-flash'); void el.offsetWidth; el.classList.add('hint-flash');
  checkWin();
}

function checkWin() {
  if (state.board.includes(0)) return;
  onWin();
}

/* ---------------------------------------------------------
   9. RENDER
   --------------------------------------------------------- */
function renderAll() {
  const peers = state.selected >= 0 ? peersOf(state.selected) : new Set();
  const selVal = state.selected >= 0 ? state.board[state.selected] : 0;
  let filled = 0;

  for (let i = 0; i < 81; i++) {
    const el = cellEls[i];
    const v = state.board[i];
    el.classList.toggle('given', state.given[i]);
    el.classList.toggle('selected', i === state.selected);
    el.classList.toggle('peer', peers.has(i) && i !== state.selected);
    el.classList.toggle('same-value', v !== 0 && selVal !== 0 && v === selVal && i !== state.selected);

    if (v !== 0) {
      filled++;
      if (el.dataset.rendered !== ('v' + v)) {
        el.innerHTML = sushiSVG(v - 1);
        el.dataset.rendered = 'v' + v;
      }
    } else if (state.notes[i].size > 0) {
      if (el.dataset.rendered !== 'n' + [...state.notes[i]].sort().join('')) {
        const grid = document.createElement('div');
        grid.className = 'cell-notes';
        for (let n = 1; n <= 9; n++) {
          const span = document.createElement('span');
          if (state.notes[i].has(n)) span.innerHTML = sushiSVG(n - 1);
          grid.appendChild(span);
        }
        el.innerHTML = '';
        el.appendChild(grid);
        el.dataset.rendered = 'n' + [...state.notes[i]].sort().join('');
      }
    } else {
      if (el.dataset.rendered !== 'empty') { el.innerHTML = ''; el.dataset.rendered = 'empty'; }
    }
  }

  progressFill.style.width = Math.round((filled / 81) * 100) + '%';
  progressCount.textContent = filled;

  hintCountEl.textContent = state.hintsLeft;
  $('#btnHint').disabled = state.hintsLeft <= 0;
  $('#btnUndo').disabled = state.history.length === 0;
  $('#btnRedo').disabled = state.future.length === 0;

  $('#btnNotes').classList.toggle('active', state.notesMode);
  notesBadge.hidden = !state.notesMode;

  renderTray();
  scheduleCloudSave();
}

function renderTray() {
  const counts = new Array(10).fill(0);
  for (const v of state.board) if (v) counts[v]++;
  trayEl.querySelectorAll('.tray-item').forEach(btn => {
    const v = Number(btn.dataset.value);
    const remaining = 9 - counts[v];
    btn.querySelector('.tray-remaining').textContent = remaining;
    btn.classList.toggle('depleted', remaining <= 0);
    btn.classList.toggle('selected', state.selectedTray === v);
  });
}

/* ---------------------------------------------------------
   10. INTERAÇÃO
   --------------------------------------------------------- */
function onCellClick(index) {
  if (state.paused) return;
  state.selected = index;
  if (state.selectedTray && !state.given[index]) {
    placeValue(index, state.selectedTray);
  }
  renderAll();
}
function onTrayClick(value) {
  if (state.paused) return;
  state.selectedTray = state.selectedTray === value ? 0 : value;
  renderAll();
}
document.addEventListener('keydown', (e) => {
  if (screenGame.hidden || state.paused) return;
  if (e.key >= '1' && e.key <= '9') {
    if (state.selected >= 0) placeValue(state.selected, Number(e.key));
  } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
    eraseCell(state.selected);
  } else if (e.key.startsWith('Arrow') && state.selected >= 0) {
    const r = (state.selected / 9) | 0, c = state.selected % 9;
    let nr = r, nc = c;
    if (e.key === 'ArrowUp') nr = Math.max(0, r - 1);
    if (e.key === 'ArrowDown') nr = Math.min(8, r + 1);
    if (e.key === 'ArrowLeft') nc = Math.max(0, c - 1);
    if (e.key === 'ArrowRight') nc = Math.min(8, c + 1);
    state.selected = nr * 9 + nc;
    renderAll();
    e.preventDefault();
  } else if (e.key.toLowerCase() === 'n') {
    toggleNotes();
  } else if (e.key.toLowerCase() === 'z' && (e.ctrlKey || e.metaKey)) {
    undo(); e.preventDefault();
  } else if (e.key.toLowerCase() === 'y' && (e.ctrlKey || e.metaKey)) {
    redo(); e.preventDefault();
  }
});

function toggleNotes() {
  state.notesMode = !state.notesMode;
  renderAll();
}

/* ---------------------------------------------------------
   11. TIMER
   --------------------------------------------------------- */
function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}
function startTimer() {
  stopTimer();
  state.timerId = setInterval(() => {
    if (!state.paused) { state.seconds++; timerLabel.textContent = formatTime(state.seconds); }
  }, 1000);
}
function stopTimer() { if (state.timerId) clearInterval(state.timerId); state.timerId = null; }

/* ---------------------------------------------------------
   12. FLUXO DE JOGO
   --------------------------------------------------------- */
function startNewGame(difficulty, seedRng, isDaily) {
  const rng = seedRng || Math.random;
  const { puzzle, solution } = generatePuzzle(difficulty.clues, rng);
  state.board = puzzle.slice();
  state.given = puzzle.map(v => v !== 0);
  state.solution = solution.slice();
  state.notes = Array.from({ length: 81 }, () => new Set());
  state.selected = -1;
  state.selectedTray = 0;
  state.notesMode = false;
  state.hintsLeft = 3;
  state.seconds = 0;
  state.history = [];
  state.future = [];
  state.difficulty = difficulty;
  state.paused = false;
  state.inProgress = true;
  state.isDaily = !!isDaily;
  state.session.played++;

  difficultyLabel.textContent = isDaily ? 'Desafio diário' : difficulty.label;
  timerLabel.textContent = '00:00';
  cellEls.forEach(el => { el.dataset.rendered = ''; });

  showScreen('game');
  hideAllOverlays();
  renderAll();
  startTimer();
  $('#btnContinue').hidden = false;

  if (cloud.enabled && cloud.getUser()) {
    cloud.saveStats(state.session);
    cloud.saveGame(serializeGameState());
  }
}

function pauseGame() {
  if (!state.inProgress) return;
  state.paused = true;
  $('#overlayPause').hidden = false;
  if (cloud.enabled && cloud.getUser()) cloud.saveGame(serializeGameState());
}
function resumeGame() {
  state.paused = false;
  $('#overlayPause').hidden = true;
}

function onWin() {
  stopTimer();
  state.inProgress = false;
  state.session.solved++;
  if (state.session.bestTime === null || state.seconds < state.session.bestTime) {
    state.session.bestTime = state.seconds;
  }
  $('#winTime').textContent = `Tempo: ${formatTime(state.seconds)}`;
  spawnCelebrationPetals();
  $('#overlayWin').hidden = false;

  if (cloud.enabled && cloud.getUser()) {
    cloud.clearGame();
    cloud.logCompletedGame(state.isDaily ? 'Desafio diário' : state.difficulty.label, state.seconds);
    cloud.saveStats(state.session);
  }
}

/* ---------------------------------------------------------
   13. TELAS E OVERLAYS
   --------------------------------------------------------- */
function showScreen(name) {
  screenAuth.hidden = name !== 'auth';
  screenHome.hidden = name !== 'home';
  screenGame.hidden = name !== 'game';
  $('#petalField').style.display = (name === 'game' || state.settings.reducedMotion) ? 'none' : '';
}
function hideAllOverlays() {
  document.querySelectorAll('.overlay').forEach(o => o.hidden = true);
}

const OVERLAY_CLOSE_HANDLERS = { overlayPause: resumeGame };
function closeOverlayById(id) {
  const handler = OVERLAY_CLOSE_HANDLERS[id];
  if (handler) handler();
  else { const el = document.getElementById(id); if (el) el.hidden = true; }
}
document.querySelectorAll('.overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeOverlayById(overlay.id); });
});
document.querySelectorAll('.overlay-close').forEach(btn => {
  btn.addEventListener('click', () => closeOverlayById(btn.dataset.close));
});

function goHome() {
  if (state.inProgress) {
    state.paused = true;
    if (cloud.enabled && cloud.getUser()) cloud.saveGame(serializeGameState());
  }
  showScreen('home');
}

/* ---- Home actions ---- */
document.querySelectorAll('.home-menu [data-action]').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    if (action === 'continue') { showScreen('game'); state.paused = false; hideAllOverlays(); renderAll(); startTimer(); }
    else if (action === 'new-game') openNewGameOverlay();
    else if (action === 'daily') startDailyChallenge();
    else if (action === 'stats') openStats();
    else if (action === 'themes') openThemes();
    else if (action === 'settings') openSettings();
  });
});
$('#btnHomeInfo').addEventListener('click', () => { $('#overlayInfo').hidden = false; });

/* ---- New game overlay ---- */
function openNewGameOverlay() {
  const grid = $('#difficultyGrid');
  grid.innerHTML = '';
  DIFFICULTIES.forEach(d => {
    const btn = document.createElement('button');
    btn.className = 'diff-btn';
    btn.innerHTML = `${d.label}<small>${d.desc}</small>`;
    btn.addEventListener('click', () => startNewGame(d));
    grid.appendChild(btn);
  });
  $('#overlayNewGame').hidden = false;
}

function startDailyChallenge() {
  const today = new Date();
  const seedStr = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
  let seed = 0; for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) | 0;
  const rng = mulberry32(seed);
  startNewGame(DIFFICULTIES[2], rng, true);
}

/* ---- Stats overlay ---- */
function openStats() {
  const grid = $('#statsGrid');
  const best = state.session.bestTime === null ? '—' : formatTime(state.session.bestTime);
  grid.innerHTML = `
    <div class="stat-box"><div class="stat-value">${state.session.played}</div><div class="stat-label">jogos iniciados</div></div>
    <div class="stat-box"><div class="stat-value">${state.session.solved}</div><div class="stat-label">concluídos</div></div>
    <div class="stat-box"><div class="stat-value">${best}</div><div class="stat-label">melhor tempo</div></div>
    <div class="stat-box"><div class="stat-value">${state.difficulty.label}</div><div class="stat-label">última dificuldade</div></div>
  `;
  $('#statsNote').textContent = (cloud.enabled && cloud.getUser())
    ? 'Estas estatísticas estão salvas na sua conta e continuam de onde pararam da próxima vez.'
    : 'As estatísticas desta versão são guardadas apenas durante esta sessão (você não está logado).';
  $('#overlayStats').hidden = false;
}

/* ---- Themes overlay ---- */
function openThemes() {
  const grid = $('#themeGrid');
  grid.innerHTML = '';
  THEMES.forEach(t => {
    const card = document.createElement('button');
    card.className = 'theme-card' + (state.settings.theme === t.key ? ' active' : '');
    card.innerHTML = `<div class="theme-swatch" style="background:linear-gradient(135deg, ${t.swatch[0]}, ${t.swatch[1]} 55%, ${t.swatch[2]})"></div><div class="theme-name">${t.name}</div>`;
    card.addEventListener('click', () => { applyTheme(t.key); openThemes(); });
    grid.appendChild(card);
  });
  $('#overlayThemes').hidden = false;
}

/* ---- Settings overlay ---- */
function applySoundSetting() {
  if (!bgMusic) return;
  if (state.settings.sound) {
    bgMusic.volume = 0.35;
    const p = bgMusic.play();
    if (p && p.catch) p.catch(() => {});
  } else {
    bgMusic.pause();
  }
  const btn = $('#btnSound');
  if (btn) btn.textContent = state.settings.sound ? '🔊' : '🔇';
}

$('#btnSound').addEventListener('click', () => {
  state.settings.sound = !state.settings.sound;
  applySoundSetting();
  $('#btnSound').textContent = state.settings.sound ? '🔊' : '🔇';
});

function openSettings() {
  const list = $('#settingsList');
  list.innerHTML = '';
  const rows = [
    { key: 'sound', label: 'Som ambiente' },
    { key: 'reducedMotion', label: 'Reduzir pétalas e animações' },
  ];
  rows.forEach(r => {
    const row = document.createElement('div');
    row.className = 'setting-row';
    row.innerHTML = `<span>${r.label}</span><span class="switch${state.settings[r.key] ? ' on' : ''}"></span>`;
    row.querySelector('.switch').addEventListener('click', () => {
      state.settings[r.key] = !state.settings[r.key];
      if (r.key === 'reducedMotion') $('#petalField').style.display = (state.settings.reducedMotion || !screenGame.hidden) ? 'none' : '';
      if (r.key === 'sound') applySoundSetting();
      openSettings();
    });
    list.appendChild(row);
  });
  $('#overlaySettings').hidden = false;
}

/* ---- Toolbar ---- */
$('#btnBack').addEventListener('click', goHome);
$('#btnPause').addEventListener('click', pauseGame);
$('#btnResume').addEventListener('click', resumeGame);
$('#btnUndo').addEventListener('click', undo);
$('#btnRedo').addEventListener('click', redo);
$('#btnErase').addEventListener('click', () => eraseCell(state.selected));
$('#btnNotes').addEventListener('click', toggleNotes);
$('#btnHint').addEventListener('click', giveHint);
$('#btnRestart').addEventListener('click', () => {
  pushHistory();
  state.board = state.board.map((v, i) => state.given[i] ? v : 0);
  state.notes = Array.from({ length: 81 }, () => new Set());
  state.hintsLeft = 3;
  cellEls.forEach(el => { el.dataset.rendered = ''; });
  renderAll();
});

/* ---- Win overlay ---- */
$('#btnWinNewGame').addEventListener('click', () => { $('#overlayWin').hidden = true; openNewGameOverlay(); });
$('#btnWinHome').addEventListener('click', () => { $('#overlayWin').hidden = true; goHome(); });

/* ---------------------------------------------------------
   14. PÉTALAS DE SAKURA (ambiente)
   --------------------------------------------------------- */
function spawnAmbientPetals() {
  const field = $('#petalField');
  const count = 16;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const left = Math.random() * 100;
    const duration = 9 + Math.random() * 9;
    const swayDuration = 3 + Math.random() * 2;
    const delay = Math.random() * 14;
    const size = 8 + Math.random() * 8;
    p.style.left = left + 'vw';
    p.style.width = size + 'px';
    p.style.height = size * 0.8 + 'px';
    p.style.animationDuration = `${duration}s, ${swayDuration}s`;
    p.style.animationDelay = `${delay}s, ${delay}s`;
    field.appendChild(p);
  }
}
function spawnCelebrationPetals() {
  const card = document.querySelector('#overlayWin .overlay-card');
  for (let i = 0; i < 24; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = '-10px';
    p.style.width = p.style.height = (6 + Math.random() * 8) + 'px';
    p.style.animationDuration = `${2 + Math.random() * 1.5}s, ${1.5 + Math.random()}s`;
    p.style.animationDelay = `${Math.random() * 0.6}s, 0s`;
    card.appendChild(p);
    setTimeout(() => p.remove(), 4000);
  }
}

/* ---------------------------------------------------------
   16. AUTENTICAÇÃO E SINCRONIZAÇÃO COM A NUVEM
   --------------------------------------------------------- */
function serializeGameState() {
  return {
    board: state.board,
    given: state.given,
    solution: state.solution,
    notes: state.notes.map(s => [...s]),
    hintsLeft: state.hintsLeft,
    seconds: state.seconds,
    difficultyKey: state.difficulty.key,
    isDaily: state.isDaily,
  };
}

function applySavedGameState(saved) {
  const diff = DIFFICULTIES.find(d => d.key === saved.difficultyKey) || DIFFICULTIES[2];
  state.board = saved.board.slice();
  state.given = saved.given.slice();
  state.solution = saved.solution.slice();
  state.notes = Array.from({ length: 81 }, (_, i) => new Set((saved.notes && saved.notes[i]) || []));
  state.selected = -1;
  state.selectedTray = 0;
  state.notesMode = false;
  state.hintsLeft = saved.hintsLeft ?? 3;
  state.seconds = saved.seconds || 0;
  state.history = [];
  state.future = [];
  state.difficulty = diff;
  state.paused = true;
  state.inProgress = true;
  state.isDaily = !!saved.isDaily;

  difficultyLabel.textContent = state.isDaily ? 'Desafio diário' : diff.label;
  timerLabel.textContent = formatTime(state.seconds);
  cellEls.forEach(el => { el.dataset.rendered = ''; });
}

let cloudSaveTimer = null;
function scheduleCloudSave() {
  if (!cloud.enabled || !cloud.getUser() || !state.inProgress) return;
  clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(() => { cloud.saveGame(serializeGameState()); }, 1200);
}

function showAuthMessage(text, isError) {
  const el = $('#authMessage');
  el.textContent = text;
  el.hidden = false;
  el.classList.toggle('auth-message--error', !!isError);
}

document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const isSignin = tab.dataset.tab === 'signin';
    $('#authPanelSignin').hidden = !isSignin;
    $('#authPanelSignup').hidden = isSignin;
    $('#authMessage').hidden = true;
  });
});

$('#btnSignIn').addEventListener('click', async () => {
  const email = $('#signinEmail').value.trim();
  const password = $('#signinPassword').value;
  if (!email || !password) { showAuthMessage('Preencha e-mail e senha.', true); return; }
  const btn = $('#btnSignIn'); btn.disabled = true; btn.textContent = 'Entrando…';
  const res = await cloud.signIn(email, password);
  btn.disabled = false; btn.textContent = 'Entrar';
  if (res.error) showAuthMessage(res.error, true);
});

$('#btnSignUp').addEventListener('click', async () => {
  const username = $('#signupUsername').value.trim();
  const email = $('#signupEmail').value.trim();
  const password = $('#signupPassword').value;
  if (!email || !password) { showAuthMessage('Preencha e-mail e senha.', true); return; }
  if (password.length < 6) { showAuthMessage('A senha precisa ter pelo menos 6 caracteres.', true); return; }
  const btn = $('#btnSignUp'); btn.disabled = true; btn.textContent = 'Criando…';
  const res = await cloud.signUp(email, password, username || undefined);
  btn.disabled = false; btn.textContent = 'Criar conta';
  if (res.error) { showAuthMessage(res.error, true); return; }
  if (res.needsEmailConfirmation) showAuthMessage('Conta criada! Confira seu e-mail para confirmar antes de entrar.', false);
});

$('#signinPassword').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') $('#btnSignIn').click();
});
$('#signupPassword').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') $('#btnSignUp').click();
});

$('#btnForgotPassword').addEventListener('click', async () => {
  const email = $('#signinEmail').value.trim();
  if (!email) { showAuthMessage('Digite seu e-mail no campo acima primeiro.', true); return; }
  const res = await cloud.resetPassword(email);
  showAuthMessage(res.error || 'Enviamos um link de redefinição para seu e-mail.', !!res.error);
});

$('#btnPlayLocally').addEventListener('click', () => { showScreen('home'); });

$('#btnSignOut').addEventListener('click', async () => {
  if (state.inProgress && cloud.enabled && cloud.getUser()) await cloud.saveGame(serializeGameState());
  await cloud.signOut();
});

async function handleAuthChange(user) {
  const badge = $('#accountBadge');
  if (user) {
    badge.hidden = false;
    $('#accountEmail').textContent = user.email;

    const stats = await cloud.loadStats();
    if (stats) state.session = { ...state.session, ...stats };

    const saved = await cloud.loadGame();
    if (saved) {
      applySavedGameState(saved);
      $('#btnContinue').hidden = false;
    }
    showScreen('home');
  } else {
    badge.hidden = true;
    showScreen('auth');
  }
}

/* ---------------------------------------------------------
   17. BOOT
   --------------------------------------------------------- */
async function init() {
  buildBoardDOM();
  buildTrayDOM();
  buildLegendDOM();
  spawnAmbientPetals();
  applyTheme('sakura');

  if (!cloud.enabled) {
    $('#authFormsWrap').hidden = true;
    $('#authConfigWarning').hidden = false;
  }
  cloud.onAuthChange(handleAuthChange);
  const user = await cloud.init();

  if (user) await handleAuthChange(user);
  else showScreen('auth');
}
document.addEventListener('DOMContentLoaded', init);
