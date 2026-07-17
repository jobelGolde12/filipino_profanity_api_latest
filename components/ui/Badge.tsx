import { HTMLAttributes, forwardRef } from "react";

type BadgeVariant = "default" | "accent" | "success" | "warning" | "error" | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--bg-alt)] text-[var(--text-tertiary)] border-[var(--border-subtle)]",
  accent: "bg-[var(--accent-muted)] text-[var(--accent)] border-[var(--accent)]/10",
  success: "bg-[var(--success-muted)] text-[var(--success)] border-[var(--success)]/10",
  warning: "bg-[var(--warning-muted)] text-[var(--warning)] border-[var(--warning)]/10",
  error: "bg-[var(--error-muted)] text-[var(--error)] border-[var(--error)]/10",
  info: "bg-[var(--info-muted)] text-[var(--info)] border-[var(--info)]/10",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-[var(--text-muted)]",
  accent: "bg-[var(--accent)]",
  success: "bg-[var(--success)]",
  warning: "bg-[var(--warning)]",
  error: "bg-[var(--error)]",
  info: "bg-[var(--info)]",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", dot = false, className = "", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-[var(--radius-pill)] border ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
