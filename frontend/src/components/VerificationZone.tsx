import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface VerificationZoneProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const VerificationZone: React.FC<VerificationZoneProps> = ({ onFileSelect, isLoading }) => {
  const [error, setError] = useState<string>('');

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError('');

      if (rejectedFiles.length > 0) {
        setError('Only PDF files are accepted (max 10MB)');
        return;
      }

      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled: isLoading,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${isLoading ? 'disabled' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="dropzone-icon">📄</div>
        {isDragActive ? (
          <p className="dropzone-text">Drop your PDF here...</p>
        ) : (
          <>
            <p className="dropzone-text">Drag & drop a PDF document</p>
            <p className="dropzone-hint">or click to browse (max 10MB)</p>
          </>
        )}
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default VerificationZone;
