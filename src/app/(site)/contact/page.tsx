import type { Metadata } from "next";
import ProsePage from "@/components/layout/ProsePage";

export const metadata: Metadata = { title: "Contact Us — Aval Designs" };

export default function ContactPage() {
  return (
    <ProsePage
      title="Contact Us"
      intro="For orders, fittings, custom designs, or anything else — we answer personally, usually within a few hours."
    >
      <section>
        <h2>WhatsApp</h2>
        <p>
          The fastest way to reach us:{" "}
          <a href="https://wa.me/919000000000" className="underline underline-offset-2 hover:text-rose-deep">
            +91 90000 00000
          </a>
        </p>
      </section>
      <section>
        <h2>Email</h2>
        <p>
          <a href="mailto:hello@avaldesigns.in" className="underline underline-offset-2 hover:text-rose-deep">
            hello@avaldesigns.in
          </a>
        </p>
      </section>
      <section>
        <h2>Atelier Hours</h2>
        <p>Monday to Saturday, 10:00 AM – 7:00 PM IST. Fittings by appointment.</p>
      </section>
    </ProsePage>
  );
}
