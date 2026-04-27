/* ============================================================
   TOCACHE TURISMO — JavaScript principal
   v3: hamburger, scroll header, FAQ accordion, form validación
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. CURSOR PERSONALIZADO ── */
  const cursor = document.getElementById('cursor');
  if (cursor && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX - 9 + 'px';
      cursor.style.top  = e.clientY - 9 + 'px';
    });
    document.querySelectorAll('a, button, input, select, textarea, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.style.transform = 'scale(2.5)');
      el.addEventListener('mouseleave', () => cursor.style.transform = 'scale(1)');
    });
  }

  /* ── 2. HEADER: fondo al hacer scroll ── */
  const headerEl = document.querySelector('header');
  if (headerEl) {
    const onScroll = () => {
      headerEl.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 3. HAMBURGER MENU ── */
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu   = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.toggle('open');
      navMenu.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Cierra el menú al hacer click en un enlace
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Cierra con tecla Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });
  }

  /* ── 4. SCROLL REVEAL ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 70);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── 5. FAQ ACCORDION ── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const answerId   = btn.getAttribute('aria-controls');
      const answer     = document.getElementById(answerId);
      if (!answer) return;

      // Cierra todos los demás
      document.querySelectorAll('.faq-question').forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const otherId = other.getAttribute('aria-controls');
          const otherAnswer = document.getElementById(otherId);
          if (otherAnswer) otherAnswer.classList.remove('open');
        }
      });

      // Alterna el actual
      btn.setAttribute('aria-expanded', String(!isExpanded));
      answer.classList.toggle('open', !isExpanded);
    });
  });

  /* ── 6. SELECT: placeholder color ── */
  const selects = document.querySelectorAll('select');
  selects.forEach(sel => {
    const update = () => sel.classList.toggle('placeholder', sel.value === '');
    update();
    sel.addEventListener('change', update);
  });

  /* ── 7. FORMULARIO DE CONTACTO ── */
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  if (form) {
    function validateField(input) {
      const group   = input.closest('.form-group');
      const errorEl = group?.querySelector('.form-error');
      let msg = '';

      if (input.required && !input.value.trim()) {
        msg = 'Este campo es obligatorio.';
      } else if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        msg = 'Ingresa un correo electrónico válido.';
      } else if (input.tagName === 'SELECT' && input.required && !input.value) {
        msg = 'Selecciona una opción.';
      }

      if (errorEl) errorEl.textContent = msg;
      input.classList.toggle('error', !!msg);
      return !msg;
    }

    // Validación blur + input
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) validateField(field);
      });
    });

    // Envío
    form.addEventListener('submit', e => {
      e.preventDefault();
      const fields = [...form.querySelectorAll('input[required], select[required]')];
      const allOk  = fields.map(f => validateField(f)).every(Boolean);
      if (!allOk) {
        const firstError = form.querySelector('.error');
        if (firstError) firstError.focus();
        return;
      }

      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      const btnText = submitBtn.querySelector('.btn-text');
      if (btnText) btnText.textContent = 'Enviando...';

      // Simula envío — reemplaza con fetch a tu backend, Formspree o EmailJS
      setTimeout(() => {
        form.style.display = 'none';
        if (success) success.hidden = false;
      }, 1400);
    });
  }

}); // DOMContentLoaded


/* ══════════════════════════════════════════
   SERPIENTE ANIMADA — Canvas background
   Selva amazónica de Tocache
══════════════════════════════════════════ */
function initSnake() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Crear canvas y añadirlo como primer hijo del body
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = [
    'position:fixed', 'top:0', 'left:0',
    'width:100%', 'height:100%',
    'pointer-events:none',
    'z-index:1',
    'opacity:0',
    'transition:opacity 3s ease'
  ].join(';');
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  // Fade-in suave
  setTimeout(() => { canvas.style.opacity = '1'; }, 800);

  /* ─── Parámetros de la serpiente ─── */
  const NUM_SEGS  = 120;   // número de segmentos del cuerpo
  const SEG_DIST  = 11;    // distancia entre segmentos (px)
  const MAX_WIDTH = 20;    // grosor máximo del cuerpo
  const SPEED     = 0.9;   // px por frame

  /* ─── Inicializar segmentos ─── */
  const segs = [];
  for (let i = 0; i < NUM_SEGS; i++) {
    segs.push({ x: W * 0.15 - i * SEG_DIST, y: H * 0.35 });
  }

  let angle    = 0.15;
  let time     = 0;
  let tongOut  = false;
  let tongTime = 0;
  const MARGIN = 100;

  /* ─── Grosor según posición en el cuerpo ─── */
  function segW(i) {
    const t = i / NUM_SEGS;
    if (t < 0.08) return MAX_WIDTH * (t / 0.08);         // cabeza: estrecha
    if (t > 0.75) return MAX_WIDTH * (1 - (t - 0.75) / 0.25); // cola: afina
    return MAX_WIDTH;
  }

  /* ─── Actualizar física ─── */
  function update() {
    time += 0.012;
    // Ondulación sinusoidal del ángulo
    angle += Math.sin(time * 1.6) * 0.022;

    // Evitar bordes: girar gradualmente
    const hd = segs[0];
    if (hd.x < MARGIN)       angle += 0.04;
    if (hd.x > W - MARGIN)   angle -= 0.04;
    if (hd.y < MARGIN)       angle += 0.04 * (angle < 0 ? -1 : 1);
    if (hd.y > H - MARGIN)   angle -= 0.04 * (angle < 0 ? -1 : 1);

    // Mover cabeza
    segs.unshift({ x: hd.x + Math.cos(angle) * SPEED, y: hd.y + Math.sin(angle) * SPEED });
    segs.pop();

    // Lengua
    tongTime++;
    if (tongTime > 90) { tongOut = !tongOut; tongTime = 0; }
  }

  /* ─── Dibujar cuerpo como ribbon suave ─── */
  function drawBody() {
    const left = [], right = [];

    for (let i = 0; i < segs.length; i++) {
      const s = segs[i];
      let dx, dy;
      if (i < segs.length - 1) {
        dx = segs[i + 1].x - s.x;
        dy = segs[i + 1].y - s.y;
      } else {
        dx = s.x - segs[i - 1].x;
        dy = s.y - segs[i - 1].y;
      }
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = -dy / len, ny = dx / len;
      const hw = segW(i) / 2;
      left.push({ x: s.x + nx * hw, y: s.y + ny * hw });
      right.push({ x: s.x - nx * hw, y: s.y - ny * hw });
    }

    /* ── Contorno exterior ── */
    ctx.save();
    ctx.beginPath();

    // Lado izquierdo
    ctx.moveTo(left[0].x, left[0].y);
    for (let i = 1; i < left.length - 1; i++) {
      const mx = (left[i].x + left[i + 1].x) / 2;
      const my = (left[i].y + left[i + 1].y) / 2;
      ctx.quadraticCurveTo(left[i].x, left[i].y, mx, my);
    }

    // Extremo de la cola
    const tail = segs[segs.length - 1];
    ctx.lineTo(tail.x, tail.y);

    // Lado derecho (invertido)
    for (let i = right.length - 2; i >= 0; i--) {
      const mx = (right[i].x + right[i + 1].x) / 2;
      const my = (right[i].y + right[i + 1].y) / 2;
      ctx.quadraticCurveTo(right[i + 1].x, right[i + 1].y, mx, my);
    }
    ctx.closePath();

    // Gradiente longitudinal: verde vivo → oscuro
    const grad = ctx.createLinearGradient(
      segs[0].x, segs[0].y,
      segs[NUM_SEGS - 1].x, segs[NUM_SEGS - 1].y
    );
    grad.addColorStop(0,   'rgba(52, 140, 80, 0.22)');
    grad.addColorStop(0.4, 'rgba(35, 100, 55, 0.16)');
    grad.addColorStop(1,   'rgba(13,  40, 24, 0.07)');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = 'rgba(10, 35, 18, 0.10)';
    ctx.lineWidth   = 0.8;
    ctx.stroke();
    ctx.restore();

    /* ── Línea del vientre (belly) ── */
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(segs[0].x, segs[0].y);
    for (let i = 1; i < segs.length - 1; i++) {
      const mx = (segs[i].x + segs[i + 1].x) / 2;
      const my = (segs[i].y + segs[i + 1].y) / 2;
      ctx.quadraticCurveTo(segs[i].x, segs[i].y, mx, my);
    }
    ctx.strokeStyle = 'rgba(100, 180, 120, 0.06)';
    ctx.lineWidth   = MAX_WIDTH * 0.3;
    ctx.lineCap     = 'round';
    ctx.stroke();
    ctx.restore();

    /* ── Marcas de escamas ── */
    ctx.save();
    for (let i = 5; i < segs.length - 3; i += 6) {
      const s    = segs[i];
      const next = segs[Math.min(i + 1, segs.length - 1)];
      const dx   = next.x - s.x, dy = next.y - s.y;
      const a    = Math.atan2(dy, dx);
      const hw   = segW(i) * 0.38;

      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(a + Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(-hw, 0);
      ctx.lineTo(hw, 0);
      ctx.strokeStyle = 'rgba(8, 28, 15, 0.09)';
      ctx.lineWidth   = 0.9;
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  /* ─── Dibujar cabeza ─── */
  function drawHead() {
    const hd   = segs[0];
    const hd2  = segs[1] || { x: hd.x - 1, y: hd.y };
    const a    = Math.atan2(hd.y - hd2.y, hd.x - hd2.x);

    ctx.save();
    ctx.translate(hd.x, hd.y);
    ctx.rotate(a);

    /* Forma de la cabeza (elipse alargada) */
    ctx.beginPath();
    ctx.ellipse(6, 0, 16, 11, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(45, 115, 65, 0.28)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(10, 35, 18, 0.15)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    /* Fosas nasales */
    ctx.beginPath();
    ctx.arc(18, -3, 1.2, 0, Math.PI * 2);
    ctx.arc(18,  3, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(5, 20, 10, 0.25)';
    ctx.fill();

    /* Ojos — iris dorado + pupila vertical */
    [[-7], [7]].forEach(([oy]) => {
      // Iris
      ctx.beginPath();
      ctx.arc(7, oy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200, 168, 75, 0.55)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(150, 110, 30, 0.4)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      // Pupila vertical (ojo de serpiente)
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(7, oy, 0.9, 2.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(5, 5, 5, 0.85)';
      ctx.fill();
      ctx.restore();
    });

    /* Lengua bífida */
    if (tongOut) {
      const flick = Math.sin(Date.now() * 0.03) * 1.5;
      ctx.save();
      ctx.strokeStyle = 'rgba(180, 45, 45, 0.65)';
      ctx.lineWidth = 1.4;
      ctx.lineCap = 'round';

      // Tallo
      ctx.beginPath();
      ctx.moveTo(19, 0);
      ctx.lineTo(25 + flick, 0);
      ctx.stroke();

      // Bifurcación superior
      ctx.beginPath();
      ctx.moveTo(25 + flick, 0);
      ctx.lineTo(30 + flick, -4.5);
      ctx.stroke();

      // Bifurcación inferior
      ctx.beginPath();
      ctx.moveTo(25 + flick, 0);
      ctx.lineTo(30 + flick,  4.5);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  /* ─── Loop principal ─── */
  function loop() {
    ctx.clearRect(0, 0, W, H);
    update();
    drawBody();
    drawHead();
    requestAnimationFrame(loop);
  }

  loop();
}

// Lanzar serpiente
initSnake();
