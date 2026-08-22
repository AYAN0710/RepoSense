import React from 'react';
import { Cpu, Github, Sparkles, UploadCloud } from 'lucide-react';

const Hero = ({ onSelectAction }) => {
  return (
    <div className="relative overflow-hidden pt-12 pb-8 px-4 flex flex-col items-center text-center max-w-3xl mx-auto select-none">
      {/* Main Headline */}
      <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4 font-sans leading-tight">
        Your Codebase, <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">Understood.</span>
      </h2>

      {/* Supporting Copy */}
      <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mb-8 font-sans">
        Ask questions. Trace the logic. Find the bugs. <br />
        <span className="text-slate-300">RepoSense</span> turns unfamiliar repositories into an AI-readable codebase.
      </p>

      {/* Interactive Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center">
        <button
          onClick={() => onSelectAction('github')}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold shadow-lg shadow-indigo-600/10 hover:shadow-indigo-500/20 transition-all border border-indigo-400/20"
        >
          <Github size={15} />
          <span>Analyze GitHub Repository</span>
        </button>
        <button
          onClick={() => onSelectAction('zip')}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700/80 text-slate-100 hover:text-white rounded-md text-xs font-semibold border border-slate-700 hover:border-slate-600 transition-all"
        >
          <UploadCloud size={15} className="text-slate-400" />
          <span>Upload ZIP</span>
        </button>
      </div>

      {/* Subtle bottom design accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[80px] -z-10 pointer-events-none" />
    </div>
  );
};

export default Hero;
