import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { processFastqFile } from '../utils/fastqProcessor.js';
import type { UploadResponse } from '../types/qc.js';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_req, file, cb) => {
    const uniqueId = uuidv4();
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueId}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['.fastq', '.fq', '.fastq.gz', '.fq.gz'];
    const extension = path.extname(file.originalname).toLowerCase();
    const isGzipped = file.originalname.toLowerCase().endsWith('.gz');
    
    if (isGzipped) {
      const baseExtension = path.extname(file.originalname.slice(0, -3)).toLowerCase();
      if (baseExtension === '.fastq' || baseExtension === '.fq') {
        cb(null, true);
      } else {
        cb(new Error('Only FASTQ files are allowed (.fastq, .fq, .fastq.gz, .fq.gz)'));
      }
    } else if (allowedTypes.includes(extension)) {
      cb(null, true);
    } else {
      cb(new Error('Only FASTQ files are allowed (.fastq, .fq, .fastq.gz, .fq.gz)'));
    }
  }
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileId = path.basename(req.file.filename, path.extname(req.file.filename));
    
    // Start processing the file asynchronously
    processFastqFile(req.file.path, req.file.originalname, fileId)
      .catch(error => {
        console.error(`Error processing file ${fileId}:`, error);
      });

    const response: UploadResponse = {
      id: fileId,
      message: 'File uploaded successfully, processing started',
      filename: req.file.originalname
    };

    return res.json(response);
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to upload file' });
  }
});

export default router;