"use client";

import { useMemo, useRef, useState } from "react";

type Point = { date: string; revenue: number };

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const W = 720;
const H = 220;
const PAD_LEFT = 8;
const PAD_RIGHT = 8;
const PAD_TOP = 12;
const PAD_BOTTOM = 24;

export default function SalesChart({ data }: { data: Point[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const max = Math.max(...data.map((d) => d.revenue), 1);
  const plotW = W - PAD_LEFT - PAD_RIGHT;
  const plotH = H - PAD_TOP - PAD_BOTTOM;

  const points = useMemo(
    () =>
      data.map((d, i) => {
        const x = PAD_LEFT + (i / Math.max(data.length - 1, 1)) * plotW;
        const y = PAD_TOP + plotH - (d.revenue / max) * plotH;
        return { x, y, ...d };
      }),
    [data, max, plotW, plotH]
  );

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1]?.x ?? 0},${PAD_TOP + plotH} L${points[0]?.x ?? 0},${PAD_TOP + plotH} Z`;

  const gridLines = [0, 0.5, 1];

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * W;
    let closest = 0;
    let closestDist = Infinity;
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - relX);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setHoverIndex(closest);
  }

  const hovered = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div className="bg-ivory p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-charcoal-ink">
          Sales, last {data.length} days
        </h3>
        <button
          type="button"
          onClick={() => setShowTable((s) => !s)}
          className="text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted transition-colors hover:text-charcoal-ink cursor-pointer"
        >
          {showTable ? "View chart" : "View as table"}
        </button>
      </div>

      {showTable ? (
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-charcoal-line text-left text-xs uppercase tracking-[0.08em] text-charcoal-muted">
                <th className="py-2 font-medium">Date</th>
                <th className="py-2 font-medium text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.date} className="border-b border-charcoal-line/50">
                  <td className="py-1.5 text-charcoal-ink">{d.date}</td>
                  <td className="py-1.5 text-right tabular-nums text-charcoal-ink">
                    {inr.format(d.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            onMouseMove={handleMove}
            onMouseLeave={() => setHoverIndex(null)}
            role="img"
            aria-label={`Sales over the last ${data.length} days`}
          >
            {gridLines.map((g) => (
              <line
                key={g}
                x1={PAD_LEFT}
                x2={W - PAD_RIGHT}
                y1={PAD_TOP + plotH * (1 - g)}
                y2={PAD_TOP + plotH * (1 - g)}
                stroke="oklch(0.850 0.012 60)"
                strokeWidth={1}
              />
            ))}

            <path d={areaPath} fill="oklch(0.560 0.105 75)" opacity={0.1} stroke="none" />
            <path d={linePath} fill="none" stroke="oklch(0.560 0.105 75)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

            {hovered && (
              <>
                <line
                  x1={hovered.x}
                  x2={hovered.x}
                  y1={PAD_TOP}
                  y2={PAD_TOP + plotH}
                  stroke="oklch(0.850 0.012 60)"
                  strokeWidth={1}
                />
                <circle cx={hovered.x} cy={hovered.y} r={4} fill="oklch(0.560 0.105 75)" stroke="oklch(0.970 0.012 75)" strokeWidth={2} />
              </>
            )}
          </svg>

          {hovered && (
            <div
              className="pointer-events-none absolute top-0 -translate-x-1/2 -translate-y-full bg-espresso px-3 py-2 text-xs text-ivory whitespace-nowrap"
              style={{ left: `${(hovered.x / W) * 100}%` }}
            >
              <div className="text-ivory/60">{hovered.date}</div>
              <div className="font-medium">{inr.format(hovered.revenue)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
