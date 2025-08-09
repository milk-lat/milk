(() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const tileSize = 16; // 每个像素 tile 大小
  const cols = 20;
  const rows = 20;
  canvas.width = cols * tileSize;
  canvas.height = rows * tileSize;
  ctx.imageSmoothingEnabled = false; // 关键：禁用抗锯齿，保持像素风

  // Game Boy 调色板
  const colors = {
    dark: '#0f380f',
    mid: '#306230',
    light: '#8bac0f',
    white: '#9bbc0f'
  };

  // HUD
  const scoreEl = document.getElementById('score');
  const levelEl = document.getElementById('level');
  const livesEl = document.getElementById('lives');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const muteBtn = document.getElementById('muteBtn');

  let running = false;
  let paused = false;
  let muted = false;

  const state = {
    player: { x: 10, y: 10, speed: 5 },
    items: [],
    score: 0,
    level: 1,
    lives: 3,
    spawnInterval: 1000,
    lastSpawn: 0,
    time: 0
  };

  const input = { up: false, down: false, left: false, right: false };
  document.addEventListener('keydown', e => {
    if(e.key === 'ArrowUp' || e.key === 'w') input.up = true;
    if(e.key === 'ArrowDown' || e.key === 's') input.down = true;
    if(e.key === 'ArrowLeft' || e.key === 'a') input.left = true;
    if(e.key === 'ArrowRight' || e.key === 'd') input.right = true;
    if(e.key === ' ') { paused = !paused; }
  });
  document.addEventListener('keyup', e => {
    if(e.key === 'ArrowUp' || e.key === 'w') input.up = false;
    if(e.key === 'ArrowDown' || e.key === 's') input.down = false;
    if(e.key === 'ArrowLeft' || e.key === 'a') input.left = false;
    if(e.key === 'ArrowRight' || e.key === 'd') input.right = false;
  });

  function spawnItem() {
    const kind = Math.random() < 0.6 ? 'good' : 'bad';
    const x = Math.floor(Math.random() * cols);
    const y = Math.floor(Math.random() * rows);
    state.items.push({ x, y, kind });
  }

  function beep(freq, dur) {
    if(muted) return;
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.frequency.value = freq;
      osc.type = 'square';
      gain.gain.value = 0.05;
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start();
      setTimeout(() => { osc.stop(); ac.close(); }, dur);
    } catch(e){}
  }

  function resetGame() {
    state.player.x = 10;
    state.player.y = 10;
    state.items = [];
    state.score = 0;
    state.level = 1;
    state.lives = 3;
    state.spawnInterval = 1000;
    updateHud();
  }

  function updateHud() {
    scoreEl.textContent = `分数: ${state.score}`;
    levelEl.textContent = `难度: ${state.level}`;
    livesEl.textContent = `生命: ${state.lives}`;
  }

  function update(dt) {
    state.time += dt * 1000;
    if(state.time - state.lastSpawn > state.spawnInterval) {
      spawnItem();
      state.lastSpawn = state.time;
    }

    if(input.up) state.player.y -= state.player.speed * dt;
    if(input.down) state.player.y += state.player.speed * dt;
    if(input.left) state.player.x -= state.player.speed * dt;
    if(input.right) state.player.x += state.player.speed * dt;

    // 保持在范围内
    state.player.x = Math.max(0, Math.min(cols-1, state.player.x));
    state.player.y = Math.max(0, Math.min(rows-1, state.player.y));

    // 检测碰撞
    for(let i=state.items.length-1; i>=0; i--) {
      const it = state.items[i];
      if(Math.floor(state.player.x) === it.x && Math.floor(state.player.y) === it.y) {
        state.items.splice(i,1);
        if(it.kind === 'good') {
          state.score++;
          beep(880, 60);
        } else {
          state.score = Math.max(0, state.score - 1);
          state.lives--;
          beep(220, 120);
        }
        if(state.score > 0 && state.score % 5 === 0) {
          state.level++;
          state.spawnInterval = Math.max(300, state.spawnInterval - 100);
        }
        updateHud();
      }
    }

    if(state.lives <= 0) {
      running = false;
      alert(`游戏结束！最终分数: ${state.score}`);
    }
  }

  function drawTile(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
  }

  function draw() {
    // 背景
    for(let y=0; y<rows; y++) {
      for(let x=0; x<cols; x++) {
        drawTile(x, y, colors.dark);
      }
    }

    // 道具
    state.items.forEach(it => {
      drawTile(it.x, it.y, it.kind === 'good' ? colors.light : '#aa0000');
    });

    // 玩家
    drawTile(Math.floor(state.player.x), Math.floor(state.player.y), colors.white);
  }

  let last = performance.now();
  function loop(now) {
    if(!running) return;
    const dt = (now - last) / 1000;
    last = now;
    if(!paused) {
      update(dt);
      draw();
    }
    requestAnimationFrame(loop);
  }

  startBtn.addEventListener('click', () => {
    resetGame();
    running = true;
    paused = false;
    last = performance.now();
    requestAnimationFrame(loop);
  });

  pauseBtn.addEventListener('click', () => { paused = !paused; });
  muteBtn.addEventListener('click', () => { muted = !muted; });

})();