/* The Masters prototype - motion rebuilt from the reference (same effects, Power4.easeOut), but entrances run
   about 40% faster than the reference's own timings (1s titles/text, 0.2s list stagger, 0.5s + 0.5s visuals),
   per Ori's request. All durations live in T. Hero slides autoplay every 6s, picture tilts up to 10deg. */
(() => {
  'use strict';
  /* static mode when the visitor asks for reduced motion, or when the head failsafe already removed the .js states */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || !document.documentElement.classList.contains('js');
  const P4 = 'cubic-bezier(.165,.84,.44,1)';
  const P1 = 'cubic-bezier(.25,.46,.45,.94)';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const header = $('.site-header');
  /* entrance timings in ms (reference values in the header comment) */
  const T = { fade: 500, wipe: 650, field: 300, intro: 200, reveal: 600, stagger: 70, layer: 300, img: 300, descDelay: 150, btnDelay: 250 };
  if (reduce) Object.keys(T).forEach((k) => { T[k] = 0; });   /* reduced motion: slide changes happen at once too */

  /* ---------- header ---------- */
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });
  requestAnimationFrame(() => header.classList.add('is-ready'));

  /* ---------- helpers ---------- */
  async function fadeTo(el, to, { duration = T.fade, delay = 0, easing = 'linear' } = {}) {
    const from = parseFloat(getComputedStyle(el).opacity);
    const an = el.animate([{ opacity: from }, { opacity: to }], { duration, delay, easing, fill: 'both' });
    await an.finished.catch(() => {});
    el.style.opacity = String(to);
    an.cancel();
  }
  async function wipe(el, show, duration = T.wipe) {
    const hidden = 'inset(0 0 0 100%)', shown = 'inset(0 0 0 0)';
    const an = el.animate([{ clipPath: show ? hidden : shown }, { clipPath: show ? shown : hidden }], { duration, easing: P4, fill: 'both' });
    await an.finished.catch(() => {});
    el.style.clipPath = show ? shown : '';
    an.cancel();
  }

  /* ---------- hero ---------- */
  const hero = $('.hero');
  const field = $('.hero__field');
  const fieldImg = $('.hero__field-img');
  const stage = $('#stage');
  const slides = $$('.slide');
  const pag = $$('.hero__pagination li');
  const prevBtn = $('#prev');
  const nextBtn = $('#next');
  const pauseBtn = $('#pause');
  const tBlack = $('.slide__title--black', stage);   /* one fixed headline for all slides */
  const parts = (s) => ({
    tw: $('.slide__visual .slide__title', s),
    d: $('.slide__desc', s), b: $('.slide__btn', s), v: $('.slide__visual', s),
  });
  let idx = 0, busy = true, timer = null, paused = false;

  const fieldVideo = $('.hero__field-video');
  /* video speed: hero-rolex-slow.mp4 is already the source slowed 2.5x with frame interpolation; playing it at 0.5
     gives the 5x slow-down Ori asked for, with smoother motion than slowing the original 5x in the browser */
  const RATE = 0.5;
  const slow = (v) => { if (v) { v.defaultPlaybackRate = RATE; v.playbackRate = RATE; } };
  $$('video').forEach(slow);
  /* the background shows the slide's own media: video slides also play in the blurred field, image slides use the picture */
  const setBg = (i) => {
    const s = slides[i];
    fieldImg.style.backgroundImage = 'url("' + s.dataset.bg + '")';
    if (s.dataset.video && !reduce) {
      if (fieldVideo.getAttribute('src') !== s.dataset.video) fieldVideo.src = s.dataset.video;
      fieldVideo.style.display = 'block';
      const own = $('video', s);
      if (own) fieldVideo.currentTime = own.currentTime || 0;
      slow(fieldVideo);
      if (!reduce && !paused) fieldVideo.play().catch(() => {});
    } else {
      fieldVideo.pause();
      fieldVideo.style.display = 'none';
    }
  };
  const playOwn = (s) => { const v = $('video', s); slow(v); if (v && !reduce && !paused) { v.currentTime = 0; v.play().catch(() => {}); } };
  const pauseOwn = (s) => { const v = $('video', s); if (v) v.pause(); };
  const setPag = (i) => pag.forEach((li, k) => li.classList.toggle('is-active', k === i));
  const setArrows = () => {
    /* aria-disabled keeps keyboard focus on the button at the ends of the carousel */
    prevBtn.style.opacity = idx === 0 ? '.2' : ''; prevBtn.setAttribute('aria-disabled', String(idx === 0));
    nextBtn.style.opacity = idx === slides.length - 1 ? '.2' : ''; nextBtn.setAttribute('aria-disabled', String(idx === slides.length - 1));
  };
  const showField = async () => {
    const an = fieldImg.animate([{ opacity: 0, transform: 'scale(1.3)' }, { opacity: 1, transform: 'scale(1)' }], { duration: T.field, easing: P1, fill: 'both' });
    await an.finished.catch(() => {}); fieldImg.style.opacity = '1'; fieldImg.style.transform = 'scale(1)'; an.cancel();
  };
  const hideField = async () => {
    const an = fieldImg.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.3)' }], { duration: T.field, easing: P1, fill: 'both' });
    await an.finished.catch(() => {}); fieldImg.style.opacity = '0'; fieldImg.style.transform = 'scale(1.3)'; an.cancel();
  };
  /* the headline never changes; only the small line and the action do */
  /* the action button enters with the same curtain wipe the page uses, instead of a plain fade */
  const revealBtn = async (b) => {
    const an = b.animate([{ clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: T.wipe, delay: T.btnDelay, easing: P4, fill: 'both' });
    b.style.opacity = '1';
    await an.finished.catch(() => {});
    b.style.clipPath = ''; an.cancel();
  };
  const showText = (s) => {
    const p = parts(s);
    return Promise.all([fadeTo(p.d, 1, { delay: T.descDelay }), revealBtn(p.b)]);
  };
  const hideText = (s) => { const p = parts(s); return Promise.all([p.d, p.b].map((e) => fadeTo(e, 0))); };
  const resetSlide = (s) => {
    const p = parts(s);
    [p.d, p.b].forEach((e) => { e.style.opacity = '0'; });
    p.v.style.clipPath = '';
  };
  slides.forEach((s) => { parts(s).tw.style.opacity = '1'; });
  const schedule = () => {
    clearTimeout(timer);
    if (!paused && !reduce && idx < slides.length - 1) timer = setTimeout(() => go(idx + 1, 'next'), 6000);
  };

  async function go(to, dir) {
    if (busy || to === idx || to < 0 || to >= slides.length) return;
    busy = true; clearTimeout(timer);
    const from = slides[idx], into = slides[to];
    const pf = parts(from), pi = parts(into);
    setPag(to);
    const textOut = hideText(from);
    const fieldOut = hideField();
    into.classList.add('is-active');
    playOwn(into);
    if (dir === 'next') {
      into.classList.add('is-top');
      await Promise.all([wipe(pi.v, true), fieldOut]);
    } else {
      pi.v.style.clipPath = 'inset(0 0 0 0)';
      from.classList.add('is-top');
      await Promise.all([wipe(pf.v, false), fieldOut]);
    }
    setBg(to);
    from.classList.remove('is-active', 'is-top');
    pauseOwn(from);
    into.classList.remove('is-top');
    await textOut;
    resetSlide(from);
    idx = to; setArrows();
    showField();
    await showText(into);
    busy = false; schedule();
  }

  async function intro() {
    setBg(0);
    await wait(T.intro);
    playOwn(slides[0]);
    await wipe(field, true, T.wipe);
    await wipe(parts(slides[0]).v, true, T.wipe);
    setArrows();
    showField();
    fadeTo(tBlack, 1);
    await showText(slides[0]);
    busy = false; schedule();
  }

  function showStatic() {
    setBg(0); fieldImg.style.opacity = '1'; fieldImg.style.transform = 'scale(1)';
    tBlack.style.opacity = '1';
    slides.forEach((s, k) => { const p = parts(s); [p.tw, p.d, p.b].forEach((e) => { e.style.opacity = '1'; }); p.v.style.clipPath = 'inset(0)'; s.classList.toggle('is-active', k === idx); });
    setArrows(); busy = false;
  }

  prevBtn.addEventListener('click', () => go(idx - 1, 'prev'));
  nextBtn.addEventListener('click', () => go(idx + 1, 'next'));
  pauseBtn.addEventListener('click', () => {
    paused = !paused;
    pauseBtn.textContent = paused ? 'הפעלה' : 'השהיה';
    const vids = [$('video', slides[idx]), fieldVideo.style.display === 'block' ? fieldVideo : null];
    vids.forEach((v) => { if (!v) return; if (paused) v.pause(); else v.play().catch(() => {}); });
    if (paused) clearTimeout(timer); else schedule();
  });

  /* the hero videos stop while the hero is off screen and resume when it returns (unless paused by the visitor) */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      const visible = entries[0].isIntersecting;
      const vids = [$('video', slides[idx]), fieldVideo.style.display === 'block' ? fieldVideo : null];
      vids.forEach((v) => { if (!v) return; if (!visible) v.pause(); else if (!paused && !reduce) v.play().catch(() => {}); });
    }, { threshold: 0.05 }).observe(hero);
  }

  if (!reduce) {
    /* mouse effect on the sharp picture: only the reference's tilt, eased (Ori cancelled every other mouse movement).
       The blurred background and the headline never move. */
    const mv = { tx: 0, ty: 0, x: 0, y: 0 };
    let raf = 0;
    const tick = () => {
      mv.x += (mv.tx - mv.x) * 0.07; mv.y += (mv.ty - mv.y) * 0.07;
      /* the reference's tilt, same formula: up to 10deg, sign flipped when the two axes disagree */
      let r = 10 * mv.x, s = 10 * mv.y;
      if ((r > 0 && s < 0) || (r < 0 && s > 0)) { r = -r; s = -s; }
      hero.style.setProperty('--rx', (-r).toFixed(2) + 'deg');
      hero.style.setProperty('--ry', s.toFixed(2) + 'deg');
      raf = (Math.abs(mv.tx - mv.x) > 0.002 || Math.abs(mv.ty - mv.y) > 0.002) ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    hero.addEventListener('mousemove', (e) => {
      if (e.pointerType === 'touch') return;
      const r = hero.getBoundingClientRect();
      mv.tx = (e.clientX - r.left) / r.width * 2 - 1;
      mv.ty = (e.clientY - r.top) / r.height * 2 - 1;
      kick();
    });
    hero.addEventListener('mouseleave', () => { mv.tx = 0; mv.ty = 0; kick(); });
    intro().catch(() => document.documentElement.classList.remove('js'));   /* if the intro ever throws, show the page as it is */
  } else {
    showStatic();
  }

  /* ---------- scroll reveals ---------- */
  const settle = async (el, an) => { await an.finished.catch(() => {}); el.classList.add('is-in'); an.cancel(); };
  /* a card's picture is uncovered like a curtain (right to left) while the photo settles from 130%; its title and text reveal on their own as they come into view */
  function revealCardImg(card) {
    const el = $('.card__img', card);
    const media = $('img, video', el);
    const a1 = el.animate([{ clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: T.wipe + 150, easing: P4, fill: 'both' });
    const a2 = media.animate([{ transform: 'scale(1.3)' }, { transform: 'none' }], { duration: T.wipe + 600, easing: P1, fill: 'both' });
    Promise.all([a1.finished, a2.finished].map((p) => p.catch(() => {}))).then(() => { el.classList.add('is-in'); a1.cancel(); a2.cancel(); });
  }
  function reveal(el) {
    const type = el.dataset.reveal;
    if (type === 'title') {
      settle(el, el.animate([{ opacity: 0, transform: 'skewX(15deg)', filter: 'blur(5px)' }, { opacity: 1, transform: 'none', filter: 'blur(0px)' }], { duration: T.reveal, easing: P4, fill: 'both' }));
    } else if (type === 'text') {
      settle(el, el.animate([{ opacity: 0, transform: 'translateY(50px)' }, { opacity: 1, transform: 'none' }], { duration: T.reveal, easing: P4, fill: 'both' }));
    } else if (type === 'card') {
      revealCardImg(el);
    } else if (type === 'list') {
      const kids = $$('.li-anim', el);
      const anims = kids.map((k, i) => k.animate([{ opacity: 0, transform: 'translateY(50px)' }, { opacity: 1, transform: 'none' }], { duration: T.reveal, delay: i * T.stagger, easing: P4, fill: 'both' }));
      Promise.all(anims.map((a) => a.finished.catch(() => {}))).then(() => { el.classList.add('is-in'); anims.forEach((a) => a.cancel()); });
    } else if (type === 'visual') {
      const layer = $('.sw-visual__layer', el), img = $('.sw-visual__img', el);
      const a1 = layer.animate([{ width: '0%' }, { width: '100%' }], { duration: T.layer, easing: P1, fill: 'both' });
      a1.finished.then(() => {
        const a2 = img.animate([{ opacity: 0, transform: 'scale(1.3)' }, { opacity: 1, transform: 'none' }], { duration: T.img, easing: P1, fill: 'both' });
        return a2.finished.then(() => { el.classList.add('is-in'); a1.cancel(); a2.cancel(); });
      }).catch(() => {});
    }
  }
  if (reduce || !('IntersectionObserver' in window)) {
    $$('[data-reveal]').forEach((el) => el.classList.add('is-in'));
    $$('.card__img').forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { io.unobserve(en.target); reveal(en.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.01 });
    $$('[data-reveal]').forEach((el) => io.observe(el));
  }

  /* ---------- brand panels: hover or focus opens a panel, leaving returns to the first ---------- */
  const panels = $$('.brands__list li');
  if (panels.length) {
    const open = (i) => panels.forEach((p, k) => p.classList.toggle('is-active', k === i));
    panels.forEach((p, i) => { p.addEventListener('mouseenter', () => open(i)); p.addEventListener('focusin', () => open(i)); });
    $('.brands__list').addEventListener('mouseleave', () => open(0));
  }

  /* ---------- faq accordion: one answer open at a time, arrows/Home/End move between questions ---------- */
  const faqItems = $$('.faq__item');
  const faqButtons = faqItems.map((item) => $('button', item));
  faqItems.forEach((item, i) => {
    const btn = faqButtons[i];
    btn.addEventListener('keydown', (e) => {
      const to = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: faqButtons.length - 1 }[e.key];
      if (to === undefined) return;
      e.preventDefault();
      faqButtons[(to + faqButtons.length) % faqButtons.length].focus();
    });
    btn.addEventListener('click', () => {
      const wasOpen = item.classList.contains('is-open');
      faqItems.forEach((o) => { o.classList.remove('is-open'); $('button', o).setAttribute('aria-expanded', 'false'); });
      if (!wasOpen) { item.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* ---------- parallax on the about image ---------- */
  if (!reduce) {
    const media = $('.concept__media'), img = $('.sw-visual__img', media);
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = media.getBoundingClientRect(), vh = innerHeight;
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      img.style.translate = '0 ' + (-Math.max(-1, Math.min(1, p)) * 34).toFixed(1) + 'px';
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* the family card's watch-movement video: plays only while on screen, never under reduced motion */
  const cardVideo = $('.card__video');
  if (cardVideo && !reduce && 'IntersectionObserver' in window) {
    cardVideo.playbackRate = 0.8;
    new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { const r = cardVideo.play(); if (r && r.catch) r.catch(() => {}); } else cardVideo.pause(); });
    }, { threshold: 0.25 }).observe(cardVideo);
  }

  window.__mastersReady = true;   /* set only when the whole script ran, so the head failsafe can tell a broken run from a good one */
})();
