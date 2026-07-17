interface SectionHeaderProps {
  title: string;
  description?: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="mb-12">
      <h2
        className="text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-[var(--text-secondary)] max-w-xl">{description}</p>
      )}
    </div>
  );
}
