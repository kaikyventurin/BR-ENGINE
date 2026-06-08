/* =============================================
   BR ENGINE — main.js
   Particles · Dark Mode · Scroll · Cursor
   Counter · Ripple · Toast · Typewriter
   ============================================= */

/* ── 1. Loading Overlay ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.classList.add('hidden');
  }, 1300);
});

/* ── 2. Dark / Light Mode ── */
(function initTheme() {
  const saved = localStorage.getItem('bre-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateToggleIcon(saved);
})();

function updateToggleIcon(theme) {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  btn.title = theme === 'dark' ? 'Modo Claro' : 'Modo Escuro';
}

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('bre-theme', next);
      updateToggleIcon(next);
    });
  }

  /* ── 3. Navbar scroll effect ── */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
    revealElements();
  }, { passive: true });

  /* ── 4. Active nav link on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href]');

  function setActiveLink() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(a => {
      const href = a.getAttribute('href');
      a.classList.toggle('active', href && (href === '#' + current || href.includes(current)));
    });
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });

  /* ── 5. Scroll reveal ── */
  function revealElements() {
    document.querySelectorAll('.reveal').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        el.classList.add('visible');
      }
    });
  }
  revealElements(); // run on load

  /* ── 6. Custom cursor glow ── */
  const cursor = document.createElement('div');
  cursor.className = 'cursor-glow';
  document.body.appendChild(cursor);
  let mx = 0, my = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  document.querySelectorAll('a, button, .feature-card, .portfolio-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '40px';
      cursor.style.height = '40px';
      cursor.style.background = 'rgba(124,58,237,.4)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      cursor.style.background = 'rgba(0,229,255,.35)';
    });
  });

  /* ── 7. Counter animation ── */
  function animateCounter(el, target, duration = 2000) {
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('.stat-number[data-target]');
  let countersStarted = false;
  function checkCounters() {
    if (countersStarted) return;
    counters.forEach(c => {
      const rect = c.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        countersStarted = true;
        counters.forEach(counter => {
          const target = parseInt(counter.dataset.target);
          animateCounter(counter, target);
        });
      }
    });
  }
  window.addEventListener('scroll', checkCounters, { passive: true });
  checkCounters();

  /* ── 8. Typewriter for hero subtitle ── */
  const typer = document.getElementById('typewriter');
  if (typer) {
    const phrases = [
      'Desenvolvendo soluções digitais modernas.',
      'Tecnologia que transforma negócios.',
      'Inovação, eficiência e qualidade.',
    ];
    let pi = 0, ci = 0, deleting = false;
    function type() {
      const phrase = phrases[pi];
      if (deleting) {
        typer.textContent = phrase.slice(0, --ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(type, 500); return; }
        setTimeout(type, 40);
      } else {
        typer.textContent = phrase.slice(0, ++ci);
        if (ci === phrase.length) { deleting = true; setTimeout(type, 1800); return; }
        setTimeout(type, 65);
      }
    }
    setTimeout(type, 1500);
  }

  /* ── 9. Button ripple ── */
  document.querySelectorAll('.btn-submit, .btn-primary-glow').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  /* ── 10. Contact form submit ── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      showToast('✅ Mensagem enviada com sucesso!');
      form.reset();
    });
  }

  /* ── 11. Search bar ── */
  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', e => {
      e.preventDefault();
      const q = document.getElementById('searchInput').value.trim();
      if (q) showToast(`🔍 Buscando por: "${q}"`);
    });
  }

  /* ── 12. Smooth scroll for nav links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ── 13. Table row highlight ── */
  document.querySelectorAll('.table-glow tbody tr').forEach(row => {
    row.addEventListener('mouseenter', () => {
      row.style.transition = 'transform .2s';
      row.style.transform = 'scale(1.01)';
    });
    row.addEventListener('mouseleave', () => {
      row.style.transform = '';
    });
  });

}); // end DOMContentLoaded

/* ── Toast notification ── */
function showToast(msg) {
  let toast = document.querySelector('.toast-notif');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notif';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ── 14. Particle System ── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initP(); }, { passive: true });

  const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.8 + .4;
      this.vx = (Math.random() - .5) * .35;
      this.vy = (Math.random() - .5) * .35;
      this.alpha = Math.random() * .6 + .2;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * .015 + .005;
      // color: cyan or violet
      this.hue = Math.random() > .5 ? 185 : 265;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += this.pulseSpeed;
      const curAlpha = this.alpha * (.7 + .3 * Math.sin(this.pulse));
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      return curAlpha;
    }
    draw(alpha) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      const light = isDark() ? '70%' : '45%';
      ctx.fillStyle = `hsla(${this.hue}, 100%, ${light}, ${alpha})`;
      ctx.fill();
    }
  }

  function initP() {
    const count = Math.min(Math.floor(W * H / 8000), 140);
    particles = Array.from({ length: count }, () => new Particle());
  }
  initP();

  // Connect nearby particles with lines
  function drawConnections() {
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const op = (1 - dist / maxDist) * .2;
          const light = isDark() ? '70%' : '40%';
          ctx.beginPath();
          ctx.strokeStyle = `hsla(185, 100%, ${light}, ${op})`;
          ctx.lineWidth = .5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => {
      const a = p.update();
      p.draw(a);
    });
    requestAnimationFrame(loop);
  }
  loop();

  // Mouse repel effect
  let mx = -9999, my = -9999;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  setInterval(() => {
    particles.forEach(p => {
      const dx = p.x - mx, dy = p.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        p.vx += (dx / dist) * .08;
        p.vy += (dy / dist) * .08;
        // clamp speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.5) { p.vx /= speed; p.vy /= speed; }
      }
    });
  }, 16);
})();
