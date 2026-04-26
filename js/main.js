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
