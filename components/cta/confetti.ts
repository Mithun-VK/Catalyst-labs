/**
 * Comic-sticker confetti for the Works page call to action. Pure Web
 * Animations API: elements are created, flown out from `origin`, and removed
 * when they finish, so nothing lingers in the DOM. A no-op under reduced
 * motion.
 */
const COLOURS = ["#ff5b28", "#ccff00", "#ff2e88", "#2b3aff", "#5ce4b0", "#ffe500"];

export function burst(origin: HTMLElement, count = 22): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const rect = origin.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    const size = 8 + Math.random() * 10;
    const shape = i % 3; // 0 square, 1 circle, 2 bar
    piece.setAttribute("aria-hidden", "true");
    Object.assign(piece.style, {
      position: "fixed",
      left: `${cx}px`,
      top: `${cy}px`,
      width: `${shape === 2 ? size * 1.8 : size}px`,
      height: `${shape === 2 ? size * 0.45 : size}px`,
      background: COLOURS[i % COLOURS.length],
      border: "2px solid #0a0a0a",
      borderRadius: shape === 1 ? "50%" : "2px",
      pointerEvents: "none",
      zIndex: "9999",
    });
    document.body.appendChild(piece);

    const angle = Math.random() * Math.PI * 2;
    const distance = 90 + Math.random() * 160;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 60;
    const spin = (Math.random() - 0.5) * 720;

    const animation = piece.animate(
      [
        { transform: "translate(-50%, -50%) rotate(0deg) scale(0.4)", opacity: 1 },
        {
          transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${spin / 2}deg) scale(1)`,
          opacity: 1,
          offset: 0.55,
        },
        {
          transform: `translate(calc(-50% + ${dx * 1.15}px), calc(-50% + ${dy + 120}px)) rotate(${spin}deg) scale(0.9)`,
          opacity: 0,
        },
      ],
      { duration: 900 + Math.random() * 400, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    );
    animation.onfinish = () => piece.remove();
  }
}
