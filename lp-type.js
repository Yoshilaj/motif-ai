/* Hero title: types the second half once, with a thin caret, like a prompt being written.
   The full title is in the HTML (no-JS, crawlers, reduced motion keep it as is). */
(function () {
  var el = document.querySelector('.hero-type');
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var text = el.textContent, chars = Array.from(text), i = 0;
  var out = document.createElement('span'), caret = document.createElement('span');
  caret.className = 'type-caret';
  el.textContent = ''; el.append(out, caret);
  el.classList.add('is-typing');
  function step() {
    out.textContent = chars.slice(0, ++i).join('');
    if (i < chars.length) return setTimeout(step, 110 + Math.random() * 70);
    el.classList.remove('is-typing');
    setTimeout(function () { caret.classList.add('is-done'); }, 3200);
  }
  setTimeout(step, 650);
})();
