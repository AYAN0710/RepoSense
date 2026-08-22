import React from 'react';
import { Cpu, FileCode2, GitBranch } from 'lucide-react';

const RepositoryHeader = ({ repository }) => {
  if (!repository) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-slate-800 bg-slate-900/40 select-none gap-3">
      {/* Repo title and status dot */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300">
          <FileCode2 size={16} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-100 truncate font-sans">
              {repository.name}
            </h2>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-[9px] font-semibold font-mono leading-none">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span>INDEXED</span>
            </div>
          </div>
          {repository.repository_url && (
            <a
              href={repository.repository_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-indigo-400 hover:underline font-mono truncate block mt-0.5"
            >
              {repository.repository_url}
            </a>
          )}
        </div>
      </div>

      {/* Meta indicators */}
      <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono">
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-1 rounded">
          <span className="text-slate-500">Files:</span>
          <span className="font-semibold text-slate-200">{repository.total_files || 0}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-1 rounded">
          <span className="text-slate-500">Chunks:</span>
          <span className="font-semibold text-slate-200">{repository.total_chunks || 0}</span>
        </div>
        {repository.vectors_stored !== undefined && (
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-1 rounded">
            <Cpu size={10} className="text-indigo-400/80" />
            <span className="text-slate-500">Vectors:</span>
            <span className="font-semibold text-slate-200">{repository.vectors_stored}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepositoryHeader;
