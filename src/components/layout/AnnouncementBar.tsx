"use client";

import { useEffect, useState } from "react";

const messages = [
  "Complimentary alterations on all bridal orders",
  "Free shipping on orders above ₹15,000",
  "Custom measurements available on every occasion piece",
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-10 items-center justify-center bg-espresso px-4 text-center">
      <p
        key={index}
        className="animate-[fade-in_0.4s_ease-out] text-[0.7rem] font-medium uppercase tracking-[0.14em] text-ivory"
      >
        {messages[index]}
      </p>
    </div>
  );
}
