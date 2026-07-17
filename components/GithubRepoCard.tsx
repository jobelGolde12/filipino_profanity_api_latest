import { Github, ExternalLink } from "lucide-react";

interface GithubRepoCardProps {
  repoUrl: string;
  repoName: string;
  description: string;
  stars: number;
  forks: number;
}

export function GithubRepoCard({ repoUrl, repoName, description, stars, forks }: GithubRepoCardProps) {
  return (
    <a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] transition-colors duration-150 hover:border-[var(--border-default)]"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center bg-[var(--bg-elevated)] rounded-[var(--radius-md)]">
            <Github className="w-4.5 h-4.5 text-[var(--text-secondary)]" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--text-primary)]">{repoName}</h3>
            <p className="text-xs text-[var(--text-muted)]">View Source Code</p>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-[var(--text-muted)]" />
      </div>

      <p className="text-sm text-[var(--text-tertiary)] mb-3">{description}</p>

      <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-[var(--warning)] rounded-full" />
          {stars.toLocaleString()} stars
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-[var(--info)] rounded-full" />
          {forks.toLocaleString()} forks
        </span>
      </div>
    </a>
  );
}
