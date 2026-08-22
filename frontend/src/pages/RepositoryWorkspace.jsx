import React from 'react';
import { MessageSquareCode, ShieldAlert } from 'lucide-react';
import RepositoryHeader from '../components/RepositoryHeader';
import ChatWindow from '../components/ChatWindow';
import BugScanner from '../components/BugScanner';

const RepositoryWorkspace = ({
  repository,
  chatMessages = [],
  onSendChatMessage,
  chatLoading = false,
  bugs = [],
  onScanBugs,
  bugsLoading = false,
  bugsScanned = false,
  activeTab = 'chat',
  setActiveTab,
}) => {
  if (!repository) return null;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Codebase Meta info Header */}
      <RepositoryHeader repository={repository} />

      {/* Workspace Tabs Navigation */}
      <div className="flex border-b border-slate-900 bg-slate-900/20 px-4 select-none">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs font-semibold tracking-wider font-mono transition-all ${
            activeTab === 'chat'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-400'
          }`}
        >
          <MessageSquareCode size={13} />
          <span>Codebase Chat</span>
        </button>
        <button
          onClick={() => setActiveTab('bugs')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs font-semibold tracking-wider font-mono transition-all ${
            activeTab === 'bugs'
              ? 'border-rose-500 text-rose-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-400'
          }`}
        >
          <ShieldAlert size={13} />
          <span>Bug Scanner</span>
        </button>
      </div>

      {/* Main Tab Panel Workspace */}
      <div className="flex-1 min-h-0 relative">
        {activeTab === 'chat' ? (
          <ChatWindow
            messages={chatMessages}
            onSendMessage={onSendChatMessage}
            loading={chatLoading}
          />
        ) : (
          <BugScanner
            bugs={bugs}
            onScanBugs={onScanBugs}
            loading={bugsLoading}
            scanned={bugsScanned}
          />
        )}
      </div>
    </div>
  );
};

export default RepositoryWorkspace;
