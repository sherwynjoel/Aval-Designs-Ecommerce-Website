"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label="View photo fullscreen"
        className="group relative block aspect-[3/4] w-full cursor-zoom-in overflow-hidden bg-beige-surface"
      >
        <Image
          key={images[active]}
          src={images[active]}
          alt={`${name}, photo ${active + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
        />
        <span className="absolute bottom-3 right-3 bg-ivory/90 px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-charcoal-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Click to zoom
        </span>
      </button>

      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-[3/4] w-20 overflow-hidden bg-beige-surface transition-opacity ${
                i === active ? "ring-1 ring-charcoal-ink" : "opacity-70 hover:opacity-100"
              } cursor-pointer`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <dialog
        ref={dialogRef}
        aria-label={`${name} fullscreen photo`}
        onClick={(e) => {
          // click on the backdrop (the dialog element itself) closes
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto h-[92svh] w-auto max-w-[95vw] bg-transparent backdrop:bg-espresso-deep/90"
      >
        <div className="relative h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[active]}
            alt={`${name}, fullscreen`}
            className="h-full w-auto max-w-full object-contain"
          />
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="absolute top-3 right-3 bg-ivory px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-charcoal-ink cursor-pointer"
          >
            Close
          </button>
        </div>
      </dialog>
    </div>
  );
}
