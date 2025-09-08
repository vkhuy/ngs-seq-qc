import fs from 'fs';
import path from 'path';
import type { QCResults } from '../types/qc.js';

const RESULTS_DIR = 'results';

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

export async function saveQCResults(id: string, results: QCResults): Promise<void> {
  const filePath = path.join(RESULTS_DIR, `${id}.json`);
  await fs.promises.writeFile(filePath, JSON.stringify(results, null, 2));
}

export async function getQCResults(id: string): Promise<QCResults | null> {
  const filePath = path.join(RESULTS_DIR, `${id}.json`);
  
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data) as QCResults;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null; // File not found
    }
    throw error;
  }
}

export async function deleteQCResults(id: string): Promise<boolean> {
  const filePath = path.join(RESULTS_DIR, `${id}.json`);
  
  try {
    await fs.promises.unlink(filePath);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return false; // File not found
    }
    throw error;
  }
}