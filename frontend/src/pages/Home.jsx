import React, { useState } from 'react';
import Hero from '../components/Hero';
import RepositoryInput from '../components/RepositoryInput';

const Home = ({
  onScanUrl,
  onUploadZip,
  loading,
  loadingStatus,
  error,
}) => {
  const [initialAction, setInitialAction] = useState('github');

  const handleHeroAction = (action) => {
    setInitialAction(action);
    // Scroll smoothly to input container
    const inputElement = document.getElementById('repository-input-section');
    inputElement?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-1 bg-slate-950 flex flex-col justify-center items-center py-12 px-6 overflow-y-auto scrollbar-thin">
      <Hero onSelectAction={handleHeroAction} />
      
      <div id="repository-input-section" className="w-full mt-6">
        <RepositoryInput
          onScanUrl={onScanUrl}
          onUploadZip={onUploadZip}
          loading={loading}
          loadingStatus={loadingStatus}
          error={error}
          initialAction={initialAction}
        />
      </div>
    </div>
  );
};

export default Home;
