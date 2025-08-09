const GAMES = [
  { id: 'tic-tac-toe', name: '井字棋', desc: '经典双人对战', emoji: '❌⭕', url: 'games/tic-tac-toe/' },
  { id: 'snake', name: '贪吃蛇', desc: '滑动控制小蛇', emoji: '🐍', url: 'games/snake/' },
  { id: 'memory', name: '翻牌记忆', desc: '配对相同图案', emoji: '🧠', url: 'games/memory/' },
  { id: '2048', name: '2048', desc: '合并到 2048', emoji: '🔢', url: 'games/2048/' },
];

function createCard(game) {
  const a = document.createElement('a');
  a.href = game.url;
  a.className = 'card';
  a.setAttribute('aria-label', game.name);
  a.innerHTML = `
    <div class="emoji">${game.emoji}</div>
    <h3>${game.name}</h3>
    <p>${game.desc}</p>
    <span class="pill">立即开始</span>
  `;
  return a;
}

function renderList(filter = '') {
  const grid = document.getElementById('gameGrid');
  grid.innerHTML = '';
  const q = filter.trim().toLowerCase();
  const items = GAMES.filter(g => [g.name, g.desc, g.id].join(' ').toLowerCase().includes(q));
  if (items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'card';
    empty.innerHTML = '<h3>没有找到结果</h3><p>换个关键词试试：贪吃蛇 / 2048 / 井字棋 / 翻牌</p>';
    grid.appendChild(empty);
    return;
  }
  for (const g of items) grid.appendChild(createCard(g));
}

function initSearch() {
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearch');
  input.addEventListener('input', () => renderList(input.value));
  clearBtn.addEventListener('click', () => { input.value = ''; renderList(''); input.focus(); });
}

(function main() {
  document.getElementById('year').textContent = new Date().getFullYear();
  initSearch();
  renderList('');
})();