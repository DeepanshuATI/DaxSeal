import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface NotarizeResponse {
  status: 'notarized' | 'already_notarized';
  hash: string;
  fileName?: string;
  timestamp?: string;
  originalTimestamp?: string;
  message?: string;
}

export interface VerifyResponse {
  status: 'verified' | 'tampered' | 'unknown';
  hash: string;
  fileName?: string;
  originalTimestamp?: string;
  message: string;
}

export const notarizeDocument = async (file: File): Promise<NotarizeResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post<NotarizeResponse>(`${API_BASE_URL}/notarize`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const verifyDocument = async (file: File): Promise<VerifyResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post<VerifyResponse>(`${API_BASE_URL}/verify`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};
