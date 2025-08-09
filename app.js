// ===== Utilities =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const lerp = (a, b, t) => a + (b - a) * t;
function seedRandom(seed) {
  let s = seed >>> 0;
  return function random() {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ===== Theme & background particles =====
(function initThemeAndBackground() {
  const root = document.documentElement;
  const toggle = $('#toggle-theme');
  toggle?.addEventListener('click', () => {
    root.classList.toggle('light');
  });

  const bg = $('#bg-canvas');
  const ctx = bg.getContext('2d');
  let particles = [], RAF;
  function resize() {
    bg.width = window.innerWidth * devicePixelRatio;
    bg.height = window.innerHeight * devicePixelRatio;
  }
  function spawnParticles(n = 120) {
    particles = new Array(n).fill(0).map(() => ({
      x: Math.random() * bg.width,
      y: Math.random() * bg.height,
      r: 0.6 + Math.random() * 1.6,
      t: Math.random() * Math.PI * 2,
      s: 0.2 + Math.random() * 0.6,
      c: `hsla(${200 + Math.random()*160}, 70%, 60%, 0.38)`
    }));
  }
  function loop() {
    ctx.clearRect(0, 0, bg.width, bg.height);
    for (const p of particles) {
      p.t += 0.005 * p.s;
      const dx = Math.cos(p.t) * 0.6 * p.s;
      const dy = Math.sin(p.t * 1.2) * 0.6 * p.s;
      p.x = (p.x + dx + bg.width) % bg.width;
      p.y = (p.y + dy + bg.height) % bg.height;
      ctx.beginPath();
      ctx.fillStyle = p.c;
      ctx.arc(p.x, p.y, p.r * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();
    }
    RAF = requestAnimationFrame(loop);
  }
  window.addEventListener('resize', () => { resize(); spawnParticles(); });
  resize(); spawnParticles(); loop();
})();

// ===== Math helpers =====
function matmul(A, B) {
  const n = A.length, m = A[0].length, p = B[0].length;
  const C = Array.from({length: n}, () => new Float32Array(p));
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < m; k++) {
      const aik = A[i][k];
      for (let j = 0; j < p; j++) C[i][j] += aik * B[k][j];
    }
  }
  return C;
}
function addBias(A, b) {
  const n = A.length, p = A[0].length; const C = Array.from({length: n}, () => new Float32Array(p));
  for (let i = 0; i < n; i++) for (let j = 0; j < p; j++) C[i][j] = A[i][j] + b[j];
  return C;
}
function applyActivation(A, kind) {
  const n = A.length, p = A[0].length; const C = Array.from({length: n}, () => new Float32Array(p));
  if (kind === 'relu') {
    for (let i = 0; i < n; i++) for (let j = 0; j < p; j++) C[i][j] = Math.max(0, A[i][j]);
  } else if (kind === 'tanh') {
    for (let i = 0; i < n; i++) for (let j = 0; j < p; j++) C[i][j] = Math.tanh(A[i][j]);
  } else { // sigmoid
    for (let i = 0; i < n; i++) for (let j = 0; j < p; j++) C[i][j] = 1 / (1 + Math.exp(-A[i][j]));
  }
  return C;
}
function softmaxRowWise(A) {
  const n = A.length, p = A[0].length; const C = Array.from({length: n}, () => new Float32Array(p));
  for (let i = 0; i < n; i++) {
    let maxv = -Infinity; for (let j=0;j<p;j++) if (A[i][j] > maxv) maxv = A[i][j];
    let sum = 0; for (let j=0;j<p;j++) sum += Math.exp(A[i][j]-maxv);
    for (let j=0;j<p;j++) C[i][j] = Math.exp(A[i][j]-maxv) / sum;
  }
  return C;
}
function oneHot(labels, numClasses) {
  const Y = Array.from({length: labels.length}, () => new Float32Array(numClasses));
  for (let i = 0; i < labels.length; i++) Y[i][labels[i]] = 1;
  return Y;
}
function transpose(A){ const n=A.length,m=A[0].length; const T = Array.from({length:m},()=>new Float32Array(n)); for(let i=0;i<n;i++) for(let j=0;j<m;j++) T[j][i]=A[i][j]; return T; }

// ===== Dataset generators =====
function makeMoons(n=400, noise=0.1, numClasses=2, rnd=Math.random) {
  const X = []; const y=[];
  for (let i=0;i<n;i++) {
    const t = Math.PI * rnd();
    const r = 1 + noise * (rnd()*2-1);
    const x = r*Math.cos(t);
    const yv = r*Math.sin(t);
    const flip = rnd() < 0.5 ? 1 : -1;
    const px = flip>0 ? x : x + 1.0;
    const py = flip>0 ? yv : -yv + 0.5;
    X.push(new Float32Array([px, py]));
    y.push(flip>0 ? 0 : 1);
  }
  if (numClasses===3) {
    // add a third class ring
    for (let i=0;i<n/3;i++) {
      const t = Math.PI * 2 * rnd();
      const r = 0.65 + 0.1 * (rnd()*2-1);
      const px = r*Math.cos(t)+0.5, py = r*Math.sin(t)+0.2;
      X.push(new Float32Array([px, py])); y.push(2);
    }
  }
  return {X, y};
}
function makeCircles(n=400, noise=0.05, numClasses=2, rnd=Math.random) {
  const X=[]; const y=[]; const rings = numClasses;
  for (let i=0;i<n;i++){
    const ring = i%rings; const t = 2*Math.PI*rnd();
    const baseR = 0.4 + ring*0.35;
    const r = baseR + noise*(rnd()*2-1);
    X.push(new Float32Array([r*Math.cos(t), r*Math.sin(t)]));
    y.push(ring);
  }
  return {X,y};
}
function makeSpiral(n=600, noise=0.1, numClasses=2, rnd=Math.random) {
  const X=[]; const y=[]; const arms = numClasses;
  for (let i=0;i<n;i++){
    const arm = i % arms; const t = (i/n) * 4*Math.PI + arm * (2*Math.PI/arms);
    const r = (i/n) + noise * (rnd()*2-1);
    const px = r*Math.cos(t); const py = r*Math.sin(t);
    X.push(new Float32Array([px, py])); y.push(arm);
  }
  return {X,y};
}
function makeGaussians(n=600, noise=0.08, numClasses=3, rnd=Math.random) {
  const centers = [
    [ -0.8, -0.6 ], [ 0.8, -0.5 ], [ 0.1, 0.7 ]
  ];
  const X=[]; const y=[];
  for (let i=0;i<n;i++){
    const c = i % numClasses; const [cx, cy] = centers[c % centers.length];
    const px = cx + noise * (rnd()*2-1);
    const py = cy + noise * (rnd()*2-1);
    X.push(new Float32Array([px, py])); y.push(c);
  }
  return {X,y};
}

// ===== MLP Model =====
function createMLP(inputDim, hiddenLayers, hiddenUnits, outputDim, activation='relu', l2=0) {
  const rng = seedRandom(1337);
  const layers = [];
  let prev = inputDim;
  for (let i=0;i<hiddenLayers;i++) {
    layers.push({
      W: Array.from({length: prev}, () => Float32Array.from({length: hiddenUnits}, () => (rng()*2-1) * Math.sqrt(2/prev))),
      b: Float32Array.from({length: hiddenUnits}, () => 0),
    });
    prev = hiddenUnits;
  }
  const out = {
    W: Array.from({length: prev}, () => Float32Array.from({length: outputDim}, () => (rng()*2-1) * Math.sqrt(2/prev))),
    b: Float32Array.from({length: outputDim}, () => 0)
  };
  return { layers, out, activation, l2 };
}

function forward(model, X) {
  let A = X; const caches = [];
  for (const L of model.layers) {
    const Z = addBias(matmul(A, L.W), L.b);
    const H = applyActivation(Z, model.activation);
    caches.push({A, Z});
    A = H;
  }
  const Zout = addBias(matmul(A, model.out.W), model.out.b);
  const Yhat = softmaxRowWise(Zout);
  caches.push({A, Z: Zout});
  return {Yhat, caches};
}

function computeLoss(Yhat, Ytrue, model) {
  let loss = 0; const n = Yhat.length, k = Yhat[0].length;
  for (let i=0;i<n;i++) for (let c=0;c<k;c++) if (Ytrue[i][c]===1) loss += -Math.log(Math.max(1e-8, Yhat[i][c]));
  loss /= n;
  if (model.l2>0) {
    let reg=0;
    for (const L of model.layers) for (const row of L.W) for (const w of row) reg += w*w;
    for (const row of model.out.W) for (const w of row) reg += w*w;
    loss += model.l2 * reg;
  }
  return loss;
}

function backward(model, caches, Yhat, Ytrue) {
  const grads = { layers: [], out: { dW: null, db: null } };
  const n = Yhat.length;
  let dZ = Array.from({length: n}, (_, i) => Float32Array.from(Yhat[i].map((v, j) => v - Ytrue[i][j])));
  const lastCache = caches[caches.length-1];
  const Aprev = lastCache.A;
  const dWout = matmul(transpose(Aprev), dZ);
  const dbOut = new Float32Array(dZ[0].length);
  for (let i=0;i<n;i++) for (let j=0;j<dbOut.length;j++) dbOut[j] += dZ[i][j];
  for (let j=0;j<dbOut.length;j++) dbOut[j] /= n;
  grads.out.dW = dWout.map(row => Float32Array.from(row.map(v => v / n + model.l2 * v)));
  grads.out.db = dbOut;

  let dAprev = matmul(dZ, transpose(model.out.W));
  for (let l=model.layers.length-1; l>=0; l--) {
    const {A, Z} = caches[l];
    let dAct = Array.from({length: Z.length}, () => new Float32Array(Z[0].length));
    if (model.activation==='relu') {
      for (let i=0;i<Z.length;i++) for (let j=0;j<Z[0].length;j++) dAct[i][j] = Z[i][j] > 0 ? 1 : 0;
    } else if (model.activation==='tanh') {
      for (let i=0;i<Z.length;i++) for (let j=0;j<Z[0].length;j++) { const t = Math.tanh(Z[i][j]); dAct[i][j] = 1 - t*t; }
    } else {
      for (let i=0;i<Z.length;i++) for (let j=0;j<Z[0].length;j++) { const s = 1/(1+Math.exp(-Z[i][j])); dAct[i][j] = s*(1-s); }
    }
    const dZl = Array.from({length: dAprev.length}, (_, i) => Float32Array.from(dAprev[i].map((v,j) => v * dAct[i][j])));
    const dW = matmul(transpose(A), dZl);
    const db = new Float32Array(dZl[0].length);
    for (let i=0;i<dZl.length;i++) for (let j=0;j<db.length;j++) db[j] += dZl[i][j];
    for (let j=0;j<db.length;j++) db[j] /= n;
    grads.layers[l] = { dW: dW.map(row => Float32Array.from(row.map(v => v / n + model.l2 * v))), db };
    dAprev = matmul(dZl, transpose(model.layers[l].W));
  }
  return grads;
}

function sgdUpdate(model, grads, lr) {
  for (let i=0;i<model.layers.length;i++) {
    const L = model.layers[i]; const g = grads.layers[i];
    for (let r=0;r<L.W.length;r++) for (let c=0;c<L.W[0].length;c++) L.W[r][c] -= lr * g.dW[r][c];
    for (let j=0;j<L.b.length;j++) L.b[j] -= lr * g.db[j];
  }
  const O = model.out; const go = grads.out;
  for (let r=0;r<O.W.length;r++) for (let c=0;c<O.W[0].length;c++) O.W[r][c] -= lr * go.dW[r][c];
  for (let j=0;j<O.b.length;j++) O.b[j] -= lr * go.db[j];
}

// ===== Rendering =====
function drawNetwork(ctx, model, inputDim, activationsSample) {
  const W = ctx.canvas.width, H = ctx.canvas.height;
  ctx.clearRect(0,0,W,H);
  const layers = [inputDim, ...model.layers.map(()=>model.layers[0].b.length), model.out.b.length];
  const cols = layers.length;
  const paddingX = 60, paddingY = 30;
  const availW = W - paddingX*2; const availH = H - paddingY*2;
  const colX = (i) => paddingX + (availW) * (i/(cols-1));
  const nodePositions = [];
  for (let c=0;c<cols;c++) {
    const nodes = layers[c];
    const stepY = availH / (nodes-1);
    const pos = [];
    for (let r=0;r<nodes;r++) pos.push([colX(c), paddingY + (nodes===1?availH/2:r*stepY)]);
    nodePositions.push(pos);
  }
  // edges
  ctx.lineWidth = 1.2 * devicePixelRatio;
  for (let c=0;c<cols-1;c++) {
    const from = nodePositions[c], to = nodePositions[c+1];
    const Wm = (c === cols-2) ? model.out.W : model.layers[c].W;
    for (let i=0;i<from.length;i++) for (let j=0;j<to.length;j++) {
      const w = Wm[i % Wm.length][j % Wm[0].length];
      const s = Math.max(0.15, Math.min(2.5, Math.abs(w)));
      ctx.strokeStyle = w>=0 ? 'rgba(110,168,254,0.55)' : 'rgba(255,122,182,0.55)';
      ctx.lineWidth = s * devicePixelRatio;
      ctx.beginPath(); ctx.moveTo(from[i][0], from[i][1]); ctx.lineTo(to[j][0], to[j][1]); ctx.stroke();
    }
  }
  // nodes
  for (let c=0;c<cols;c++) {
    for (let r=0;r<nodePositions[c].length;r++) {
      const [x,y] = nodePositions[c][r];
      const act = activationsSample?.[c]?.[r] ?? 0.5;
      const hue = lerp(320, 210, act);
      ctx.beginPath();
      ctx.fillStyle = `hsl(${hue} 80% 60% / 0.9)`;
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 2 * devicePixelRatio;
      ctx.arc(x, y, 9*devicePixelRatio, 0, Math.PI*2);
      ctx.fill(); ctx.stroke();
    }
  }
}

function drawData(ctx, X, y, model, numClasses) {
  const W = ctx.canvas.width, H = ctx.canvas.height; ctx.clearRect(0,0,W,H);
  // decision field
  const grid = 90; const cellW = W/grid, cellH = H/grid;
  for (let gy=0; gy<grid; gy++) for (let gx=0; gx<grid; gx++) {
    const px = (gx+0.5)/grid * 2 - 1; const py = (gy+0.5)/grid * 2 - 1;
    const {Yhat} = forward(model, [new Float32Array([px, py])]);
    let c=0, maxv=-Infinity; for (let i=0;i<numClasses;i++) if (Yhat[0][i]>maxv){maxv=Yhat[0][i]; c=i;}
    const alpha = clamp(maxv, 0.2, 0.95);
    let color = c===0? 'rgba(96,165,250,'+alpha+')' : c===1? 'rgba(244,114,182,'+alpha+')' : 'rgba(52,211,153,'+alpha+')';
    ctx.fillStyle = color; ctx.fillRect(gx*cellW, gy*cellH, cellW+1, cellH+1);
  }
  // points
  for (let i=0;i<X.length;i++){
    const px = (X[i][0]+1)/2 * W; const py = (X[i][1]+1)/2 * H;
    const c = y[i];
    ctx.beginPath();
    ctx.fillStyle = c===0? '#60a5fa' : c===1? '#f472b6' : '#34d399';
    ctx.arc(px, py, 3*devicePixelRatio, 0, Math.PI*2);
    ctx.fill();
  }
}

function drawCurve(ctx, values, color, smooth=true, maxPoints=400) {
  const W=ctx.canvas.width, H=ctx.canvas.height; ctx.clearRect(0,0,W,H);
  if (values.length<2) return;
  const data = values.slice(-maxPoints);
  const min = Math.min(...data), max = Math.max(...data);
  const norm = (v)=> (v-min)/(max-min+1e-8);
  ctx.lineWidth = 2*devicePixelRatio; ctx.strokeStyle = color; ctx.beginPath();
  for (let i=0;i<data.length;i++){
    const x = (i/(data.length-1))*W;
    const y = H - norm(data[i])*H;
    if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.stroke();
  // grid line
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1*devicePixelRatio; ctx.beginPath();
  for (let i=1;i<5;i++){ const y = (i/5)*H; ctx.moveTo(0,y); ctx.lineTo(W,y);} ctx.stroke();
}

// ===== Controller =====
const state = {
  layers: 2,
  neurons: 8,
  activation: 'relu',
  classes: 2,
  lr: 0.05,
  batch: 32,
  noise: 0.08,
  shuffle: true,
  reg: false,
  dataset: 'moons',
  samples: 400,
  running: false,
  step: 0,
  history: { loss: [], acc: [] },
};

const nnCanvas = document.getElementById('nn-canvas');
const dataCanvas = document.getElementById('data-canvas');
const lossCanvas = document.getElementById('loss-canvas');
const accCanvas = document.getElementById('acc-canvas');
const nnCtx = nnCanvas.getContext('2d');
const dataCtx = dataCanvas.getContext('2d');
const lossCtx = lossCanvas.getContext('2d');
const accCtx = accCanvas.getContext('2d');

function resizeCanvases() {
  for (const c of [nnCanvas, dataCanvas, lossCanvas, accCanvas]) {
    const rect = c.getBoundingClientRect();
    c.width = Math.max(600, Math.floor(rect.width * devicePixelRatio));
    c.height = Math.floor(rect.height * devicePixelRatio);
  }
}
window.addEventListener('resize', () => { resizeCanvases(); renderAll(); });
resizeCanvases();

let model = null, data = null, Ytrue = null;

function regenData() {
  const rnd = seedRandom(42);
  const n = state.samples; const noise = state.noise; const k = state.classes;
  if (state.dataset==='moons') data = makeMoons(n, noise, k, rnd);
  else if (state.dataset==='circles') data = makeCircles(n, noise, k, rnd);
  else if (state.dataset==='spiral') data = makeSpiral(n, noise, k, rnd);
  else data = makeGaussians(n, noise, k, rnd);
  Ytrue = oneHot(data.y, k);
}

function resetModel() {
  model = createMLP(2, state.layers, state.neurons, state.classes, state.activation, state.reg?1e-4:0);
  state.history.loss.length = 0; state.history.acc.length = 0; state.step = 0;
}

function accuracy(Yhat, y) {
  let correct=0; for (let i=0;i<Yhat.length;i++){ let m=-1,idx=-1; for(let j=0;j<Yhat[0].length;j++) if(Yhat[i][j]>m){m=Yhat[i][j];idx=j;} if (idx===y[i]) correct++; }
  return correct/Yhat.length;
}

function trainStep() {
  const n = data.X.length; const batch = state.batch;
  const idxs = Array.from({length: n}, (_,i)=>i);
  if (state.shuffle) idxs.sort(()=>Math.random()-0.5);
  for (let start=0; start<n; start+=batch) {
    const end = Math.min(n, start+batch);
    const Xb = idxs.slice(start,end).map(i=>data.X[i]);
    const Yb = idxs.slice(start,end).map(i=>Ytrue[i]);
    const {Yhat, caches} = forward(model, Xb);
    const grads = backward(model, caches, Yhat, Yb);
    sgdUpdate(model, grads, state.lr);
  }
  const {Yhat} = forward(model, data.X);
  const L = computeLoss(Yhat, Ytrue, model);
  const A = accuracy(Yhat, data.y);
  state.history.loss.push(L); state.history.acc.push(A);
  state.step++;
}

function sampleActivations() {
  // forward single probe to color nodes
  const probe = [new Float32Array([0.2*Math.sin(state.step*0.1), 0.2*Math.cos(state.step*0.1)])];
  const acts = [];
  let A = probe;
  acts.push([0,0]);
  for (const L of model.layers) {
    const Z = addBias(matmul(A, L.W), L.b);
    const H = applyActivation(Z, model.activation);
    acts.push(Array.from(H[0]));
    A = H;
  }
  acts.push(Array.from(addBias(matmul(A, model.out.W), model.out.b)[0]));
  return acts;
}

function renderAll() {
  drawNetwork(nnCtx, model, 2, sampleActivations());
  drawData(dataCtx, data.X, data.y, model, state.classes);
  const smooth = $('#smooth-curve').checked;
  drawCurve(lossCtx, state.history.loss, '#60a5fa', smooth);
  drawCurve(accCtx, state.history.acc, '#34d399', smooth);
}

function animate() {
  if (state.running) trainStep();
  renderAll();
  requestAnimationFrame(animate);
}

// ===== UI bindings =====
function val(id){ return document.getElementById(id).value; }
function bindRange(id, key, fmt=(v)=>v){
  const el = document.getElementById(id);
  const label = document.getElementById(id+'-val');
  el.addEventListener('input', () => { label.textContent = fmt(el.value); state[key] = Number(el.value); if (key==='classes') { regenData(); resetModel(); } if (['layers','neurons','activation'].includes(key)) resetModel(); renderAll(); });
}

bindRange('layers', 'layers');
bindRange('neurons', 'neurons');
$('#activation').addEventListener('change', (e)=>{ state.activation=e.target.value; resetModel(); });
bindRange('classes', 'classes');

bindRange('lr', 'lr', (v)=>Number(v).toFixed(3));
bindRange('batch', 'batch');
bindRange('noise', 'noise', (v)=>Number(v).toFixed(2));
$('#shuffle').addEventListener('change',(e)=> state.shuffle=e.target.checked);
$('#reg').addEventListener('change',(e)=> { state.reg=e.target.checked; resetModel(); });

$('#dataset').addEventListener('change', (e)=>{ state.dataset=e.target.value; regenData(); resetModel(); });
bindRange('samples','samples');
$('#regen').addEventListener('click', ()=>{ regenData(); resetModel(); });

$('#btn-play').addEventListener('click', ()=> state.running=true);
$('#btn-pause').addEventListener('click', ()=> state.running=false);
$('#btn-reset').addEventListener('click', ()=> { regenData(); resetModel(); renderAll(); });

$('#save-config').addEventListener('click', (e)=>{
  e.preventDefault();
  const cfg = JSON.stringify(state, null, 2);
  const blob = new Blob([cfg], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'config.json'; a.click(); URL.revokeObjectURL(a.href);
});
$('#load-config').addEventListener('click', async (e)=>{
  e.preventDefault();
  const inp = document.createElement('input'); inp.type='file'; inp.accept='.json,application/json';
  inp.onchange = async () => {
    const file = inp.files[0]; if (!file) return;
    const txt = await file.text(); const cfg = JSON.parse(txt);
    Object.assign(state, cfg);
    // sync UI
    ['layers','neurons','classes','lr','batch','noise','samples'].forEach(id=>{ const el=$('#'+id); if(el){ el.value=state[id]; const lab=$('#'+id+'-val'); if(lab) lab.textContent=(id==='lr'?Number(state[id]).toFixed(3):state[id]); }});
    $('#activation').value = state.activation; $('#dataset').value=state.dataset;
    $('#shuffle').checked = state.shuffle; $('#reg').checked = state.reg;
    regenData(); resetModel(); renderAll();
  };
  inp.click();
});

// init
regenData();
resetModel();
renderAll();
requestAnimationFrame(animate);