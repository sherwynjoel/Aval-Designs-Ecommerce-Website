import type { Metadata } from "next";
import ProsePage from "@/components/layout/ProsePage";

export const metadata: Metadata = { title: "Privacy Policy — Aval Designs" };

export default function PrivacyPolicyPage() {
  return (
    <ProsePage
      title="Privacy Policy"
      intro="We collect only what we need to make and deliver your order, and we never sell your information."
    >
      <section>
        <h2>What We Collect</h2>
        <ul>
          <li>Contact details (name, email, phone) and delivery address when you place an order.</li>
          <li>Measurements you share for made-to-measure pieces.</li>
          <li>Order history, so we can serve you better on repeat orders.</li>
        </ul>
      </section>
      <section>
        <h2>How We Use It</h2>
        <ul>
          <li>To make, deliver, and support your order.</li>
          <li>To contact you about fittings, progress, and delivery.</li>
          <li>With your consent, to share new collections — you can opt out any time.</li>
        </ul>
      </section>
      <section>
        <h2>Your Rights</h2>
        <p>
          You can ask us to show, correct, or delete the information we hold
          about you at any time — email hello@avaldesigns.in and we&apos;ll act
          within 7 days.
        </p>
      </section>
    </ProsePage>
  );
}
