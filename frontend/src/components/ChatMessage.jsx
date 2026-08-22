import React from 'react';
import { Bot, Cpu, User } from 'lucide-react';
import SourceCard from './SourceCard';
import { formatLLMResponse } from '../utils/textFormatter';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-4 p-4 rounded-lg border text-left transition-all ${
      isUser
        ? 'bg-slate-900/30 border-slate-900'
        : 'bg-slate-900/60 border-slate-800/80 shadow-md'
    }`}>
      {/* Avatar Icon */}
      <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 border mt-0.5 select-none ${
        isUser
          ? 'bg-slate-800 border-slate-700 text-slate-300'
          : 'bg-indigo-950 border-indigo-500/30 text-indigo-400'
      }`}>
        {isUser ? <User size={14} /> : <Bot size={14} />}
      </div>

      {/* Message body */}
      <div className="flex-1 min-w-0">
        {/* Name / Header */}
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5 select-none">
          {isUser ? 'User' : 'RepoSense'}
        </div>

        {/* Content */}
        <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap break-words">
          {formatLLMResponse(message.content)}
        </div>

        {/* AI Metadata & Sources */}
        {!isUser && (
          <div className="mt-4 pt-4 border-t border-slate-800/60 space-y-3">
            {/* Metadata (Confidence + Latency) */}
            {(message.confidence !== undefined || message.latency !== undefined) && (
              <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono select-none">
                {message.confidence !== undefined && (
                  <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    Confidence: <span className="font-semibold text-slate-300">{Math.round(message.confidence * 100)}%</span>
                  </span>
                )}
                {message.latency !== undefined && (
                  <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    Latency: <span className="font-semibold text-slate-300">{message.latency}s</span>
                  </span>
                )}
              </div>
            )}

            {/* Sources list */}
            {message.sources && message.sources.length > 0 && (
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-2 flex items-center gap-1 select-none">
                  <Cpu size={10} className="text-indigo-400" />
                  <span>Semantic Sources</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {message.sources.map((source, index) => (
                    <SourceCard key={index} source={source} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
