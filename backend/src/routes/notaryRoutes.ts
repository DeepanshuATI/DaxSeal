import { Router, Request, Response } from 'express';
import path from 'path';
import { upload } from '../middleware/fileUpload';
import { generateFileHash, compareHashes } from '../services/hashService';
import { insertDocument, findDocumentByHash } from '../database/db';

const router = Router();

const sanitizeFilename = (filename: string): string => {
  return path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
};

router.post('/notarize', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileHash = generateFileHash(req.file.buffer);
    const fileName = sanitizeFilename(req.file.originalname);

    const existing = await findDocumentByHash(fileHash);
    if (existing) {
      return res.status(200).json({
        status: 'already_notarized',
        hash: fileHash,
        originalTimestamp: existing.timestamp,
        message: 'This document was already notarized',
      });
    }

    await insertDocument(fileName, fileHash);

    res.status(201).json({
      status: 'notarized',
      hash: fileHash,
      fileName,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Notarization error:', error);
    res.status(500).json({ error: 'Failed to notarize document' });
  }
});

router.post('/verify', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileHash = generateFileHash(req.file.buffer);
    const document = await findDocumentByHash(fileHash);

    if (!document) {
      return res.status(200).json({
        status: 'unknown',
        hash: fileHash,
        message: 'Document not found in registry. It has never been notarized.',
      });
    }

    const isValid = compareHashes(fileHash, document.file_hash);

    if (isValid) {
      return res.status(200).json({
        status: 'verified',
        hash: fileHash,
        fileName: document.file_name,
        originalTimestamp: document.timestamp,
        message: 'Document is authentic and unmodified',
      });
    } else {
      return res.status(200).json({
        status: 'tampered',
        hash: fileHash,
        message: 'DOCUMENT TAMPERED - Hash mismatch detected',
      });
    }
  } catch (error: any) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Failed to verify document' });
  }
});

export default router;
