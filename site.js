// Nav, reveal-on-scroll, the scroll-scrubbed product stage, count-ups, and the early-access form. No dependencies.
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const q = new URLSearchParams(location.search);
  if (q.has('review')) document.documentElement.classList.add('review');
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('mobile-nav');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  if (toggle && nav) {
    const close = () => { toggle.setAttribute('aria-expanded', 'false'); nav.hidden = true; };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      nav.hidden = !open;
    });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !nav.hidden) { close(); toggle.focus(); } });
  }

  // Reveal on scroll
  const revealables = document.querySelectorAll('.reveal, .stagger');
  if (reduce || !('IntersectionObserver' in window)) revealables.forEach((el) => el.classList.add('in'));
  else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    revealables.forEach((el) => io.observe(el));
  }

  // Count-ups
  const counters = document.querySelectorAll('[data-count]');
  const runCount = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reduce) { el.textContent = target + suffix; return; }
    const t0 = performance.now();
    const dur = 1100;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length && 'IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { runCount(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach((el) => co.observe(el));
  } else counters.forEach(runCount);

  // Scroll-scrubbed product stage (desktop); plain loop on phones and reduced motion
  const wrap = document.querySelector('.stage-wrap');
  const video = wrap && wrap.querySelector('video');
  const phone = window.matchMedia('(max-width: 760px)').matches;
  if (wrap && video) {
    if (phone || reduce) {
      video.loop = true; video.muted = true;
      if (!reduce) video.play().catch(() => {});
    } else {
      video.pause();
      let duration = 0;
      const ready = () => { duration = video.duration || 0; update(); };
      video.addEventListener('loadedmetadata', ready);
      if (video.readyState >= 1) ready();
      let ticking = false;
      const update = () => {
        ticking = false;
        const rect = wrap.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
        wrap.style.setProperty('--p', p.toFixed(3));
        if (duration) {
          const t = p * (duration - 0.05);
          if (Math.abs(video.currentTime - t) > 0.02) video.currentTime = t;
        }
      };
      window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      window.addEventListener('resize', update);
      update();
    }
  }
  document.querySelectorAll('video[data-loop]').forEach((v) => { if (reduce) { v.removeAttribute('autoplay'); v.pause(); } else v.play().catch(() => {}); });

  // Early-access form
  const form = document.getElementById('access-form');
  if (form) {
    const status = form.querySelector('.status');
    const button = form.querySelector('button[type="submit"]');
    const endpoint = form.dataset.endpoint;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.className = 'status';
      status.textContent = '';
      const data = Object.fromEntries(new FormData(form).entries());
      data.source = document.title + ' ' + location.pathname + location.hash;
      button.disabled = true;
      const label = button.textContent;
      button.textContent = '送信しています…';
      try {
        const res = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
        const body = await res.json().catch(() => ({}));
        if (res.ok && body.ok) {
          form.reset();
          status.className = 'status ok';
          status.textContent = '受け付けました。通常 1〜2 営業日以内にメールでご連絡します。';
        } else if (res.status === 429) {
          status.className = 'status err';
          status.textContent = '送信が続きすぎています。10 分ほど空けてからもう一度お試しください。';
        } else if (body.code === 'INVALID_EMAIL') {
          status.className = 'status err';
          status.textContent = 'メールアドレスの形式をご確認ください。';
        } else {
          throw new Error(body.error || res.statusText);
        }
      } catch {
        status.className = 'status err';
        status.innerHTML = '送信できませんでした。お手数ですが <a href="mailto:yoshil061111@gmail.com?subject=Motif%20AI%20%E6%97%A9%E6%9C%9F%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9">メール</a> でご連絡ください。';
      } finally {
        button.disabled = false;
        button.textContent = label;
      }
    });
  }
})();
