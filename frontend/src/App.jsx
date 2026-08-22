import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import RepositoryWorkspace from './pages/RepositoryWorkspace';
import { scanRepository, uploadRepository } from './api/repositoryApi';
import { askCodebase } from './api/chatApi';
import { analyzeBugs } from './api/bugApi';

function App() {
  // Load repository index list from local storage for nice persistency
  const [repositories, setRepositories] = useState(() => {
    const saved = localStorage.getItem('reposense_repositories');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedRepositoryId, setSelectedRepositoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [error, setError] = useState(null);

  // Workspace active tab ('chat' or 'bugs')
  const [activeTab, setActiveTab] = useState('chat');

  // Separated histories by repository_id
  const [chatMessagesByRepo, setChatMessagesByRepo] = useState(() => {
    const saved = localStorage.getItem('reposense_chats');
    return saved ? JSON.parse(saved) : {};
  });
  const [bugsByRepo, setBugsByRepo] = useState(() => {
    const saved = localStorage.getItem('reposense_bugs');
    return saved ? JSON.parse(saved) : {};
  });

  const [chatLoading, setChatLoading] = useState(false);
  const [bugsLoading, setBugsLoading] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('reposense_repositories', JSON.stringify(repositories));
  }, [repositories]);

  useEffect(() => {
    localStorage.setItem('reposense_chats', JSON.stringify(chatMessagesByRepo));
  }, [chatMessagesByRepo]);

  useEffect(() => {
    localStorage.setItem('reposense_bugs', JSON.stringify(bugsByRepo));
  }, [bugsByRepo]);

  // Current active repository object
  const activeRepository = repositories.find(
    (r) => r.repository_id === selectedRepositoryId
  );

  // Simulated sequential indexing logs for rich UX feedback
  const runIndexingAnimation = (statusTexts, callback, fallbackErrorMsg) => {
    let index = 0;
    setLoadingStatus(statusTexts[0]);
    
    const interval = setInterval(() => {
      index++;
      if (index < statusTexts.length) {
        setLoadingStatus(statusTexts[index]);
      } else {
        clearInterval(interval);
      }
    }, 1500);

    callback()
      .then((data) => {
        clearInterval(interval);
        // Extract repo name
        let repoName = 'Repository';
        if (data.repository_url) {
          const parts = data.repository_url.replace(/\/$/, '').split('/');
          repoName = parts[parts.length - 1].replace(/\.git$/, '');
        } else if (data.filename) {
          repoName = data.filename.replace(/\.zip$/, '');
        }

        const newRepo = {
          repository_id: data.repository_id,
          name: repoName,
          repository_url: data.repository_url || '',
          total_files: data.total_files,
          total_chunks: data.total_chunks,
          vectors_stored: data.vectors_stored,
        };

        // Avoid adding duplicate IDs
        setRepositories((prev) => {
          const exists = prev.some((r) => r.repository_id === newRepo.repository_id);
          if (exists) return prev;
          return [...prev, newRepo];
        });

        setSelectedRepositoryId(newRepo.repository_id);
        setActiveTab('chat');
        setLoading(false);
      })
      .catch((err) => {
        clearInterval(interval);
        console.error(err);
        
        // Handle backend unavailable vs standard scan fail
        if (!err.response && err.request) {
          setError('RepoSense backend is unavailable. Please make sure the FastAPI server is running.');
        } else {
          setError(fallbackErrorMsg);
        }
        setLoading(false);
      });
  };

  const handleScanUrl = (url) => {
    setError(null);
    setLoading(true);

    const steps = [
      'Scanning repository...',
      'Repository downloaded',
      'Files scanned',
      'Code chunks created',
      'Repository indexed',
      'Preparing RepoSense...'
    ];

    runIndexingAnimation(
      steps,
      () => scanRepository(url),
      'Unable to scan repository. Please check that the GitHub URL is valid and publicly accessible.'
    );
  };

  const handleUploadZip = (file) => {
    setError(null);
    setLoading(true);

    const steps = [
      'Uploading ZIP archive...',
      'Extracting repository files...',
      'Files scanned',
      'Code chunks created',
      'Repository indexed',
      'Preparing RepoSense...'
    ];

    runIndexingAnimation(
      steps,
      () => uploadRepository(file),
      'Unable to process this repository. Please verify that the uploaded file is a valid ZIP.'
    );
  };

  const handleSendChatMessage = async (queryText) => {
    if (!selectedRepositoryId || chatLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: queryText,
    };

    // Save user message in specific repo chat history
    setChatMessagesByRepo((prev) => {
      const repoHistory = prev[selectedRepositoryId] || [];
      return {
        ...prev,
        [selectedRepositoryId]: [...repoHistory, userMsg],
      };
    });

    setChatLoading(true);

    try {
      const data = await askCodebase(selectedRepositoryId, queryText);
      
      let answer = data.answer;
      // Empty chat result specifications check
      if (!answer || answer.trim() === '') {
        answer = 'No relevant repository information was found. Try asking a more specific question.';
      }

      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answer,
        confidence: data.confidence,
        sources: data.sources || [],
        latency: data.latency_seconds,
      };

      setChatMessagesByRepo((prev) => {
        const repoHistory = prev[selectedRepositoryId] || [];
        return {
          ...prev,
          [selectedRepositoryId]: [...repoHistory, botMsg],
        };
      });
    } catch (err) {
      console.error(err);
      
      const errorMessage = !err.response && err.request
        ? 'RepoSense backend is unavailable. Please make sure the FastAPI server is running.'
        : 'An error occurred while query retrieval. Please try again.';

      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage,
      };

      setChatMessagesByRepo((prev) => {
        const repoHistory = prev[selectedRepositoryId] || [];
        return {
          ...prev,
          [selectedRepositoryId]: [...repoHistory, errorMsg],
        };
      });
    } finally {
      setChatLoading(false);
    }
  };

  const handleScanBugs = async (customQuery) => {
    if (!selectedRepositoryId || bugsLoading) return;

    setBugsLoading(true);

    try {
      const data = await analyzeBugs(selectedRepositoryId, customQuery);
      
      setBugsByRepo((prev) => ({
        ...prev,
        [selectedRepositoryId]: {
          bugs: data.bugs || [],
          query: customQuery || 'Review the repository for potential bugs.',
          scanned: true,
        },
      }));
    } catch (err) {
      console.error(err);
      alert(!err.response && err.request
        ? 'RepoSense backend is unavailable. Please make sure the FastAPI server is running.'
        : 'Bug analysis execution failed. Please verify repository context.'
      );
    } finally {
      setBugsLoading(false);
    }
  };

  const handleSelectRepository = (repoId) => {
    setSelectedRepositoryId(repoId);
    setError(null);
  };

  const handleNewRepository = () => {
    setSelectedRepositoryId(null);
    setError(null);
  };

  // Get active items
  const currentMessages = chatMessagesByRepo[selectedRepositoryId] || [];
  const currentBugsData = bugsByRepo[selectedRepositoryId] || { bugs: [], query: '', scanned: false };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Workspace Sidebar */}
      <Sidebar
        repositories={repositories}
        selectedRepositoryId={selectedRepositoryId}
        onSelectRepository={handleSelectRepository}
        onNewRepository={handleNewRepository}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col h-full min-w-0">
        {activeRepository ? (
          <RepositoryWorkspace
            repository={activeRepository}
            chatMessages={currentMessages}
            onSendChatMessage={handleSendChatMessage}
            chatLoading={chatLoading}
            bugs={currentBugsData.bugs}
            onScanBugs={handleScanBugs}
            bugsLoading={bugsLoading}
            bugsScanned={currentBugsData.scanned}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        ) : (
          <Home
            onScanUrl={handleScanUrl}
            onUploadZip={handleUploadZip}
            loading={loading}
            loadingStatus={loadingStatus}
            error={error}
          />
        )}
      </main>
    </div>
  );
}

export default App;
