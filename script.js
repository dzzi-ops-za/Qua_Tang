// ================== TUỲ CHỈNH Ở ĐÂY ==================
const CONFIG = {
  ten: 'Em yêu',
  loiChuc: 'Chúc em ngày 20/10 thật xinh đẹp, luôn rạng rỡ như những đoá hoa, '
         + 'mãi hạnh phúc và được yêu thương thật nhiều. 💐❤️',
  anh: ['anh/anh1.jpg', 'anh/anh2.jpg'],   // đặt ảnh vào thư mục anh/
  nhac: 'nhac/nhac.mp3'                    // đặt file nhạc vào thư mục nhac/
};
// =====================================================

const body = document.body;
// Điện thoại: giảm bớt hiệu ứng cho mượt
const isMobile = window.matchMedia('(max-width: 700px), (pointer: coarse)').matches;
const audio = document.getElementById('bgm');
const musicBtn = document.getElementById('musicBtn');
const photoInput = document.getElementById('photoInput');
const musicInput = document.getElementById('musicInput');

document.getElementById('introName').textContent = CONFIG.ten;

// ---------- Ảnh ----------
const photos = document.querySelectorAll('.photo');
let pickingIndex = 0;

photos.forEach((fig, i) => {
  const img = fig.querySelector('img');
  img.onload = () => fig.classList.add('has-img');
  img.onerror = () => fig.classList.remove('has-img');
  if (CONFIG.anh[i]) img.src = CONFIG.anh[i];

  fig.querySelector('.placeholder').addEventListener('click', () => {
    pickingIndex = i;
    photoInput.click();
  });
});

photoInput.addEventListener('change', () => {
  const file = photoInput.files[0];
  if (!file) return;
  photos[pickingIndex].querySelector('img').src = URL.createObjectURL(file);
  photoInput.value = '';
});

// ---------- Nhạc ----------
let musicMissing = false;
audio.src = CONFIG.nhac;
audio.addEventListener('error', () => { musicMissing = true; });

function updateMusicBtn() {
  musicBtn.classList.toggle('playing', !audio.paused);
  musicBtn.classList.toggle('muted', audio.paused);
}
audio.addEventListener('play', updateMusicBtn);
audio.addEventListener('pause', updateMusicBtn);

musicBtn.addEventListener('click', () => {
  if (musicMissing) { musicInput.click(); return; }
  audio.paused ? audio.play() : audio.pause();
});

musicInput.addEventListener('change', () => {
  const file = musicInput.files[0];
  if (!file) return;
  musicMissing = false;
  audio.src = URL.createObjectURL(file);
  audio.play();
});

// ---------- Mở quà ----------
document.getElementById('openBtn').addEventListener('click', () => {
  document.getElementById('intro').classList.add('hide');
  body.classList.add('open');
  audio.play().catch(() => {});
  updateMusicBtn();

  setInterval(spawnHeart, isMobile ? 600 : 350);
  setTimeout(typeMessage, 2200);
  for (let i = 0; i < 4; i++) setTimeout(launchRandom, i * 300);
  setInterval(launchRandom, isMobile ? 1300 : 900);
});

// ---------- Chữ chạy ----------
function typeMessage() {
  const el = document.getElementById('message');
  const text = CONFIG.loiChuc;
  let i = 0;
  const timer = setInterval(() => {
    el.textContent = Array.from(text).slice(0, ++i).join('');
    if (i >= Array.from(text).length) {
      clearInterval(timer);
      el.classList.add('done');
    }
  }, 60);
}

// ---------- Tim bay ----------
const heartsBox = document.getElementById('hearts');
const heartColors = ['#ff4d7e', '#ff8fb3', '#e91e63', '#ffffff', '#ff1744', '#f8bbd0'];

function spawnHeart() {
  if (document.hidden || heartsBox.childElementCount > 30) return;
  const h = document.createElement('span');
  h.className = 'heart';
  h.textContent = '♥';
  const size = (isMobile ? 10 : 12) + Math.random() * (isMobile ? 18 : 26);
  h.style.left = Math.random() * 100 + 'vw';
  h.style.fontSize = size + 'px';
  h.style.color = heartColors[Math.floor(Math.random() * heartColors.length)];
  h.style.setProperty('--sway', (Math.random() * 120 - 60) + 'px');
  h.style.animationDuration = (6 + Math.random() * 6) + 's';
  heartsBox.appendChild(h);
  h.addEventListener('animationend', () => h.remove());
}

function popHearts(x, y) {
  const n = isMobile ? 6 : 8;
  for (let i = 0; i < n; i++) {
    const h = document.createElement('span');
    h.className = 'pop-heart';
    h.textContent = '♥';
    const a = (Math.PI * 2 * i) / n;
    h.style.left = x + 'px';
    h.style.top = y + 'px';
    h.style.fontSize = (14 + Math.random() * 12) + 'px';
    h.style.setProperty('--dx', Math.cos(a) * 70 + 'px');
    h.style.setProperty('--dy', Math.sin(a) * 70 + 'px');
    document.body.appendChild(h);
    h.addEventListener('animationend', () => h.remove());
  }
}

// ---------- Pháo hoa ----------
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
let W, H;
const rockets = [];
const particles = [];

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resize);
resize();

const palette = [
  [255, 77, 126], [255, 215, 64], [124, 77, 255], [0, 229, 255],
  [255, 145, 0], [118, 255, 3], [255, 255, 255], [255, 64, 129]
];

function launch(tx, ty) {
  rockets.push({
    x: W * (0.2 + Math.random() * 0.6),
    y: H,
    tx, ty,
    speed: 9 + Math.random() * 3,
    color: palette[Math.floor(Math.random() * palette.length)],
    heart: Math.random() < 0.35
  });
}

function launchRandom() {
  if (document.hidden) return;
  launch(W * (0.1 + Math.random() * 0.8), H * (0.1 + Math.random() * 0.35));
}

function explode(x, y, color, heart) {
  const count = Math.round((heart ? 90 : 110) * (isMobile ? 0.6 : 1));
  for (let i = 0; i < count; i++) {
    let vx, vy;
    if (heart) {
      // Phương trình đường cong trái tim
      const t = (Math.PI * 2 * i) / count;
      vx = 16 * Math.pow(Math.sin(t), 3) * 0.32;
      vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.32;
    } else {
      const a = Math.random() * Math.PI * 2;
      const s = Math.random() * 6 + 1;
      vx = Math.cos(a) * s;
      vy = Math.sin(a) * s;
    }
    particles.push({
      x, y, vx, vy,
      life: 1,
      decay: 0.008 + Math.random() * 0.01,
      color: heart ? [255, 77 + Math.random() * 60, 126] : color,
      size: 1.5 + Math.random() * 1.5
    });
  }
}

function frame() {
  // Vệt mờ tạo đuôi sáng
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter';

  for (let i = rockets.length - 1; i >= 0; i--) {
    const r = rockets[i];
    const dx = r.tx - r.x, dy = r.ty - r.y;
    const dist = Math.hypot(dx, dy);
    if (dist < r.speed) {
      explode(r.tx, r.ty, r.color, r.heart);
      rockets.splice(i, 1);
      continue;
    }
    r.x += (dx / dist) * r.speed;
    r.y += (dy / dist) * r.speed;
    ctx.fillStyle = `rgb(${r.color})`;
    ctx.beginPath();
    ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.vx *= 0.98;
    p.vy = p.vy * 0.98 + 0.04;
    p.x += p.vx;
    p.y += p.vy;
    p.life -= p.decay;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${p.life})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(frame);
}
frame();

// Chạm/click vào màn hình để bắn pháo hoa + tim
canvas.addEventListener('pointerdown', (e) => {
  if (!body.classList.contains('open')) return;
  launch(e.clientX, e.clientY);
  popHearts(e.clientX, e.clientY);
});
