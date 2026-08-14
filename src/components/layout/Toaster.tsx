"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TOAST_EVENT, type ToastPayload } from "@/lib/toast";

type ActiveToast = ToastPayload & { id: number };

export default function Toaster() {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);
  const nextId = useRef(1);

  useEffect(() => {
    const onToast = (e: Event) => {
      const detail = (e as CustomEvent<ToastPayload>).detail;
      const id = nextId.current++;
      setToasts((t) => [...t.slice(-2), { ...detail, id }]);
      window.setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, 3500);
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex flex-col items-center gap-2 px-4 lg:bottom-8"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-4 bg-espresso px-5 py-3.5 text-sm text-ivory shadow-modal-scrim motion-safe:animate-[rise-in_0.3s_cubic-bezier(0.25,1,0.5,1)]"
        >
          <span>{t.message}</span>
          {t.actionHref && t.actionLabel && (
            <Link
              href={t.actionHref}
              className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.12em] text-gold underline-offset-4 hover:underline"
            >
              {t.actionLabel}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
