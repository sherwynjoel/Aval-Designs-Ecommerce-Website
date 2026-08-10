import Image from "next/image";
import Button from "@/components/ui/Button";

export default function CustomDesignCTA() {
  return (
    <section className="bg-espresso">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[4/3] lg:aspect-auto">
          <Image
            src="https://images.unsplash.com/photo-1572470176170-98fa8abcb741?w=1200&q=80&auto=format&fit=crop"
            alt="Fabric and design details being selected for a custom garment"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center px-6 py-16 lg:px-16 lg:py-0">
          <h2 className="max-w-md font-display text-4xl font-medium leading-tight text-ivory lg:text-5xl">
            Your Style. Your Measurements. Your Design.
          </h2>
          <p className="mt-6 max-w-sm text-ivory/75">
            Create a piece that&apos;s made specifically for you — choose your
            fabric, silhouette, and detailing, then send us your measurements
            or book a fitting.
          </p>
          <div className="mt-9">
            <Button href="/custom-design" variant="on-dark">
              Create Your Design
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
