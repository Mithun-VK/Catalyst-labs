import { cn } from "@/lib/cn";

/**
 * SENSOR ARRAY - the AI page's signature visual.
 *
 * A lidar-style array: concentric range rings, a bearing scale, a sweep that
 * rotates continuously, and contacts that light as the sweep reaches them.
 *
 * A SERVER component. There is no canvas, no rAF loop and no JavaScript at
 * all - the sweep is a rotating conic gradient and the contacts are delayed
 * CSS pulses. Everything animates transform and opacity only, so the array
 * composites on the GPU and cannot trigger layout while the page scrolls.
 * Compared with the particle field this replaced on the old page, it costs
 * roughly nothing and says something far more specific.
 *
 * WHY A SENSOR, NOT A NEURAL NET. The usual AI illustration is a glowing node
 * graph, which is both a cliche and a lie about what this work is: none of
 * these systems are neural architecture diagrams, they are pipelines that
 * observe something, decide, and act. A sensor sweep says "this system is
 * watching your operation continuously" - which is exactly what an automation
 * does, and exactly the claim the page is making.
 *
 * Decorative and hidden from assistive tech; the page states everything this
 * conveys in text.
 */

/* Fixed contacts rather than random positions: the same array renders on the
   server and the client, and a designer can reason about the composition. */
const CONTACTS = [
  { x: 128, y: 74, delay: 0 },
  { x: 172, y: 128, delay: 0.45 },
  { x: 118, y: 172, delay: 0.9 },
  { x: 70, y: 118, delay: 1.35 },
  { x: 156, y: 92, delay: 1.8 },
  { x: 92, y: 148, delay: 2.25 },
] as const;

export function SensorArray({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative aspect-square w-full", className)}
    >
      <svg
        viewBox="0 0 240 240"
        fill="none"
        className="absolute inset-0 h-full w-full text-signal"
        focusable="false"
      >
        {/* Range rings */}
        <g stroke="currentColor" fill="none">
          <circle cx="120" cy="120" r="112" opacity="0.16" />
          <circle cx="120" cy="120" r="84" opacity="0.13" />
          <circle cx="120" cy="120" r="56" opacity="0.1" />
          <circle cx="120" cy="120" r="28" opacity="0.08" />
        </g>

        {/* Bearing crosshairs */}
        <g stroke="currentColor" opacity="0.14">
          <path d="M120 8v224M8 120h224" />
          <path d="M41 41l158 158M199 41L41 199" opacity="0.6" />
        </g>

        {/* Bearing scale: 24 ticks, alternating length, breathing on a
            stagger so the ring reads as sampling rather than static. */}
        <g stroke="currentColor">
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i * 15 * Math.PI) / 180;
            const long = i % 3 === 0;
            const r1 = long ? 100 : 106;
            return (
              <line
                key={i}
                x1={120 + Math.cos(a) * r1}
                y1={120 + Math.sin(a) * r1}
                x2={120 + Math.cos(a) * 112}
                y2={120 + Math.sin(a) * 112}
                strokeWidth={long ? 1.4 : 1}
                className="sensor-tick"
                style={{ ["--tick-delay" as string]: `${(i % 8) * 0.16}s` }}
              />
            );
          })}
        </g>

        {/* Centre mark */}
        <circle cx="120" cy="120" r="3" fill="currentColor" opacity="0.8" />
      </svg>

      {/* The sweep. Its own layer so the rotation never touches the SVG. */}
      <div className="sensor-sweep" />

      {/* Contacts, positioned as a percentage of the 240-unit box so they
          track the SVG at any size. */}
      {CONTACTS.map((c) => (
        <span
          key={`${c.x}-${c.y}`}
          className="sensor-blip"
          style={{
            left: `${(c.x / 240) * 100}%`,
            top: `${(c.y / 240) * 100}%`,
            ["--blip-delay" as string]: `${c.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
