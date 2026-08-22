import React from 'react';
import { AlertCircle, Code, FileWarning } from 'lucide-react';
import { formatLLMResponse } from '../utils/textFormatter';

const BugCard = ({ bug }) => {
  if (!bug) return null;

  const { severity, file_path, chunk_index, issue, explanation, suggested_fix } = bug;

  // Severity color mappings
  const getSeverityStyle = (level = '') => {
    const uppercaseLevel = level.toUpperCase();
    switch (uppercaseLevel) {
      case 'CRITICAL':
      case 'HIGH':
        return 'bg-red-950/40 border-red-500/20 text-red-400';
      case 'MEDIUM':
        return 'bg-amber-950/30 border-amber-500/20 text-amber-400';
      case 'LOW':
      default:
        return 'bg-blue-950/20 border-blue-500/20 text-blue-400';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 text-left space-y-4 shadow-sm">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono border tracking-wider leading-none uppercase ${getSeverityStyle(severity)}`}>
            {severity || 'LOW'}
          </span>
          <h3 className="text-xs font-bold text-slate-100 font-sans">
            {issue || 'Potential bug identified'}
          </h3>
        </div>

        {/* File and Chunk monospace badges */}
        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-mono">
          <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 max-w-[200px] truncate" title={file_path}>
            <FileWarning size={10} className="text-slate-500 shrink-0" />
            <span>{file_path}</span>
          </span>
          {chunk_index !== undefined && chunk_index !== null && (
            <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              Chunk {chunk_index}
            </span>
          )}
        </div>
      </div>

      {/* Explanation Section */}
      <div className="space-y-1">
        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono">
          Explanation
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {formatLLMResponse(explanation)}
        </p>
      </div>

      {/* Suggested Fix Section */}
      <div className="space-y-1.5">
        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1">
          <Code size={10} className="text-indigo-400" />
          <span>Suggested Fix</span>
        </div>
        <div className="bg-slate-950 border border-slate-800/80 rounded-md p-3.5 font-mono text-[11px] text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto">
          {suggested_fix}
        </div>
      </div>
    </div>
  );
};

export default BugCard;
