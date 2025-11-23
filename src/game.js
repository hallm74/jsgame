import { generateHint } from './aiHints.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// --- Game State ---
const state = {
  running: true,
  score: 0,
  lives: 3,
  elapsed: 0,
  lastTime: performance.now(),
  difficulty: 1,
  player: { x: 400, y: 250, r: 16, speed: 220 },
  inputs: { up: false, down: false, left: false, right: false },
  pickups: [],
  hazards: [],
};

// --- Entity Generation ---
function spawnPickup() {
  state.pickups.push({
    x: Math.random() * (canvas.width - 24) + 12,
    y: Math.random() * (canvas.height - 24) + 12,
    r: 10,
    value: 1,
    hue: 120,
  });
}
function spawnHazard() {
  const speed = 40 + Math.random() * 50 + state.difficulty * 30;
  const angle = Math.random() * Math.PI * 2;
  state.hazards.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 14,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    hue: 0,
  });
}

for (let i = 0; i < 6; i++) spawnPickup();
for (let i = 0; i < 3; i++) spawnHazard();

// --- Input Handling ---
window.addEventListener('keydown', (e) => {
  switch (e.key.toLowerCase()) {
    case 'arrowup':
    case 'w': state.inputs.up = true; break;
    case 'arrowdown':
    case 's': state.inputs.down = true; break;
    case 'arrowleft':
    case 'a': state.inputs.left = true; break;
    case 'arrowright':
    case 'd': state.inputs.right = true; break;
    case 'p': state.running = !state.running; break;
    case 'h': showHint(); break;
  }
});
window.addEventListener('keyup', (e) => {
  switch (e.key.toLowerCase()) {
    case 'arrowup':
    case 'w': state.inputs.up = false; break;
    case 'arrowdown':
    case 's': state.inputs.down = false; break;
    case 'arrowleft':
    case 'a': state.inputs.left = false; break;
    case 'arrowright':
    case 'd': state.inputs.right = false; break;
  }
});

// --- Hint System ---
const hintBtn = document.getElementById('hint-btn');
const hintOutput = document.getElementById('hint-output');
hintBtn.addEventListener('click', showHint);
function showHint() {
  hintOutput.textContent = generateHint(state);
}

// --- Game Loop ---
function loop(ts) {
  const dt = (ts - state.lastTime) / 1000;
  state.lastTime = ts;
  if (state.running) {
    state.elapsed += dt;
    update(dt);
    draw();
  } else {
    drawPause();
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

function update(dt) {
  updateDifficulty();
  movePlayer(dt);
  moveHazards(dt);
  checkPickups();
  checkHazards();
  maybeSpawn(dt);
  updateHud();
}

function updateDifficulty() {
  state.difficulty = 1 + Math.floor(state.elapsed / 25);
}

function movePlayer(dt) {
  const p = state.player;
  let vx = 0, vy = 0;
  if (state.inputs.up) vy -= 1;
  if (state.inputs.down) vy += 1;
  if (state.inputs.left) vx -= 1;
  if (state.inputs.right) vx += 1;
  const mag = Math.hypot(vx, vy) || 1;
  vx /= mag; vy /= mag;
  p.x += vx * p.speed * dt;
  p.y += vy * p.speed * dt;
  p.x = Math.max(p.r, Math.min(canvas.width - p.r, p.x));
  p.y = Math.max(p.r, Math.min(canvas.height - p.r, p.y));
}

function moveHazards(dt) {
  for (const h of state.hazards) {
    h.x += h.vx * dt;
    h.y += h.vy * dt;
    if (h.x < -20) h.x = canvas.width + 20;
    if (h.x > canvas.width + 20) h.x = -20;
    if (h.y < -20) h.y = canvas.height + 20;
    if (h.y > canvas.height + 20) h.y = -20;
  }
}

function checkPickups() {
  const p = state.player;
  for (let i = state.pickups.length - 1; i >= 0; i--) {
    const c = state.pickups[i];
    if (circleHit(p, c)) {
      state.score += c.value;
      state.pickups.splice(i, 1);
      spawnPickup();
    }
  }
}

function checkHazards() {
  const p = state.player;
  for (const h of state.hazards) {
    if (circleHit(p, h)) {
      loseLife();
      break;
    }
  }
}

function loseLife() {
  state.lives--;
  state.player.x = canvas.width / 2;
  state.player.y = canvas.height / 2;
  if (state.lives <= 0) {
    state.running = false;
    hintOutput.textContent = 'Game Over! Press P to restart (refresh page).';
  }
}

function maybeSpawn(dt) {
  // Scale spawn likelihood with difficulty
  if (Math.random() < dt * 0.3 * state.difficulty) spawnHazard();
  if (Math.random() < dt * 0.2 && state.pickups.length < 10) spawnPickup();
}

function circleHit(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y) < a.r + b.r;
}

function updateHud() {
  document.getElementById('score').textContent = `Score: ${state.score}`;
  document.getElementById('lives').textContent = `Lives: ${state.lives}`;
  document.getElementById('time').textContent = `Time: ${Math.floor(state.elapsed)}s`;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Background grid
  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = '#30363d';
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Pickups
  for (const c of state.pickups) {
    ctx.fillStyle = `hsl(${c.hue},60%,50%)`;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Hazards
  for (const h of state.hazards) {
    ctx.fillStyle = `hsl(${h.hue},70%,50%)`;
    ctx.beginPath();
    ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Player
  const p = state.player;
  ctx.fillStyle = '#58a6ff';
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  ctx.fill();

  // Difficulty indicator
  ctx.font = '14px monospace';
  ctx.fillStyle = '#8b949e';
  ctx.fillText(`Difficulty: ${state.difficulty}`, 10, canvas.height - 10);
}

function drawPause() {
  draw();
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#c9d1d9';
  ctx.font = 'bold 36px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2 - 20);
  ctx.font = '16px system-ui';
  ctx.fillText('Press P to Resume', canvas.width / 2, canvas.height / 2 + 20);
}

// Potential extension hooks (great Copilot prompts):
// 1. addPowerUps()
// 2. applyParticleEffect(x, y, type)
// 3. scalePlayerSpeed(score)
// 4. saveHighScore(score)
// Ask Copilot to implement these and integrate them inside update().
