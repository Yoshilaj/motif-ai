// Menu, video fallback and the early-access form. No dependencies.
(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('mobile-nav');
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

  const video = document.querySelector('.hero-media video');
  if (video) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { video.removeAttribute('autoplay'); video.pause(); }
    else video.play().catch(() => {});
  }

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
        status.innerHTML = '送信できませんでした。お手数ですが <a class="text-link" href="mailto:yoshil061111@gmail.com?subject=Motif%20AI%20%E6%97%A9%E6%9C%9F%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9">メール</a> でご連絡ください。';
      } finally {
        button.disabled = false;
        button.textContent = label;
      }
    });
  }
})();
