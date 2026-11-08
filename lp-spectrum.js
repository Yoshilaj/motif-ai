// The hero's light closes by reversing itself: a mirrored, compressed copy of the spectrum sits under
// the original, so the colours run dark → blue → white → warm, then back warm → white → blue → dark.
// Both halves live in one group whose opacity is applied once, so their overlap at the hinge is invisible.
document.addEventListener("DOMContentLoaded", () => {
  const src = document.querySelector(".hero-spectrum");
  if (!src) return;
  const group = document.createElement("div");
  group.className = "hero-light";
  group.setAttribute("aria-hidden", "true");
  src.before(group);
  const mirror = src.cloneNode(true);
  mirror.classList.add("hero-spectrum--mirror");
  mirror.querySelectorAll("i").forEach((star) => star.remove());
  group.append(src, mirror);
});
