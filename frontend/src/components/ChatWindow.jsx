import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Loader2, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';

const SUGGESTED_QUESTIONS = [
  'How does the RAG pipeline work?',
  'Where are embeddings generated?',
  'How does document ingestion work?',
  'How is semantic search implemented?',
];

const ChatWindow = ({
  messages = [],
  onSendMessage,
  loading = false,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleSuggestedClick = (question) => {
    if (loading) return;
    onSendMessage(question);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 font-sans">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="max-w-xl mx-auto text-center py-12 select-none">
            <div className="w-12 h-12 rounded-full bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-6">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 mb-2">Ask RepoSense anything</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed">
              Explore structural logic, database connections, schemas, or specific file functionalities in your codebase.
            </p>
            
            {/* Suggested starter inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              {SUGGESTED_QUESTIONS.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestedClick(question)}
                  className="p-3 text-xs text-slate-400 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 hover:text-slate-200 rounded-lg transition-all text-left font-medium leading-normal"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {/* Loading/Retrieval block */}
            {loading && (
              <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-900/30 border border-slate-900 text-left">
                <div className="w-6 h-6 rounded bg-indigo-950 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 animate-spin">
                  <Loader2 size={13} />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="text-xs font-bold text-slate-400 font-mono tracking-wider uppercase animate-pulse">
                    Scanning indexes...
                  </div>
                  <div className="h-2 w-1/3 bg-slate-800 rounded animate-pulse" />
                  <div className="h-2 w-2/3 bg-slate-800 rounded animate-pulse" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Submit Block */}
      <div className="p-4 border-t border-slate-900 bg-slate-900/10">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            placeholder={loading ? 'Processing query...' : 'Ask anything about your codebase...'}
            className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 text-slate-100 placeholder-slate-500 rounded-md py-2.5 pl-4 pr-12 text-xs outline-none transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="absolute right-2 p-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-slate-800 disabled:text-slate-600 transition-all cursor-pointer"
          >
            <ArrowUp size={14} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
