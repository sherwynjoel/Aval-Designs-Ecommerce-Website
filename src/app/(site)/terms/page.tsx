import type { Metadata } from "next";
import ProsePage from "@/components/layout/ProsePage";

export const metadata: Metadata = { title: "Terms & Conditions — Aval Designs" };

export default function TermsPage() {
  return (
    <ProsePage title="Terms & Conditions">
      <section>
        <h2>Orders</h2>
        <p>
          An order is confirmed once you receive an order number. For
          made-to-measure pieces, measurements you confirm before stitching are
          the measurements we make to — please double-check them with us on the
          confirmation call.
        </p>
      </section>
      <section>
        <h2>Pricing</h2>
        <p>
          All prices are in Indian Rupees and include the piece as described on
          the product page. Customization charges, where applicable, are agreed
          in writing before work begins.
        </p>
      </section>
      <section>
        <h2>Intellectual Property</h2>
        <p>
          Designs, photography, and content on this site belong to Aval Designs
          and may not be reproduced without permission.
        </p>
      </section>
      <section>
        <h2>Questions</h2>
        <p>Anything unclear? Write to hello@avaldesigns.in.</p>
      </section>
    </ProsePage>
  );
}
