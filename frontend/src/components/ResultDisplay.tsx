import React from 'react';
import { NotarizeResponse, VerifyResponse } from '../api/notaryApi';

interface ResultDisplayProps {
  result: NotarizeResponse | VerifyResponse | null;
  type: 'notarize' | 'verify';
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  if (!result) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
      case 'notarized':
        return '✓';
      case 'tampered':
        return '⚠';
      case 'unknown':
        return '?';
      case 'already_notarized':
        return 'ℹ';
      default:
        return '';
    }
  };

  const formatDate = (timestamp?: string) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="result-container">
      <div className={`result-status ${result.status}`}>
        {getStatusIcon(result.status)} {result.status.replace('_', ' ')}
      </div>

      <div className="result-details">
        {result.message && <p>{result.message}</p>}

        <div style={{ marginTop: '15px' }}>
          <strong>Document Hash:</strong>
          <div className="result-hash">{result.hash}</div>
        </div>

        {'fileName' in result && result.fileName && (
          <p>
            <strong>File Name:</strong> {result.fileName}
          </p>
        )}

        {'timestamp' in result && result.timestamp && (
          <p>
            <strong>Notarized At:</strong> {formatDate(result.timestamp)}
          </p>
        )}

        {'originalTimestamp' in result && result.originalTimestamp && (
          <p>
            <strong>Original Registration:</strong> {formatDate(result.originalTimestamp)}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
