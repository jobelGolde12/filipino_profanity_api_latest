interface SectionHeaderProps {
  title: string;
  description?: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">{title}</h2>
      {description && (
        <p className="mt-2 text-[var(--text-secondary)] max-w-2xl">{description}</p>
      )}
    </div>
  );
}
