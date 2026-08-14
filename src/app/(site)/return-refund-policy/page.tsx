import type { Metadata } from "next";
import ProsePage from "@/components/layout/ProsePage";

export const metadata: Metadata = { title: "Returns & Refunds — Aval Designs" };

export default function ReturnRefundPolicyPage() {
  return (
    <ProsePage title="Returns & Refunds">
      <section>
        <h2>Ready-Size Pieces</h2>
        <ul>
          <li>Returnable within 7 days of delivery, unworn, with tags intact.</li>
          <li>Refunds are issued to your original payment method within 5–7 business days of the piece reaching us.</li>
        </ul>
      </section>
      <section>
        <h2>Made-to-Measure & Custom Pieces</h2>
        <p>
          Pieces stitched to your measurements can&apos;t be returned or
          exchanged. Instead, every bridal order includes complimentary
          alterations — if the fit isn&apos;t right, we make it right.
        </p>
      </section>
      <section>
        <h2>Damaged or Incorrect Orders</h2>
        <p>
          If anything arrives damaged or isn&apos;t what you ordered, send us a
          photo within 48 hours of delivery and we&apos;ll replace it or refund
          you in full — including shipping.
        </p>
      </section>
    </ProsePage>
  );
}
