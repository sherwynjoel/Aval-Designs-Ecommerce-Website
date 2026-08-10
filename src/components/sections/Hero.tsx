import Image from "next/image";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative flex h-[92svh] min-h-[560px] w-full items-end overflow-hidden bg-espresso">
      <div className="absolute inset-0 overflow-hidden motion-safe:[animation:hero-zoom_16s_ease-out_forwards]">
        <Image
          src="https://images.unsplash.com/photo-1654764746225-e63f5e90facd?w=1800&q=85&auto=format&fit=crop"
          alt="Bride in an embroidered silk lehenga, golden hour editorial portrait"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-espresso-deep/80 via-espresso-deep/10 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-16 lg:px-12 lg:pb-24">
        <p className="reveal mb-4 text-xs font-medium uppercase tracking-[0.2em] text-ivory/80">
          Bridal &amp; Occasion Wear
        </p>
        <h1 className="reveal max-w-2xl font-display text-5xl font-medium leading-[1.05] text-ivory sm:text-6xl lg:text-7xl [animation-delay:80ms]">
          Timeless Elegance, Designed for You
        </h1>
        <p className="reveal mt-6 max-w-md text-base leading-relaxed text-ivory/80 [animation-delay:160ms]">
          Discover thoughtfully designed occasion wear, tailored to your exact
          measurements and crafted to make every moment unforgettable.
        </p>
        <div className="reveal mt-9 flex flex-wrap gap-4 [animation-delay:240ms]">
          <Button href="/shop" variant="on-dark">
            Shop Collection
          </Button>
          <Button href="/new-arrivals" variant="secondary" className="border-ivory text-ivory hover:bg-ivory hover:text-espresso">
            Explore New Arrivals
          </Button>
        </div>
      </div>
    </section>
  );
}
