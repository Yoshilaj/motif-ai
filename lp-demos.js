// Feature-card demos (lp-demos.css): each .dm stage plays a short story by stepping data-step on a schedule,
// loops while the deck is on screen, and restarts from the top when its card is hovered or focused.
document.addEventListener("DOMContentLoaded", () => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const W = 520, H = 340;

  // [ms, step] pairs, plus typing and the playhead/timecode run. loop = total length before it starts again.
  const scripts = {
    // icon pulled into the chat → link → video → prompt → three thinking lines → done → animated rewind
    style: { loop: 11600, soft: true, steps: [[900, 1], [1850, 2], [2350, 3], [3050, 4], [5000, 5], [5300, 6], [8100, 7], [10300, 8]],
             type: { at: 3150, dur: 1500 }, subs: [[5300, 0], [6250, 1], [7200, 2]], clearAt: 10900, final: 7 },
    // springs in track by track → done → playhead pass (clips light up) → playhead glides home, clips leave in reverse
    cut: { loop: 11200, soft: true, steps: [[300, 1], [700, 2], [1500, 3], [2100, 4], [2600, 5], [3700, 6], [4000, 7], [9500, 8]],
           play: { at: 4300, dur: 4600 }, back: { at: 9500, dur: 1000 }, final: 7 },
    // drag a box around the caption → ask popup → type → 送信 → caption fixed → animated rewind
    revise: { loop: 11000, soft: true, steps: [[400, 1], [1100, 2], [2150, 3], [2550, 4], [4300, 5], [4800, 6], [6100, 7], [9600, 8]],
              type: { at: 2650, dur: 1500 }, click: [1100, 4800], clearAt: 6800, final: 7 },
  };

  const demos = [...document.querySelectorAll(".feature-media[data-demo]")].map((media) => {
    const stage = media.querySelector(".dm");
    const script = scripts[media.dataset.demo];
    if (!stage || !script) return null;
    const typed = stage.querySelector(".d-typed");
    const text = typed ? typed.dataset.text : "";
    const tc = stage.querySelector(".d2-tc");
    const head = stage.querySelector(".d2-playhead");
    const lane = stage.querySelector(".d2-lane");
    let timers = [], raf = 0, running = false;

    const later = (ms, fn) => timers.push(setTimeout(fn, ms));
    const clear = () => { timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf); };
    const setStep = (n) => { stage.dataset.step = String(n); };
    const clips = [...stage.querySelectorAll(".d2-lane > i")];
    const setPlay = (p) => {
      if (!head) return;
      const x = p * lane.offsetWidth * 0.85;
      head.style.setProperty("--px", `${x}px`);
      clips.forEach((c) => c.classList.toggle("on", p > 0 && p < 1 && !c.classList.contains("k-bgm") && x >= c.offsetLeft && x <= c.offsetLeft + c.offsetWidth));
      const f = Math.round(p * 51 * 30), s = Math.floor(f / 30);
      tc.textContent = `00:00:${String(s).padStart(2, "0")}:${String(f % 30).padStart(2, "0")}`;
    };

    function reset() {
      stage.classList.add("dm-hard");
      setStep(0); stage.removeAttribute("data-typing");
      if (typed) typed.textContent = "";
      stage.removeAttribute("data-typed"); stage.dataset.sub = "0";
      setPlay(0);
      void stage.offsetWidth;
      stage.classList.remove("dm-hard");
    }

    function showFinal() {
      clear(); stage.classList.add("dm-hard");
      setStep(script.final); if (typed) { typed.textContent = text; stage.dataset.typed = ""; }
      if (head) { stage.dataset.step = "6"; setPlay(0); }
      void stage.offsetWidth; stage.classList.remove("dm-hard");
    }

    function run(soft) {
      clear(); if (soft) setStep(0); else reset();
      script.steps.forEach(([ms, n]) => later(ms, () => setStep(n)));
      (script.click || []).forEach((ms) => later(ms, () => { stage.dataset.click = ""; later(160, () => stage.removeAttribute("data-click")); }));
      if (script.type && typed) {
        const { at, dur } = script.type, chars = [...text];
        later(at, () => stage.dataset.typing = "");
        chars.forEach((_, i) => later(at + (dur * (i + 1)) / chars.length, () => { typed.textContent = chars.slice(0, i + 1).join(""); stage.dataset.typed = ""; }));
        later(at + dur + 500, () => stage.removeAttribute("data-typing"));
      }
      (script.subs || []).forEach(([ms, n]) => later(ms, () => { stage.dataset.sub = String(n); }));
      if (script.clearAt && typed) later(script.clearAt, () => { typed.textContent = ""; stage.removeAttribute("data-typed"); stage.dataset.sub = "0"; });
      const ease = (p) => (p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
      if (script.back) {
        later(script.back.at, () => {
          cancelAnimationFrame(raf);
          const t0 = performance.now();
          const tick = (now) => {
            const p = Math.min(1, (now - t0) / script.back.dur);
            setPlay(1 - ease(p) || 0);
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        });
      }
      if (script.play) {
        later(script.play.at, () => {
          const t0 = performance.now();
          const tick = (now) => {
            const p = Math.min(1, (now - t0) / script.play.dur);
            setPlay(p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        });
      }
      // start over: a soft script has already animated back to its first frame; the others fade out and reset
      if (script.soft) { later(script.loop, () => { if (running) run(true); }); return; }
      later(script.loop - 350, () => stage.classList.add("dm-out"));
      later(script.loop, () => { stage.classList.remove("dm-out"); if (running) run(); });
    }

    const start = () => { if (reduced) return showFinal(); if (!running) { running = true; run(); } };
    const stop = () => { running = false; clear(); };
    const restart = () => {
      if (reduced) return;
      running = true; clear();
      stage.classList.add("dm-out");
      later(260, () => { stage.classList.remove("dm-out"); run(); });
    };

    // scale the 520×340 design to the card; it follows the card's width while the deck resizes
    const fit = () => {
      const w = media.clientWidth, h = media.clientHeight;
      const s = Math.max(0.5, Math.min((w * 0.92) / W, (h * 0.9) / H, 1.15));
      stage.style.setProperty("--s", s.toFixed(4));
    };
    new ResizeObserver(fit).observe(media);
    fit();

    const card = media.closest(".feature-card");
    if (card) {
      card.addEventListener("mouseenter", restart);
      card.addEventListener("focusin", (e) => { if (!card.contains(e.relatedTarget)) restart(); });
    }
    showFinal();
    return { media, start, stop };
  }).filter(Boolean);

  // play only while the deck is on screen
  const deck = document.querySelector(".feature-deck");
  if (!deck || !demos.length) return;
  new IntersectionObserver(([entry]) => {
    demos.forEach((d, i) => entry.isIntersecting ? setTimeout(d.start, i * 600) : d.stop());
  }, { threshold: 0.25 }).observe(deck);
});

// Scroll reveal: each group's heading first, then its cards rise in one after another.
(() => {
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const groups = [
    ["#features .feature-heading", 0], ["#features .feature-card", 130],
    ["#how .section-heading", 0], ["#how .flow", 0], ["#how .glass-card", 70],
  ];
  const els = [];
  for (const [sel, step] of groups) {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add("rv");
      el.style.setProperty("--rv", String(i * step + (sel.endsWith(".flow") ? 120 : 0)));
      els.push(el);
    });
  }
  document.documentElement.classList.add("rv-on");
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
  els.forEach((el) => io.observe(el));
})();
