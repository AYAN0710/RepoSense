import React, { useState } from 'react';
import { Bug, AlertTriangle, Play, Loader2 } from 'lucide-react';
import BugCard from './BugCard';

const BugScanner = ({
  bugs = [],
  onScanBugs,
  loading = false,
  scanned = false,
}) => {
  const [customQuery, setCustomQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    onScanBugs(customQuery.trim() || undefined);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 font-sans p-6 overflow-y-auto scrollbar-thin text-left">
      {/* Header and Description */}
      <div className="max-w-3xl mx-auto w-full mb-6 select-none">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded bg-rose-950/40 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <Bug size={14} />
          </div>
          <h2 className="text-sm font-bold text-slate-100 font-sans">Bug Scanner</h2>
        </div>
        <p className="text-xs text-slate-400 leading-normal">
          Evaluate file semantics, variable logic, and security leaks. RepoSense checks semantic code blocks for potential runtime issues.
        </p>
      </div>

      {/* Query Form */}
      <div className="max-w-3xl mx-auto w-full mb-8">
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-2">
              Focus / Custom Scan Scope (Optional)
            </label>
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              disabled={loading}
              placeholder="e.g. Review the authentication module for potential bugs."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 text-slate-100 placeholder-slate-650 rounded-md py-2.5 px-3.5 text-xs outline-none transition-all disabled:opacity-50 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 py-2 px-4 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-md text-xs font-semibold shadow-md shadow-rose-600/10 transition-all font-sans cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Analyzing Codebase...</span>
              </>
            ) : (
              <>
                <Play size={12} />
                <span>Analyze Codebase</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Workspace */}
      <div className="max-w-3xl mx-auto w-full flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center select-none">
            <Loader2 size={36} className="text-rose-500 animate-spin mb-4" />
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-widest font-mono">Running Code Diagnostics</h4>
            <p className="text-[11px] text-slate-500 mt-2 font-mono max-w-xs leading-relaxed">
              Synthesizing RAG vectors and querying reasoning engines. This may take a minute...
            </p>
          </div>
        ) : scanned ? (
          bugs && bugs.length > 0 ? (
            <div className="space-y-4">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-2 flex items-center gap-1 select-none">
                <AlertTriangle size={11} className="text-rose-500" />
                <span>Identified Issues ({bugs.length})</span>
              </div>
              <div className="space-y-4">
                {bugs.map((bug, index) => (
                  <BugCard key={index} bug={bug} />
                ))}
              </div>
            </div>
          ) : (
            /* Empty Result State matching specification */
            <div className="text-center py-16 bg-slate-900/10 border border-slate-900 rounded-lg p-6 max-w-md mx-auto select-none">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-4">
                <Bug size={18} />
              </div>
              <h4 className="text-xs font-bold text-slate-200 mb-1.5 font-sans">
                No potential bugs identified.
              </h4>
              <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                RepoSense couldn't identify any clearly supported issues in the analyzed repository context.
              </p>
            </div>
          )
        ) : (
          /* Initial scanned is false state */
          <div className="text-center py-16 text-slate-500 select-none">
            <div className="w-10 h-10 rounded-full bg-slate-900/60 border border-slate-850 text-slate-600 flex items-center justify-center mx-auto mb-4">
              <Bug size={16} />
            </div>
            <p className="text-[11px] font-mono">
              Ready to analyze repository files for potential problems.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BugScanner;
