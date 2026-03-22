"use client";

import { motion } from "framer-motion";
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
    <motion.a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="block w-full max-w-md mx-auto p-6 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-800 rounded-lg">
            <Github className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{repoName}</h3>
            <p className="text-sm text-zinc-500">View Source Code</p>
          </div>
        </div>
        <ExternalLink className="w-5 h-5 text-zinc-500" />
      </div>

      <p className="text-zinc-400 mb-4">{description}</p>

      <div className="flex items-center gap-4 text-sm text-zinc-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-yellow-500 rounded-full" />
          {stars.toLocaleString()} stars
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-blue-500 rounded-full" />
          {forks.toLocaleString()} forks
        </span>
      </div>
    </motion.a>
  );
}
