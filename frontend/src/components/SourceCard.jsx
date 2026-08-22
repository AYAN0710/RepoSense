import React from 'react';
import { FileText } from 'lucide-react';

const SourceCard = ({ source }) => {
  if (!source) return null;

  // Extract clean file path
  const filePath = source.file_path || 'unknown';
  const chunkIndex = source.chunk_index !== undefined ? source.chunk_index : source.chunk_id;
  const score = source.score;

  return (
    <div className="flex items-center gap-3 p-2 rounded bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-850/50 transition-all">
      <div className="p-1.5 rounded bg-slate-950 text-indigo-400 border border-slate-800 shrink-0">
        <FileText size={12} />
      </div>
      <div className="min-w-0 flex-1">
        <div 
          title={filePath}
          className="text-[10px] text-slate-300 font-mono truncate leading-normal"
        >
          {filePath.split('/').pop().split('\\').pop()}
        </div>
        <div className="text-[9px] text-slate-500 font-mono mt-0.5 flex items-center gap-1.5 leading-none">
          <span>Chunk {chunkIndex}</span>
          {score !== undefined && (
            <>
              <span className="text-slate-700">•</span>
              <span className="text-slate-400">Relevance {Number(score).toFixed(2)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SourceCard;
