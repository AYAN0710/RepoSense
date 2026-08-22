import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, ArrowRight, Github, Loader2, UploadCloud } from 'lucide-react';

const RepositoryInput = ({
  onScanUrl,
  onUploadZip,
  loading,
  loadingStatus,
  error,
  initialAction = 'github',
}) => {
  const [activeTab, setActiveTab] = useState(initialAction || 'github');
  const [githubUrl, setGithubUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Keep activeTab in sync with initialAction if it changes
  useEffect(() => {
    if (initialAction) {
      setActiveTab(initialAction);
    }
  }, [initialAction]);

  const handleGithubSubmit = (e) => {
    e.preventDefault();
    if (!githubUrl.trim() || loading) return;
    onScanUrl(githubUrl.trim());
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      onUploadZip(file);
    }
  };

  const triggerFileSelect = () => {
    if (loading) return;
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden p-6 select-none">
      {/* Selector Tabs */}
      <div className="flex border-b border-slate-800 mb-6">
        <button
          type="button"
          onClick={() => !loading && setActiveTab('github')}
          className={`flex-1 pb-3 text-xs font-semibold tracking-wider uppercase font-mono border-b-2 text-center transition-all ${
            activeTab === 'github'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-400'
          } ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          GitHub Repository
        </button>
        <button
          type="button"
          onClick={() => !loading && setActiveTab('zip')}
          className={`flex-1 pb-3 text-xs font-semibold tracking-wider uppercase font-mono border-b-2 text-center transition-all ${
            activeTab === 'zip'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-400'
          } ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          ZIP Archive
        </button>
      </div>

      {/* Main Forms */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 size={32} className="text-indigo-500 animate-spin mb-4" />
          <div className="text-xs font-semibold text-slate-200 uppercase tracking-widest font-mono">
            Indexing Codebase
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-2 animate-pulse bg-slate-800/40 px-3 py-1 rounded border border-slate-700/40">
            {loadingStatus || 'Processing...'}
          </div>
        </div>
      ) : (
        <div>
          {/* GitHub Form (Primary Option) */}
          {activeTab === 'github' && (
            <form onSubmit={handleGithubSubmit} className="space-y-4">
              <div className="text-left">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-2">
                  Public Repository URL
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-500">
                    <Github size={15} />
                  </div>
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/user/repository.git"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 text-slate-100 placeholder-slate-600 rounded-md py-2.5 pl-10 pr-4 text-xs outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!githubUrl.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-850 disabled:text-slate-500 text-white rounded-md text-xs font-semibold shadow-md shadow-indigo-600/10 transition-all font-sans"
              >
                <span>Scan Repository</span>
                <ArrowRight size={13} />
              </button>
            </form>
          )}

          {/* ZIP Form (Secondary Option) */}
          {activeTab === 'zip' && (
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".zip,application/zip,application/x-zip-compressed"
                className="hidden"
              />
              <div
                onClick={triggerFileSelect}
                className="border border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-950 hover:bg-slate-950/80 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 group-hover:border-indigo-500/30 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors mb-3">
                  <UploadCloud size={20} />
                </div>
                <div className="text-xs font-medium text-slate-300 mb-1 font-sans">
                  Click to select repository ZIP
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Only .zip files supported
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Reporting Block */}
      {error && !loading && (
        <div className="mt-5 p-3.5 bg-rose-950/20 border border-rose-900/40 rounded-md flex items-start gap-2.5 text-left text-xs text-rose-300">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <div className="font-sans leading-relaxed">
            <span className="font-semibold block mb-0.5 text-rose-200">Processing Error</span>
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export default RepositoryInput;
