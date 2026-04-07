import React, { useState } from 'react';
import VerificationZone from './components/VerificationZone';
import ResultDisplay from './components/ResultDisplay';
import { notarizeDocument, verifyDocument, NotarizeResponse, VerifyResponse } from './api/notaryApi';
import './styles/origami.css';

type TabType = 'notarize' | 'verify';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('verify');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<NotarizeResponse | VerifyResponse | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      if (activeTab === 'notarize') {
        const response = await notarizeDocument(file);
        setResult(response);
      } else {
        const response = await verifyDocument(file);
        setResult(response);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setResult(null);
    setError('');
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="logo">KAGAZI</h1>
        <p className="tagline">Digital Notary System</p>
      </header>

      <div className="origami-card">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'verify' ? 'active' : ''}`}
            onClick={() => handleTabChange('verify')}
          >
            Verify Document
          </button>
          <button
            className={`tab ${activeTab === 'notarize' ? 'active' : ''}`}
            onClick={() => handleTabChange('notarize')}
          >
            Notarize Document
          </button>
        </div>

        <h2 className="card-title">
          {activeTab === 'verify' ? 'Verification Zone' : 'Notarization Zone'}
        </h2>

        <VerificationZone onFileSelect={handleFileSelect} isLoading={isLoading} />

        {isLoading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Processing document...</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <ResultDisplay result={result} type={activeTab} />
      </div>

      <footer style={{ textAlign: 'center', color: '#999', fontSize: '0.85rem' }}>
        <p>Powered by DaxSeal • Cryptographic Document Verification</p>
      </footer>
    </div>
  );
}

export default App;
