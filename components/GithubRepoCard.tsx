import { Github, ExternalLink } from "lucide-react";

interface GithubRepoCardProps {
  repoUrl: string;
  repoName: string;
  description: string;
}

export function GithubRepoCard({ repoUrl, repoName, description }: GithubRepoCardProps) {
  return (
    <a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] transition-colors duration-200 hover:border-[var(--border-default)]"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-[var(--bg-alt)] rounded-[var(--radius-md)]">
            <Github className="w-4 h-4 text-[var(--text-secondary)]" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--text-primary)]">{repoName}</h3>
            <p className="text-xs text-[var(--text-muted)]">Open source</p>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-[var(--text-muted)]" />
      </div>

      <p className="text-sm text-[var(--text-tertiary)]">{description}</p>
    </a>
  );
}
