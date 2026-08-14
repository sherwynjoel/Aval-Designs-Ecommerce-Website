import type { Metadata } from "next";
import ProsePage from "@/components/layout/ProsePage";

export const metadata: Metadata = { title: "Size Guide — Aval Designs" };

const chart = [
  { size: "XS", bust: "32", waist: "26", hip: "35" },
  { size: "S", bust: "34", waist: "28", hip: "37" },
  { size: "M", bust: "36", waist: "30", hip: "39" },
  { size: "L", bust: "38", waist: "32", hip: "41" },
  { size: "XL", bust: "40", waist: "34", hip: "43" },
  { size: "XXL", bust: "42", waist: "36", hip: "45" },
];

export default function SizeGuidePage() {
  return (
    <ProsePage
      title="Size Guide"
      intro="All measurements in inches. Between sizes? Choose the larger one — or skip the chart entirely and go made-to-measure."
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-charcoal-line text-left text-xs uppercase tracking-[0.08em] text-charcoal-muted">
              <th className="py-2.5 pr-4 font-medium">Size</th>
              <th className="py-2.5 pr-4 font-medium">Bust</th>
              <th className="py-2.5 pr-4 font-medium">Waist</th>
              <th className="py-2.5 font-medium">Hip</th>
            </tr>
          </thead>
          <tbody>
            {chart.map((r) => (
              <tr key={r.size} className="border-b border-charcoal-line/50 last:border-0">
                <td className="py-2.5 pr-4 font-medium text-charcoal-ink">{r.size}</td>
                <td className="py-2.5 pr-4 tabular-nums text-charcoal-ink">{r.bust}</td>
                <td className="py-2.5 pr-4 tabular-nums text-charcoal-ink">{r.waist}</td>
                <td className="py-2.5 tabular-nums text-charcoal-ink">{r.hip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section>
        <h2>How to Measure Yourself</h2>
        <ul>
          <li><b>Bust</b> — around the fullest part, tape parallel to the floor, breathing normally.</li>
          <li><b>Waist</b> — around the natural waistline, the narrowest point above your navel.</li>
          <li><b>Hip</b> — around the fullest part of your hips, feet together.</li>
        </ul>
        <p>
          Unsure? We&apos;ll walk you through it on a video call — it takes
          twenty minutes and removes all the guesswork.
        </p>
      </section>
    </ProsePage>
  );
}
