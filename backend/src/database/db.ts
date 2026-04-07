import sqlite3 from 'sqlite3';
import path from 'path';
import { setDatabasePermissions } from './dbSecurity';

const dbPath = path.join(__dirname, '../../notary.db');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    setDatabasePermissions(dbPath);
  }
});

export const initDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_name TEXT NOT NULL,
        file_hash TEXT UNIQUE NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      (err) => {
        if (err) reject(err);
        else {
          console.log('Database schema initialized');
          resolve();
        }
      }
    );
  });
};

export interface DocumentRecord {
  id: number;
  file_name: string;
  file_hash: string;
  timestamp: string;
}

export const insertDocument = (fileName: string, fileHash: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO documents (file_name, file_hash) VALUES (?, ?)',
      [fileName, fileHash],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

export const findDocumentByHash = (fileHash: string): Promise<DocumentRecord | null> => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM documents WHERE file_hash = ?',
      [fileHash],
      (err, row: DocumentRecord) => {
        if (err) reject(err);
        else resolve(row || null);
      }
    );
  });
};
