/* =========================================================
   Fareeha Zahrah — Creative Portfolio
   ========================================================= */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const rand = (a, b) => a + Math.random() * (b - a);
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IMG = 'assets/img/';

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  const scrollTo = (target) => {
    if (lenis) lenis.scrollTo(target, { duration: 1.6, offset: 0 });
    else $(target)?.scrollIntoView({ behavior: 'smooth' });
  };

  /* ---------- text splitting ---------- */
  function splitChars(el) {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((w) => {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); return; }
            const word = document.createElement('span');
            word.className = 'word';
            [...w].forEach((c) => {
              const ch = document.createElement('span');
              ch.className = 'char';
              ch.textContent = c;
              word.appendChild(ch);
            });
            frag.appendChild(word);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'IMG') walk(n);
      });
    };
    walk(el);
    return $$('.char', el);
  }
  function splitWords(el) {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((w) => {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); return; }
            const s = document.createElement('span');
            s.className = 'word';
            s.textContent = w;
            frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    return $$('.word', el);
  }
  $$('.split').forEach(splitChars);
  $$('.reveal-words').forEach(splitWords);

  /* ---------- ransom-note letters (her cut-out type) ---------- */
  $$('.ransom__word').forEach((w) => {
    [...w.dataset.word].forEach((c, i) => {
      const img = document.createElement('img');
      img.src = `${IMG}l-${c}.webp`;
      img.alt = '';
      img.style.setProperty('--i', i);
      img.style.setProperty('--hr', `${rand(-18, 18).toFixed(1)}deg`);
      img.style.transform = `rotate(${rand(-8, 8).toFixed(1)}deg) translateY(${rand(-4, 4).toFixed(1)}px)`;
      w.appendChild(img);
    });
  });

  /* ---------- torn-paper year digits ---------- */
  $$('.job[data-year]').forEach((job) => {
    const box = $('.job__year', job);
    [...job.dataset.year].forEach((d) => {
      const img = document.createElement('img');
      img.src = `${IMG}d-${d}.webp`;
      img.alt = '';
      img.style.transform = `rotate(${rand(-7, 7).toFixed(1)}deg)`;
      box.appendChild(img);
    });
    box.setAttribute('aria-label', job.dataset.year);
  });

  /* =========================================================
     PRELOADER → HERO INTRO
     ========================================================= */
  const loader = $('#loader');
  const countEl = $('#loaderCount');
  const heroImgs = $$('.hero img, .ransom img');
  let loaded = 0;
  const progress = { v: 0 };
  const target = () => Math.max(loaded / heroImgs.length, 0) * 100;
  heroImgs.forEach((img) => {
    if (img.complete) { loaded++; return; }
    img.addEventListener('load', () => loaded++, { once: true });
    img.addEventListener('error', () => loaded++, { once: true });
  });

  gsap.to('.loader__logo', { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power3.inOut' });
  const start = performance.now();
  const tick = () => {
    const minTime = Math.min((performance.now() - start) / 1800, 1) * 100;
    const goal = Math.min(target(), minTime);
    progress.v += (goal - progress.v) * 0.12;
    if (goal >= 99.5 && progress.v > 99) progress.v = 100;
    countEl.textContent = String(Math.round(progress.v)).padStart(3, '0');
    if (progress.v >= 100) return finishLoader();
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  setTimeout(() => { loaded = heroImgs.length; }, 6000); // never hang on a slow image

  function finishLoader() {
    const tl = gsap.timeline({
      onComplete: () => {
        loader.remove();
        document.body.classList.remove('is-loading');
        lenis?.start();
        ScrollTrigger.refresh();
      },
    });
    tl.to('.loader__inner', { opacity: 0, y: -30, duration: 0.5, ease: 'power2.in' })
      .to('.loader__half--top', { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '-=0.1')
      .to('.loader__half--bottom', { yPercent: 100, duration: 1, ease: 'expo.inOut' }, '<')
      .add(heroIntro(), '-=0.65');
  }

  function heroIntro() {
    const tl = gsap.timeline();
    const loop = $('.hero__loop path');
    const len = loop.getTotalLength();
    gsap.set(loop, { strokeDasharray: len, strokeDashoffset: len });
    tl.from('.hero__title .char', { yPercent: 115, rotate: 8, duration: 1.2, ease: 'expo.out', stagger: 0.04 })
      .from('.hero__oval', { clipPath: 'ellipse(0% 0% at 50% 50%)', duration: 1.4, ease: 'expo.inOut' }, 0)
      .from('.hero__oval img', { scale: 1.6, duration: 1.8, ease: 'expo.out' }, 0.2)
      .from('.hero__sun', { scale: 0, rotate: -120, duration: 1.6, ease: 'back.out(1.6)' }, 0.5)
      .from('.hero__zay', { opacity: 0, x: 30, duration: 1, ease: 'power3.out' }, 0.9)
      .to(loop, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 0.6)
      .from('.hero .ransom img', {
        y: () => rand(-260, -120), x: () => rand(-60, 60), rotate: () => rand(-90, 90), opacity: 0,
        duration: 1.1, ease: 'bounce.out', stagger: { each: 0.06, from: 'random' },
      }, 0.7)
      .from('.hero__roles, .hero__cta, .hero__scroll', { opacity: 0, y: 20, duration: 0.8, stagger: 0.1 }, 1.4);
    gsap.to('.hero__sun', { rotate: 360, duration: 60, repeat: -1, ease: 'none' });
    return tl;
  }

  /* hero mouse parallax */
  if (finePointer) {
    const hero = $('.hero');
    const px = gsap.quickTo('.hero__portrait', 'x', { duration: 1, ease: 'power3' });
    const py = gsap.quickTo('.hero__portrait', 'y', { duration: 1, ease: 'power3' });
    const tx = gsap.quickTo('.hero__title', 'x', { duration: 1.2, ease: 'power3' });
    hero.addEventListener('mousemove', (e) => {
      const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
      px(nx * 30); py(ny * 30); tx(nx * -20);
    });
  }
  gsap.to('.hero__title', { yPercent: -25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__portrait', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* =========================================================
     STARFIELD
     ========================================================= */
  function starfield(canvas, count) {
    const ctx = canvas.getContext('2d');
    let w, h, stars = [], mx = 0, my = 0, running = false, raf;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const resize = () => {
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h, z: rand(0.2, 1),
        r: rand(0.3, 1.6), t: Math.random() * Math.PI * 2, red: Math.random() < 0.06,
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.t += 0.02 * s.z;
        s.y -= 0.08 * s.z;
        if (s.y < -5) s.y = h + 5;
        const a = 0.35 + Math.sin(s.t) * 0.35;
        const x = s.x + mx * 25 * s.z, y = s.y + my * 25 * s.z;
        ctx.beginPath();
        ctx.arc(x, y, s.r * s.z * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = s.red ? `rgba(229,37,27,${a + 0.3})` : `rgba(243,238,231,${a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    resize();
    addEventListener('resize', resize);
    canvas.parentElement.addEventListener('mousemove', (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; });
    new IntersectionObserver(([en]) => {
      if (en.isIntersecting && !running) { running = true; draw(); }
      else if (!en.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
    }).observe(canvas);
  }
  starfield($('#stars'), innerWidth < 700 ? 120 : 260);
  starfield($('#stars2'), innerWidth < 700 ? 100 : 200);

  /* =========================================================
     CURSOR
     ========================================================= */
  if (finePointer) {
    const cur = $('.cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring'), label = $('.cursor__label');
    const dx = gsap.quickTo(dot, 'x', { duration: 0.1 }), dy = gsap.quickTo(dot, 'y', { duration: 0.1 });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
    addEventListener('mousemove', (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
    addEventListener('mousedown', () => cur.classList.add('is-down'));
    addEventListener('mouseup', () => cur.classList.remove('is-down'));
    document.addEventListener('mouseover', (e) => {
      const t = e.target.closest('[data-cursor]');
      if (t) { label.textContent = t.dataset.cursor; cur.classList.add('is-label'); }
      else cur.classList.remove('is-label');
    });
    document.addEventListener('mouseleave', () => gsap.to(cur, { opacity: 0 }));
    document.addEventListener('mouseenter', () => gsap.to(cur, { opacity: 1 }));

    /* magnetic */
    $$('.magnetic').forEach((el) => {
      const inner = el.firstElementChild;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.6, ease: 'power3' });
        gsap.to(inner, { x: x * 0.15, y: y * 0.15, duration: 0.6, ease: 'power3' });
      });
      el.addEventListener('mouseleave', () => gsap.to([el, inner], { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)' }));
    });
  }

  /* =========================================================
     PROGRESS / CHAPTER / ROOMS
     ========================================================= */
  gsap.to('.progress span', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

  const chNum = $('#chapterNum'), chName = $('#chapterName');
  const setChapter = (str) => {
    const [n, name] = str.split('|');
    if (chName.textContent === name) return;
    gsap.to([chNum, chName], {
      yPercent: -100, opacity: 0, duration: 0.25, ease: 'power2.in',
      onComplete: () => {
        chNum.textContent = n; chName.textContent = name;
        gsap.fromTo([chNum, chName], { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power3.out' });
      },
    });
  };
  $$('[data-chapter]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 50%', end: 'bottom 50%',
      onToggle: (self) => self.isActive && setChapter(sec.dataset.chapter),
    });
  });

  /* rooms discovered */
  const roomsEl = $('#rooms'), dotsBox = $('.rooms__dots'), roomsCount = $('#roomsCount');
  for (let i = 0; i < 8; i++) dotsBox.appendChild(document.createElement('i'));
  let found = new Set();
  try { found = new Set(JSON.parse(localStorage.getItem('zay-rooms') || '[]')); } catch (e) { /* private mode */ }
  const toastEl = $('#toast');
  let toastTimer;
  const toast = (msg, ms = 3200) => {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), ms);
  };
  const roomNames = ['', 'poster design', 'logo design', 'product design', 'social media', 'inktober', 'photography', 'digital paintings', 'additional works'];
  const renderRooms = () => {
    $$('i', dotsBox).forEach((d, i) => d.classList.toggle('on', found.has(i + 1)));
    roomsCount.textContent = found.size;
    $$('.door').forEach((d, i) => d.classList.toggle('found', found.has(i + 1)));
  };
  renderRooms();
  $$('[data-room]').forEach((sec) => {
    const n = +sec.dataset.room;
    ScrollTrigger.create({
      trigger: sec, start: 'top 45%',
      onEnter: () => {
        if (found.has(n)) return;
        found.add(n);
        try { localStorage.setItem('zay-rooms', JSON.stringify([...found])); } catch (e) { /* ignore */ }
        renderRooms();
        gsap.fromTo($$('i', dotsBox)[n - 1], { scale: 3 }, { scale: 1.25, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
        if (found.size === 8) toast('✶ all 8 rooms found. psst: type z-a-y anywhere…', 5200);
        else toast(`room ${n} unlocked: ${roomNames[n]} (${found.size}/8)`);
      },
    });
  });
  ScrollTrigger.create({
    trigger: '#about', start: 'top 60%', endTrigger: '.contact__grid', end: 'top 85%',
    onToggle: (self) => roomsEl.classList.toggle('is-visible', self.isActive),
  });

  /* =========================================================
     MENU
     ========================================================= */
  const menu = $('#menu'), menuBtn = $('#menuBtn'), preview = $('.menu__preview'), previewImg = $('img', preview);
  let menuOpen = false;
  const toggleMenu = (open = !menuOpen) => {
    menuOpen = open;
    menu.classList.toggle('is-open', open);
    menuBtn.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    $('span', menuBtn).textContent = open ? 'close' : 'menu';
    if (open) {
      lenis?.stop();
      gsap.fromTo('.menu__list a', { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.04, delay: 0.25, overwrite: true });
    } else {
      lenis?.start();
      gsap.to('.menu__list a', { yPercent: 110, duration: 0.4, ease: 'power2.in', overwrite: true });
      gsap.to(preview, { opacity: 0, duration: 0.2 });
    }
  };
  gsap.set('.menu__list a', { yPercent: 110 });
  menuBtn.addEventListener('click', () => toggleMenu());
  $$('.menu__list a').forEach((a) => {
    a.addEventListener('mouseenter', () => { previewImg.src = a.dataset.img; gsap.to(preview, { opacity: 1, scale: 1, duration: 0.4 }); });
    a.addEventListener('mouseleave', () => gsap.to(preview, { opacity: 0, scale: 0.9, duration: 0.3 }));
    a.addEventListener('click', (e) => { e.preventDefault(); toggleMenu(false); setTimeout(() => scrollTo(a.getAttribute('href')), 350); });
  });
  if (finePointer) {
    const mx = gsap.quickTo(preview, 'x', { duration: 0.6, ease: 'power3' }), my = gsap.quickTo(preview, 'y', { duration: 0.6, ease: 'power3' });
    menu.addEventListener('mousemove', (e) => { mx(e.clientX + 40); my(e.clientY - 165); });
  }
  addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (menuOpen) toggleMenu(false); closeLightbox(); } });

  /* in-page anchors */
  $$('a[href^="#"]').forEach((a) => {
    if (a.closest('.menu')) return;
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length < 2 && href !== '#') return;
      e.preventDefault();
      scrollTo(href === '#top' || href === '#' ? 0 : href);
    });
  });

  /* =========================================================
     GENERIC REVEALS
     ========================================================= */
  $$('.h-section, .h-room, .contact__title').forEach((h) => {
    if (h.closest('.hero')) return;
    const chars = $$('.char', h);
    if (!chars.length) return;
    gsap.from(chars, {
      yPercent: 100, opacity: 0, rotateX: -80, transformOrigin: '50% 100%',
      duration: 1, ease: 'expo.out', stagger: 0.025,
      scrollTrigger: { trigger: h, start: 'top 85%' },
    });
  });
  $$('.room__desc, .label, .eyebrow, .logos__intro, .brand__file, .brand__note, .tools__more, .hand-note, .doors__sub, .zay__lead, .arrow-list li, .edu li, .plaque').forEach((el) => {
    gsap.from(el, { opacity: 0, y: 30, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
  });

  /* =========================================================
     ABOUT
     ========================================================= */
  $$('.reveal-words').forEach((p) => {
    gsap.to($$('.word', p), {
      opacity: 1, stagger: 0.08, ease: 'none',
      scrollTrigger: { trigger: p, start: 'top 85%', end: 'bottom 55%', scrub: true },
    });
  });
  gsap.fromTo('.about__oval', { clipPath: 'ellipse(0% 0% at 50% 50%)' }, { clipPath: 'ellipse(50% 50% at 50% 50%)', ease: 'expo.out', duration: 1.8, scrollTrigger: { trigger: '.about__media', start: 'top 75%' } });
  gsap.fromTo('.about__oval img', { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.about', scrub: true } });
  gsap.from('.about__smile', { scale: 0, rotate: -90, duration: 1.2, ease: 'back.out(2)', scrollTrigger: { trigger: '.about__media', start: 'top 55%' } });
  gsap.from('.about__sparks', { scale: 0, rotate: 45, duration: 0.8, ease: 'back.out(3)', scrollTrigger: { trigger: '.about', start: 'top 60%' } });

  /* numbers */
  $$('.stat b').forEach((b) => {
    const n = +b.dataset.count, suf = b.dataset.suffix || '';
    const o = { v: 0 };
    gsap.to(o, {
      v: n, duration: 2, ease: 'power3.out',
      scrollTrigger: { trigger: b, start: 'top 88%' },
      onUpdate: () => (b.textContent = Math.round(o.v) + suf),
    });
  });
  gsap.from('.stat', { y: 60, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.numbers', start: 'top 80%' } });

  /* background lines */
  $$('.background__lines path').forEach((p, i) => {
    const l = p.getTotalLength();
    gsap.fromTo(p, { strokeDasharray: l, strokeDashoffset: l }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.background', start: 'top 80%', end: 'bottom 40%', scrub: 1 + i * 0.4 } });
  });
  gsap.from('.values li', { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2)', stagger: 0.05, clearProps: 'transform', scrollTrigger: { trigger: '.values', start: 'top 85%' } });

  /* =========================================================
     HORIZONTAL PINS (journey, posters)
     ========================================================= */
  function horizontal(section, pinEl, track, extra) {
    const dist = () => Math.max(track.scrollWidth - innerWidth, 0);
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: section, pin: pinEl, start: 'top top', end: () => '+=' + dist(),
        scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: extra,
      },
    });
    return tween;
  }
  const jTween = horizontal($('.journey'), $('.journey__pin'), $('.journey__track'), (self) => {
    gsap.set('.journey__line span', { scaleX: self.progress });
  });
  // cards already on screen when the pin starts use a normal trigger; the rest reveal as they slide in
  const inView = (el) => el.offsetLeft < innerWidth * 0.8;
  $$('.job').forEach((job, i) => {
    const st = inView(job)
      ? { trigger: '.journey', start: 'top 55%' }
      : { trigger: job, containerAnimation: jTween, start: 'left 85%' };
    gsap.from($$('.job__year img', job), {
      y: -80, rotate: () => rand(-40, 40), opacity: 0, duration: 0.9, ease: 'back.out(2)', stagger: 0.08,
      delay: inView(job) ? i * 0.15 : 0, scrollTrigger: st,
    });
    gsap.from($$('h3, p, a', job), {
      y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.06,
      delay: inView(job) ? i * 0.15 + 0.2 : 0, scrollTrigger: { ...st },
    });
  });
  gsap.to('.journey__laptop', { rotate: 14, y: -10, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });

  const posterTrack = $('.posters__track');
  const pTween = horizontal($('.posters'), $('.posters__pin'), posterTrack, (self) => {
    const skew = gsap.utils.clamp(-8, 8, self.getVelocity() / -300);
    gsap.to('.poster img', { skewX: skew, duration: 0.4, ease: 'power3', overwrite: 'auto' });
  });
  $$('.poster').forEach((p, i) => {
    const st = inView(p) ? { trigger: '.posters', start: 'top 60%' } : { trigger: p, containerAnimation: pTween, start: 'left 95%' };
    gsap.from(p, { y: 150, rotate: rand(-10, 10), opacity: 0, duration: 1.1, ease: 'expo.out', delay: inView(p) ? i * 0.1 : 0, scrollTrigger: st });
  });

  /* 3D tilt */
  if (finePointer) {
    $$('.tilt').forEach((el) => {
      const img = $('img', el);
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(img, { rotateY: x * 18, rotateX: -y * 18, scale: 1.04, duration: 0.5, ease: 'power3' });
      });
      el.addEventListener('mouseleave', () => gsap.to(img, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }));
    });
  }

  /* =========================================================
     DRAGGABLES (sticker board + photo table)
     ========================================================= */
  let zTop = 10;
  function draggable(el, bounds) {
    let sx, sy, ox = 0, oy = 0, dragging = false, moved = false;
    const baseRot = el.style.getPropertyValue('--r') || '0deg';
    el.addEventListener('pointerdown', (e) => {
      dragging = true; moved = false;
      el.setPointerCapture(e.pointerId);
      sx = e.clientX - ox; sy = e.clientY - oy;
      el.style.zIndex = ++zTop;
      el.classList.add('is-drag');
      gsap.to(el, { scale: 1.08, rotate: parseFloat(baseRot) + rand(-6, 6), duration: 0.3, ease: 'power3' });
    });
    el.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const b = bounds.getBoundingClientRect(), r = el.getBoundingClientRect();
      let nx = e.clientX - sx, ny = e.clientY - sy;
      // keep at least a quarter of the item inside the area
      const minX = ox - (r.left - b.left) - r.width * 0.75, maxX = ox + (b.right - r.right) + r.width * 0.75;
      const minY = oy - (r.top - b.top) - r.height * 0.5, maxY = oy + (b.bottom - r.bottom) + r.height * 0.5;
      nx = gsap.utils.clamp(minX, maxX, nx); ny = gsap.utils.clamp(minY, maxY, ny);
      if (Math.abs(nx - ox) + Math.abs(ny - oy) > 2) moved = true;
      ox = nx; oy = ny;
      gsap.to(el, { x: ox, y: oy, duration: 0.15, ease: 'power2' });
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('is-drag');
      gsap.to(el, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      if (!moved && el.matches('.snap')) openLightbox($('img', el).src, $('figcaption', el)?.textContent);
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
  }
  const board = $('#board');
  $$('img', board).forEach((img) => {
    gsap.set(img, { rotate: parseFloat(img.style.getPropertyValue('--r')) });
    draggable(img, board);
  });
  gsap.from($$('img', board), {
    scale: 0, rotate: () => rand(-60, 60), duration: 0.9, ease: 'back.out(2.2)', stagger: { each: 0.06, from: 'random' },
    scrollTrigger: { trigger: board, start: 'top 75%' },
  });
  gsap.from('.tool', { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.tools', start: 'top 85%' } });

  const table = $('#table');
  $$('.snap', table).forEach((s) => {
    gsap.set(s, { rotate: parseFloat(s.style.getPropertyValue('--r')) });
    draggable(s, table);
  });
  gsap.from($$('.snap', table), {
    x: () => rand(-700, 700), y: () => rand(400, 900), rotate: () => rand(-120, 120), opacity: 0,
    duration: 1.3, ease: 'expo.out', stagger: 0.09,
    scrollTrigger: { trigger: table, start: 'top 75%' },
  });
  gsap.from('.h-room--paper', { rotate: -25, scale: 0.6, opacity: 0, duration: 1.2, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.photo', start: 'top 70%' } });

  /* =========================================================
     INTERLUDE — oval grows into the whole screen
     ========================================================= */
  if (innerWidth <= 900) gsap.set('.interlude__media', { clipPath: 'ellipse(30% 16% at 50% 76%)' });
  const inter = gsap.timeline({
    scrollTrigger: { trigger: '.interlude', pin: '.interlude__pin', start: 'top top', end: '+=140%', scrub: 1 },
  });
  inter
    .from('.interlude__text .line > span', { yPercent: 110, stagger: 0.12, duration: 0.5, ease: 'power3.out' })
    .from('.interlude__text .art', { scale: 3, rotate: -20, color: '#f3eee7', duration: 0.4 }, 0.2)
    .to('.interlude__media', { clipPath: 'ellipse(110% 110% at 50% 50%)', duration: 1, ease: 'power2.inOut' }, 0.5)
    .to('.interlude__media', { '--shade': 1, duration: 0.6 }, 0.8)
    .fromTo('.interlude__media img', { scale: 1.25 }, { scale: 1, duration: 1.5, ease: 'none' }, 0);

  /* doors */
  gsap.from('.door', {
    y: 140, rotate: () => rand(-8, 8), opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08, clearProps: 'transform',
    scrollTrigger: { trigger: '.doors__grid', start: 'top 85%' },
  });

  /* =========================================================
     02 LOGOS
     ========================================================= */
  const zayTl = gsap.timeline({ scrollTrigger: { trigger: '.zay__stage', start: 'top 70%' } });
  const arrowPaths = $$('.zay__arrow path');
  arrowPaths.forEach((p) => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l }); });
  zayTl.from('.zay__stage', { clipPath: 'inset(100% 0 0 0 round 50% 50% 12px 12px)', duration: 1.2, ease: 'expo.inOut' })
    .to('.zay__logo', { clipPath: 'inset(0 0% 0 0)', duration: 1.6, ease: 'power2.inOut' }, '-=0.3')
    .to(arrowPaths, { strokeDashoffset: 0, duration: 0.8, stagger: 0.5, ease: 'power2.out' }, '-=1.2')
    .from('.zay__word', { letterSpacing: '1.4em', opacity: 0, duration: 1.2, ease: 'expo.out' }, '-=0.6');
  gsap.to('.zay__grid', { backgroundPosition: '34px 34px', duration: 3, repeat: -1, ease: 'none' });
  gsap.from('.flip', {
    rotateY: -90, y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12,
    scrollTrigger: { trigger: '.logos__grid', start: 'top 85%' },
  });
  $$('.flip').forEach((f) => f.addEventListener('click', () => f.classList.toggle('is-flipped')));

  /* =========================================================
     03 PRODUCT
     ========================================================= */
  gsap.from('.product__jerseys', { xPercent: -30, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.product__stage', start: 'top 75%' } });
  gsap.from('.product__caps img', { rotate: -200, scale: 0.4, opacity: 0, duration: 1.6, ease: 'expo.out', clearProps: 'transform', scrollTrigger: { trigger: '.product__caps', start: 'top 85%' } });
  const stage = $('.product__stage');
  stage.addEventListener('mousemove', (e) => {
    const r = stage.getBoundingClientRect();
    stage.style.setProperty('--sx', `${e.clientX - r.left}px`);
    stage.style.setProperty('--sy', `${e.clientY - r.top}px`);
  });

  /* =========================================================
     04 SOCIAL
     ========================================================= */
  /* shuffle stack */
  $$('.stack').forEach((stack) => {
    const imgs = $$('img', stack);
    const layout = () => $$('img', stack).forEach((img, i, all) => {
      const depth = all.length - 1 - i;
      gsap.to(img, { rotate: depth * -5 + (depth ? 2 : 0), x: depth * -14, y: depth * 10, scale: 1 - depth * 0.04, duration: 0.6, ease: 'power3' });
    });
    layout();
    gsap.from(imgs, { y: 200, rotate: () => rand(-30, 30), opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: stack, start: 'top 80%' } });
    let busy = false;
    stack.addEventListener('click', () => {
      if (busy) return;
      busy = true;
      const top = stack.lastElementChild;
      gsap.to(top, {
        x: 260, rotate: 20, duration: 0.35, ease: 'power2.in',
        onComplete: () => { stack.prepend(top); layout(); busy = false; },
      });
    });
  });

  /* videos: play only when on screen */
  const vio = new IntersectionObserver((entries) => entries.forEach((en) => {
    const v = en.target;
    if (en.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; v.play().catch(() => {}); }
    else v.pause();
  }), { threshold: 0.35 });
  $$('video').forEach((v) => vio.observe(v));

  gsap.from('.phones .phone', {
    y: 120, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1,
    scrollTrigger: { trigger: '.phones', start: 'top 80%' },
  });
  $$('.cm-row .phone, .brand--duo .phone').forEach((ph) => {
    gsap.from(ph, { y: 120, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: ph, start: 'top 90%' } });
  });
  $$('.mk-grid img, .cm-row img').forEach((img, i) => {
    gsap.from(img, { y: 80, rotate: (i % 2 ? 4 : -4), opacity: 0, duration: 1, ease: 'expo.out', clearProps: 'transform', scrollTrigger: { trigger: img, start: 'top 92%' } });
  });

  /* EDM fan-out */
  const edms = $$('.edms__fan img');
  gsap.timeline({ scrollTrigger: { trigger: '.edms__fan', start: 'top 85%', end: 'center 45%', scrub: 1 } })
    .fromTo(edms[0], { rotate: 0, xPercent: -50, yPercent: -50 }, { rotate: -9, xPercent: -88, yPercent: -66, ease: 'none' }, 0)
    .fromTo(edms[1], { rotate: 0, xPercent: -50, yPercent: -50 }, { rotate: 2, xPercent: -50, yPercent: -40, ease: 'none' }, 0)
    .fromTo(edms[2], { rotate: 0, xPercent: -50, yPercent: -50 }, { rotate: 9, xPercent: -12, yPercent: -24, ease: 'none' }, 0);
  edms.forEach((img) => img.addEventListener('mouseenter', () => { img.style.zIndex = ++zTop; }));

  /* parallax helpers */
  $$('.parallax').forEach((el) => {
    const sp = parseFloat(el.dataset.speed || 0.1);
    gsap.fromTo(el, { y: () => sp * 300 }, { y: () => -sp * 300, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* =========================================================
     05 INKTOBER — film strip that runs with your scroll
     ========================================================= */
  const film = $('.film__track');
  film.innerHTML += film.innerHTML; // seamless loop
  let filmX = 0, filmBoost = 0;
  gsap.ticker.add(() => {
    const half = film.scrollWidth / 2;
    filmX -= 0.6 + filmBoost;
    filmBoost *= 0.92;
    if (filmX <= -half) filmX += half;
    if (filmX > 0) filmX -= half;
    gsap.set(film, { x: filmX });
  });
  ScrollTrigger.create({ trigger: '.ink', start: 'top bottom', end: 'bottom top', onUpdate: (s) => { filmBoost = gsap.utils.clamp(-25, 25, s.getVelocity() / 120); } });
  $$('.film figure').forEach((f) => f.addEventListener('mousemove', (e) => {
    const r = f.getBoundingClientRect();
    f.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    f.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  }));
  gsap.from('.ransom--ink img', {
    y: () => rand(-200, -80), rotate: () => rand(-60, 60), opacity: 0, duration: 1, ease: 'bounce.out', stagger: 0.07,
    scrollTrigger: { trigger: '.ink', start: 'top 70%' },
  });

  /* =========================================================
     07 PAINTINGS — the dark gallery
     ========================================================= */
  const room = $('#galleryRoom'), lightsBtn = $('#lightsBtn');
  const setLights = (on) => {
    room.classList.toggle('lit', on);
    lightsBtn.setAttribute('aria-pressed', on);
    lightsBtn.textContent = on ? '🕯 lights off' : '💡 lights on';
  };
  if (!finePointer) setLights(true);
  lightsBtn.addEventListener('click', () => setLights(!room.classList.contains('lit')));
  // spotlight follows the cursor (offsets match the ::after inset)
  const spot = { x: 0, y: 0, tx: 0, ty: 0, on: false };
  const spotTarget = (e) => {
    const r = room.getBoundingClientRect();
    const pad = parseFloat(getComputedStyle(room.parentElement).paddingLeft);
    spot.tx = e.clientX - r.left + pad; spot.ty = e.clientY - r.top + 64;
  };
  room.addEventListener('mouseenter', (e) => { spotTarget(e); spot.x = spot.tx; spot.y = spot.ty; spot.on = true; });
  room.addEventListener('mousemove', spotTarget);
  room.addEventListener('mouseleave', () => { spot.on = false; });
  gsap.ticker.add(() => {
    if (!spot.on) return;
    spot.x += (spot.tx - spot.x) * 0.15; spot.y += (spot.ty - spot.y) * 0.15;
    room.style.setProperty('--gx', `${spot.x}px`);
    room.style.setProperty('--gy', `${spot.y}px`);
  });
  $$('.framed', room).forEach((f, i) => {
    gsap.from(f, { y: 120, rotate: i % 2 ? 3 : -3, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: f, start: 'top 90%' } });
    f.setAttribute('data-cursor', 'view');
    f.addEventListener('click', () => openLightbox($('.framed__art img', f).src, $('.plaque', f).textContent));
  });

  /* =========================================================
     CONTACT
     ========================================================= */
  $('#copyEmail').addEventListener('click', async () => {
    const email = 'zahrahbiju@gmail.com';
    try { await navigator.clipboard.writeText(email); toast('✶ email copied. talk soon!'); }
    catch (e) { location.href = `mailto:${email}`; }
  });
  gsap.from('.contact__zay', { rotate: -180, scale: 0, duration: 1.4, ease: 'back.out(1.8)', scrollTrigger: { trigger: '.contact', start: 'top 60%' } });
  gsap.from('.contact__grid > div', { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.contact__grid', start: 'top 90%' } });

  /* marquees — speed up with scroll */
  $$('.marquee__track').forEach((track, i) => {
    let x = 0, boost = 0;
    const dir = i % 2 ? 1 : -1;
    ScrollTrigger.create({ trigger: track, start: 'top bottom', end: 'bottom top', onUpdate: (s) => { boost = Math.abs(s.getVelocity()) / 400; } });
    gsap.ticker.add(() => {
      const half = track.scrollWidth / 2;
      x += dir * (0.7 + boost);
      boost *= 0.94;
      if (x <= -half) x += half;
      if (x >= 0 && dir > 0) x -= half;
      gsap.set(track, { x });
    });
  });

  /* =========================================================
     LIGHTBOX
     ========================================================= */
  const lb = $('#lightbox'), lbImg = $('img', lb), lbCap = $('.lightbox__cap', lb);
  function openLightbox(src, cap = '') {
    lbImg.src = src;
    lbImg.alt = cap || '';
    lbCap.textContent = cap || '';
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    lenis?.stop();
  }
  function closeLightbox() {
    if (!lb.classList.contains('is-open')) return;
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    lenis?.start();
  }
  lb.addEventListener('click', closeLightbox);
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-cursor="view"]');
    if (!t || t.classList.contains('framed')) return;
    const img = t.tagName === 'IMG' ? t : $('img', t);
    if (!img) return;
    const cap = t.querySelector?.('figcaption')?.textContent || img.alt;
    openLightbox(img.src, cap);
  });

  /* =========================================================
     EASTER EGG — type "zay", or click the logo
     ========================================================= */
  const stickers = ['st-star', 'st-burst', 'st-heart', 'st-flower', 'st-gear', 'st-creativity', 'st-oval', 'zay-small', 'st-logo', 'st-branding'];
  function rain(n = 36) {
    for (let i = 0; i < n; i++) {
      const img = document.createElement('img');
      img.src = IMG + stickers[i % stickers.length] + '.webp';
      img.alt = '';
      Object.assign(img.style, { position: 'fixed', left: rand(0, 100) + 'vw', top: '-140px', width: rand(50, 110) + 'px', zIndex: 940, pointerEvents: 'none' });
      document.body.appendChild(img);
      gsap.to(img, {
        y: innerHeight + 300, x: rand(-150, 150), rotate: rand(-540, 540), duration: rand(1.8, 3.2), delay: rand(0, 0.8),
        ease: 'power1.in', onComplete: () => img.remove(),
      });
    }
  }
  let typed = '';
  addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea')) return;
    typed = (typed + e.key.toLowerCase()).slice(-3);
    if (typed === 'zay') { rain(48); toast('✶ hi, I go by Zay online. you found the secret!', 4200); }
  });
  $('.nav__logo').addEventListener('dblclick', (e) => { e.preventDefault(); rain(24); });

  /* triggers were created out of page order (chapters before pins) — sort, then keep in sync */
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
})();
