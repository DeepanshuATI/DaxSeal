import fs from 'fs';
import path from 'path';

export const setDatabasePermissions = (dbPath: string): void => {
  try {
    if (fs.existsSync(dbPath)) {
      fs.chmodSync(dbPath, 0o600);
      console.log('Database file permissions set to owner-only access');
    }
  } catch (error) {
    console.warn('Could not set database file permissions:', error);
  }
};
