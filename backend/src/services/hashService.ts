import crypto from 'crypto';

export const generateFileHash = (fileBuffer: Buffer): string => {
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
};

export const compareHashes = (hash1: string, hash2: string): boolean => {
  if (hash1.length !== hash2.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(hash1), Buffer.from(hash2));
};
