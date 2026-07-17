import { HTMLAttributes, forwardRef } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)]",
  success: "bg-[var(--success-muted)] text-[var(--success)] border-[var(--success)]/15",
  warning: "bg-[var(--warning-muted)] text-[var(--warning)] border-[var(--warning)]/15",
  danger: "bg-[var(--danger-muted)] text-[var(--danger)] border-[var(--danger)]/15",
  info: "bg-[var(--info-muted)] text-[var(--info)] border-[var(--info)]/15",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-[var(--text-muted)]",
  success: "bg-[var(--success)]",
  warning: "bg-[var(--warning)]",
  danger: "bg-[var(--danger)]",
  info: "bg-[var(--info)]",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", dot = false, className = "", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
