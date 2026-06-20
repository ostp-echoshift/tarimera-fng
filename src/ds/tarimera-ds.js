            /* ════════════════════════════════════════════════════════════════
               TARIMERA FNG · Design System JS v1.0
               OSTP @echoShift · Zapopan, Jalisco · 2026
               ────────────────────────────────────────────────────────────────
               USO: incluir justo antes de </body>
               <script src="src/ds/tarimera-ds.js"></script>
               ════════════════════════════════════════════════════════════════ */

            (function() {
              'use strict';

              /* ── 1. NAV SCROLL ─────────────────────────────────────────── */
              const nav = document.querySelector('.tn-nav');
              if (nav) {
                const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
                window.addEventListener('scroll', onScroll, { passive: true });
                onScroll();
              }


              /* ── 2. REVEAL CON INTERSECTION OBSERVER ──────────────────── */
              const revealEls = document.querySelectorAll(
                '.tn-reveal, .tn-reveal-left, .tn-reveal-scale'
              );

              if (revealEls.length) {
                const revealObserver = new IntersectionObserver((entries) => {
                  entries.forEach((entry, idx) => {
                    if (entry.isIntersecting) {
                      /* stagger: retraso suave entre elementos del mismo viewport */
                      const delay = Math.min(idx * 50, 300);
                      setTimeout(() => {
                        entry.target.classList.add('visible');
                      }, delay);
                      revealObserver.unobserve(entry.target);
                    }
                  });
                }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

                revealEls.forEach(el => revealObserver.observe(el));
              }


              /* ── 3. COUNTUP ANIMADO ────────────────────────────────────── */
              /*
                 USO en HTML:
                 <span class="tn-stat-number tn-countup" data-target="1200" data-suffix="+">0</span>
              */
              const countEls = document.querySelectorAll('.tn-countup[data-target]');

              if (countEls.length) {
                const countObserver = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    countObserver.unobserve(entry.target);

                    const el      = entry.target;
                    const target  = parseInt(el.dataset.target, 10);
                    const suffix  = el.dataset.suffix || '';
                    const duration = parseInt(el.dataset.duration, 10) || 1600;
                    const start   = performance.now();

                    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

                    function tick(now) {
                      const elapsed  = now - start;
                      const progress = Math.min(elapsed / duration, 1);
                      const current  = Math.floor(easeOut(progress) * target);
                      el.textContent = current.toLocaleString('es-MX') + suffix;
                      if (progress < 1) requestAnimationFrame(tick);
                    }

                    requestAnimationFrame(tick);
                  });
                }, { threshold: 0.4 });

                countEls.forEach(el => countObserver.observe(el));
              }


              /* ── 4. NAV HAMBURGER (MOBILE) ─────────────────────────────── */
              /*
                 USO en HTML:
                 <button class="tn-nav-hamburger" aria-label="Menú">
                   <span></span><span></span><span></span>
                 </button>
                 <div class="tn-nav-mobile-menu">...</div>
              */
              const hamburger  = document.querySelector('.tn-nav-hamburger');
              const mobileMenu = document.querySelector('.tn-nav-mobile-menu');

              if (hamburger && mobileMenu) {
                hamburger.addEventListener('click', () => {
                  const open = hamburger.classList.toggle('open');
                  mobileMenu.classList.toggle('open', open);
                  hamburger.setAttribute('aria-expanded', open);
                  document.body.style.overflow = open ? 'hidden' : '';
                });

                /* Cerrar al hacer clic en un enlace */
                mobileMenu.querySelectorAll('a').forEach(link => {
                  link.addEventListener('click', () => {
                    hamburger.classList.remove('open');
                    mobileMenu.classList.remove('open');
                    document.body.style.overflow = '';
                  });
                });
              }


              /* ── 5. FAQ TOGGLE ─────────────────────────────────────────── */
              /*
                 USO en HTML:
                 <div class="tn-faq-item">
                   <button class="tn-faq-q">¿Pregunta? <span class="tn-faq-icon"></span></button>
                   <div class="tn-faq-a">Respuesta...</div>
                 </div>
              */
              document.querySelectorAll('.tn-faq-q').forEach(btn => {
                btn.addEventListener('click', () => {
                  const item = btn.closest('.tn-faq-item');
                  const isOpen = item.classList.contains('open');

                  /* Cierra todos */
                  document.querySelectorAll('.tn-faq-item.open').forEach(i => {
                    i.classList.remove('open');
                    i.querySelector('.tn-faq-a').style.maxHeight = null;
                  });

                  /* Abre el que se clickeó (si no estaba abierto) */
                  if (!isOpen) {
                    item.classList.add('open');
                    const answer = item.querySelector('.tn-faq-a');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                  }
                });
              });


              /* ── 6. SMOOTH SCROLL PARA ANCLAS INTERNAS ─────────────────── */
              document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                  const targetId = this.getAttribute('href');
                  if (targetId === '#') return;

                  const target = document.querySelector(targetId);
                  if (!target) return;

                  e.preventDefault();
                  const navH = parseInt(
                    getComputedStyle(document.documentElement)
                      .getPropertyValue('--tn-nav-height'),
                    10
                  ) || 72;

                  window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY - navH - 16,
                    behavior: 'smooth'
                  });
                });
              });


              /* ── 7. PRODUCT FILTER (CATÁLOGO) ──────────────────────────── */
              /*
                 USO en HTML:
                 <button class="tn-filter-btn active" data-filter="all">Todos</button>
                 <button class="tn-filter-btn" data-filter="nuevas">Nuevas</button>

                 <div class="tn-product-card" data-category="nuevas">...</div>
              */
              const filterBtns  = document.querySelectorAll('.tn-filter-btn');
              const productCards = document.querySelectorAll('[data-category]');

              if (filterBtns.length && productCards.length) {
                filterBtns.forEach(btn => {
                  btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const filter = btn.dataset.filter;

                    productCards.forEach(card => {
                      const match = filter === 'all' || card.dataset.category === filter;
                      card.style.display = match ? '' : 'none';

                      if (match) {
                        /* Pequeña animación de re-entrada */
                        card.style.opacity    = '0';
                        card.style.transform  = 'scale(0.97)';
                        requestAnimationFrame(() => {
                          card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
                          card.style.opacity    = '1';
                          card.style.transform  = 'scale(1)';
                        });
                      }
                    });
                  });
                });
              }


              /* ── 8. FORM WHATSAPP BUILDER ──────────────────────────────── */
              /*
                 USO en HTML:
                 <form class="tn-wa-form" data-phone="523317575573" data-template="Hola, me interesa cotizar {producto}">
                   <input name="producto" ...>
                   <button type="submit">Cotizar por WhatsApp</button>
                 </form>
              */
              document.querySelectorAll('.tn-wa-form').forEach(form => {
                form.addEventListener('submit', e => {
                  e.preventDefault();
                  const phone    = form.dataset.phone;
                  const template = form.dataset.template || 'Hola, quiero información sobre sus tarimas';
                  const data     = Object.fromEntries(new FormData(form));

                  let message = template;
                  Object.entries(data).forEach(([key, val]) => {
                    message = message.replace(`{${key}}`, val);
                  });

                  window.open(
                    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
                    '_blank',
                    'noopener,noreferrer'
                  );
                });
              });


              /* ── 9. LAZY IMAGES ────────────────────────────────────────── */
              /*
                 USO en HTML: <img class="tn-lazy" data-src="foto.jpg" alt="...">
              */
              const lazyImgs = document.querySelectorAll('img.tn-lazy[data-src]');
              if (lazyImgs.length && 'IntersectionObserver' in window) {
                const lazyObs = new IntersectionObserver(entries => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      const img = entry.target;
                      img.src = img.dataset.src;
                      img.classList.remove('tn-lazy');
                      lazyObs.unobserve(img);
                    }
                  });
                }, { rootMargin: '200px' });

                lazyImgs.forEach(img => lazyObs.observe(img));
              }

            })();

            /* ════════════════════════════════════════════════════════════════
               <!--████████████████ostp████████████████████-->
               ════════════════════════════════════════════════════════════════ */

