"use client";

export const TOAST_EVENT = "aval-toast";

export type ToastPayload = {
  message: string;
  actionLabel?: string;
  actionHref?: string;
};

export function toast(payload: ToastPayload) {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: payload }));
}
