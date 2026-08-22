import React from 'react';
import { Database, Folder, Plus, Code2 } from 'lucide-react';

const Sidebar = ({
  repositories = [],
  selectedRepositoryId,
  onSelectRepository,
  onNewRepository,
}) => {
  return (
    <aside className="w-60 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0 select-none">
      {/* Branding */}
      <div
        onClick={onNewRepository}
        className="p-4 border-b border-slate-800 flex items-center gap-2.5 cursor-pointer hover:bg-slate-800/40 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.15)] shrink-0">
          <Code2 size={16} />
        </div>
        <div>
          <h1 className="font-extrabold text-slate-100 tracking-wide text-sm font-sans">
            <span>Repo</span>
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Sense</span>
          </h1>
        </div>
      </div>

      {/* Action Area */}
      <div className="p-3">
        <button
          onClick={onNewRepository}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-750 text-slate-200 hover:text-white rounded-md text-xs font-medium transition-all group duration-150"
        >
          <Plus size={14} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
          <span>New Repository</span>
        </button>
      </div>

      {/* Repositories List */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1 scrollbar-thin">
        <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 tracking-wider uppercase font-mono">
          Repositories
        </div>

        {repositories.length === 0 ? (
          <div className="p-4 text-center text-[11px] text-slate-500 font-mono">
            No active projects
          </div>
        ) : (
          repositories.map((repo) => {
            const isSelected = repo.repository_id === selectedRepositoryId;
            return (
              <button
                key={repo.repository_id}
                onClick={() => onSelectRepository(repo.repository_id)}
                className={`w-full flex items-start gap-3 p-2.5 rounded-md text-left transition-all duration-150 group ${isSelected
                    ? 'bg-slate-800 border border-slate-700/80 text-white shadow-sm'
                    : 'text-slate-400 border border-transparent hover:bg-slate-800/30 hover:text-slate-200'
                  }`}
              >
                <div className={`mt-0.5 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
                  <Folder size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium truncate leading-tight font-sans">
                    {repo.name}
                  </div>
                  {repo.total_files !== undefined && (
                    <div className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1.5 leading-none">
                      <span>{repo.total_files} files</span>
                      <span className="text-slate-700">•</span>
                      <span>{repo.total_chunks} chunks</span>
                    </div>
                  )}
                </div>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 self-center shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800/60 bg-slate-900/60 text-[10px] text-slate-500 font-mono flex items-center justify-between">
        <span>v1.0.0</span>
        <span className="flex items-center gap-1">
          <Database size={10} className="text-indigo-500/60" /> Qdrant Indexed
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;
