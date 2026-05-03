/* ── Nav scroll effect ────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── Mobile menu ──────────────────────────────────────── */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('.nav__mobile-link').forEach(l =>
  l.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

/* ── Matrix rain canvas ────────────────────────────────── */
(function initMatrix() {
  const canvas = document.getElementById('matrixCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, cols, drops;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    cols = Math.floor(W / 18);
    drops = Array(cols).fill(1);
  }

  const chars = 'アイウエオカキクケコABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>{}[]|\\;:.,/?~`!@#$%^&*()-_+=';

  function draw() {
    ctx.fillStyle = 'rgba(5,8,17,0.06)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#63f0c4';
    ctx.font = '14px JetBrains Mono, monospace';
    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * 18, y * 18);
      if (y * 18 > H && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 55);
})();

/* ── Hero counter animation ────────────────────────────── */
function animateCounters(elements) {
  elements.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step = 16;
    const inc = target / (duration / step);
    let current = 0;
    const timer = setInterval(() => {
      current += inc;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current).toLocaleString('zh-CN');
    }, step);
  });
}

/* ── Terminal typewriter ────────────────────────────────── */
const termLines = [
  { id: 'tOut1', text: '  [*] Connecting to target 192.168.1.100...', delay: 600  },
  { id: 'tOut2', text: '  [*] Generating reverse_shell payload...', delay: 1100  },
  { id: 'tOut3', text: '  [*] Applying obfuscation layer (AES-256)...', delay: 1800 },
  { id: 'tOut4', text: '  [+] Payload generated: ./output/shell_x64.exe', delay: 2500 },
  { id: 'tOut5', text: '  [*] Listener started on 0.0.0.0:4444', delay: 3100 },
];

termLines.forEach(({ id, text, delay }) => {
  setTimeout(() => {
    const el = document.getElementById(id);
    if (!el) return;
    let i = 0;
    const cursor = document.getElementById('tCursor');
    const timer = setInterval(() => {
      el.textContent = text.slice(0, i + 1);
      i++;
      if (i >= text.length) clearInterval(timer);
    }, 22);
  }, delay);
});

/* ── Scroll reveal ─────────────────────────────────────── */
const revealEls = document.querySelectorAll(
  '.feature-card, .timeline__item, .changelog__item, .stats__card, .testimonial-card, .section__header, .chart-container'
);
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

/* ── Counter observer ──────────────────────────────────── */
const statsSection = document.getElementById('stats');
let countersRan = false;
const counterObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersRan) {
    countersRan = true;
    animateCounters(document.querySelectorAll('.counter, .hero__stat-num'));
  }
});
if (statsSection) counterObserver.observe(statsSection);

// Hero stats on load (after short delay)
setTimeout(() => {
  animateCounters(document.querySelectorAll('.hero__stat-num'));
}, 800);

/* ── Growth Chart ──────────────────────────────────────── */
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const chartData = {
  stars: {
    label: 'GitHub Stars',
    data:  [120, 240, 410, 600, 790, 1020, 1260, 1500, 1760, 2050, 2230, 2400],
    color: '#63f0c4',
  },
  downloads: {
    label: '月下载量',
    data:  [380, 710, 1200, 1850, 2400, 3100, 3800, 4500, 5200, 6100, 7300, 8800],
    color: '#7c6ff7',
  },
  contributors: {
    label: '贡献者',
    data:  [3, 7, 11, 18, 24, 30, 38, 45, 51, 57, 63, 67],
    color: '#f06363',
  },
};

let currentChart = null;

function buildChart(key) {
  const ctx = document.getElementById('growthChart').getContext('2d');
  const cfg = chartData[key];
  if (currentChart) currentChart.destroy();
  currentChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: cfg.label,
        data: cfg.data,
        borderColor: cfg.color,
        backgroundColor: cfg.color + '18',
        borderWidth: 2.5,
        pointBackgroundColor: cfg.color,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.45,
      }]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0d1117',
          borderColor: cfg.color + '55',
          borderWidth: 1,
          titleColor: '#f0f4ff',
          bodyColor: '#8892a4',
          padding: 12,
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,.05)', drawBorder: false },
          ticks: { color: '#5a6478', font: { family: 'JetBrains Mono' } }
        },
        y: {
          grid: { color: 'rgba(255,255,255,.05)', drawBorder: false },
          ticks: { color: '#5a6478', font: { family: 'JetBrains Mono' } }
        }
      }
    }
  });
}

buildChart('stars');

document.querySelectorAll('.chart-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('chart-tab--active'));
    tab.classList.add('chart-tab--active');
    buildChart(tab.dataset.chart);
  });
});
