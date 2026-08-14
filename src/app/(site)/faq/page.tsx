import type { Metadata } from "next";
import ProsePage from "@/components/layout/ProsePage";

export const metadata: Metadata = { title: "FAQ — Aval Designs" };

const faqs = [
  {
    q: "How long does a made-to-order piece take?",
    a: "Ready sizes dispatch in 3–5 days. Made-to-measure and custom pieces take 2–3 weeks depending on embroidery work — we confirm a date before stitching begins.",
  },
  {
    q: "How do measurements work if I can't visit?",
    a: "We guide you through every measurement on a video call — it takes about 20 minutes with a measuring tape. Each measurement is confirmed before fabric is cut.",
  },
  {
    q: "Can I customize a piece from the collection?",
    a: "Most pieces marked Customizable can be adjusted — neckline, sleeves, length, blouse style, and full made-to-measure sizing. Start from the product page or message us.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Cash on Delivery is available on all orders today; online payment (UPI and cards) is coming soon.",
  },
  {
    q: "What is your return policy?",
    a: "Ready-size pieces can be returned within 7 days, unworn with tags. Made-to-measure and custom pieces can't be returned, but we offer complimentary alterations on bridal orders.",
  },
  {
    q: "Do you ship across India?",
    a: "Yes — shipping is free on orders above ₹15,000, and ₹250 otherwise. International shipping is available on request.",
  },
];

export default function FaqPage() {
  return (
    <ProsePage title="Frequently Asked Questions">
      {faqs.map((f) => (
        <section key={f.q}>
          <h2>{f.q}</h2>
          <p>{f.a}</p>
        </section>
      ))}
    </ProsePage>
  );
}
