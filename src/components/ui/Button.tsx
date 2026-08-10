import Link from "next/link";
import type { ComponentPropsWithoutRef, ElementType } from "react";

type Variant = "primary" | "secondary" | "on-dark";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-charcoal-ink text-ivory hover:bg-espresso focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory",
  secondary:
    "bg-transparent text-charcoal-ink border border-charcoal-ink hover:bg-charcoal-ink hover:text-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal-ink",
  "on-dark":
    "bg-ivory text-espresso hover:bg-ivory-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory",
};

const base =
  "inline-flex items-center justify-center px-11 py-[18px] text-xs font-medium uppercase tracking-[0.14em] transition-colors duration-200 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer select-none";

type ButtonProps = {
  variant?: Variant;
  href?: string;
} & ComponentPropsWithoutRef<"button">;

export default function Button({
  variant = "primary",
  href,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = `${base} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const Comp = "button" as ElementType;
  return (
    <Comp className={classes} {...props}>
      {children}
    </Comp>
  );
}
