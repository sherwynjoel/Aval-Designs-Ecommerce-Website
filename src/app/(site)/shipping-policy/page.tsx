import type { Metadata } from "next";
import ProsePage from "@/components/layout/ProsePage";

export const metadata: Metadata = { title: "Shipping Policy — Aval Designs" };

export default function ShippingPolicyPage() {
  return (
    <ProsePage title="Shipping Policy">
      <section>
        <h2>Timelines</h2>
        <ul>
          <li>Ready-size pieces dispatch within 3–5 business days.</li>
          <li>Made-to-measure and custom pieces dispatch in 2–3 weeks; we confirm your date before stitching begins.</li>
          <li>Delivery takes 2–6 business days after dispatch depending on your city.</li>
        </ul>
      </section>
      <section>
        <h2>Charges</h2>
        <ul>
          <li>Free shipping on all orders above ₹15,000.</li>
          <li>A flat ₹250 on orders below that.</li>
          <li>International shipping is available on request — message us for a quote.</li>
        </ul>
      </section>
      <section>
        <h2>Tracking</h2>
        <p>
          Every order has an order number (AV-XXXXXX) you can check any time on
          our Track Order page. We also send updates at each stage — stitching,
          quality check, dispatch, and delivery.
        </p>
      </section>
    </ProsePage>
  );
}
