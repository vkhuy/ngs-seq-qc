import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

// Utility function to validate FASTQ files
function isValidFastqFile(filename) {
  const name = filename.toLowerCase();
  return name.endsWith('.fastq') || 
         name.endsWith('.fastq.gz') || 
         name.endsWith('.fq') || 
         name.endsWith('.fq.gz');
}

// File upload and quality control analysis endpoint
router.post('/upload', async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        error: 'No files uploaded',
        message: 'Please select at least one FASTQ file to upload'
      });
    }

    const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
    const uploadedFiles = [];
    const errors = [];

    // Process each file
    for (const file of files) {
      if (!isValidFastqFile(file.name)) {
        errors.push(`${file.name}: Invalid file format. Only FASTQ files (.fastq, .fq, .fastq.gz, .fq.gz) are supported.`);
        continue;
      }

      if (file.size > 100 * 1024 * 1024) {
        errors.push(`${file.name}: File size exceeds 100MB limit.`);
        continue;
      }

      // Create unique filename to avoid conflicts
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const uniqueName = `${timestamp}_${safeName}`;
      const uploadPath = join(__dirname, '..', 'uploads', uniqueName);

      try {
        // Move file to uploads directory
        await file.mv(uploadPath);
        
        uploadedFiles.push({
          id: timestamp,
          originalName: file.name,
          filename: uniqueName,
          size: file.size,
          path: uploadPath,
          uploadedAt: new Date().toISOString()
        });
      } catch (moveError) {
        errors.push(`${file.name}: Failed to save file - ${moveError.message}`);
      }
    }

    if (uploadedFiles.length === 0) {
      return res.status(400).json({
        error: 'No valid files uploaded',
        message: 'All uploaded files were invalid or too large',
        errors
      });
    }

    // Simulate QC processing (in a real implementation, this would trigger actual FastQC analysis)
    const analysisResults = uploadedFiles.map(file => ({
      fileId: file.id,
      filename: file.originalName,
      status: 'processing',
      qcMetrics: {
        totalSequences: Math.floor(Math.random() * 1000000) + 500000,
        sequenceLength: Math.floor(Math.random() * 50) + 100,
        gcContent: Math.floor(Math.random() * 20) + 40,
        qualityScore: Math.floor(Math.random() * 10) + 25
      }
    }));

    res.json({
      success: true,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      files: uploadedFiles,
      analysisResults,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: 'An error occurred while processing your files'
    });
  }
});

// Get analysis results endpoint
router.get('/analysis/:fileId', (req, res) => {
  const { fileId } = req.params;
  
  // In a real implementation, this would fetch actual analysis results from a database
  // For now, return mock FastQC-style data
  const mockResults = {
    fileId,
    status: 'completed',
    completedAt: new Date().toISOString(),
    summary: {
      filename: `sample_${fileId}.fastq`,
      totalSequences: Math.floor(Math.random() * 1000000) + 500000,
      sequenceLength: `${Math.floor(Math.random() * 50) + 100}-${Math.floor(Math.random() * 50) + 150}`,
      gcContent: Math.floor(Math.random() * 20) + 40,
      encoding: 'Sanger / Illumina 1.9'
    },
    modules: [
      {
        name: 'Basic Statistics',
        status: 'PASS',
        data: {
          totalSequences: Math.floor(Math.random() * 1000000) + 500000,
          filteredSequences: 0,
          sequenceLength: Math.floor(Math.random() * 50) + 100,
          gcContent: `${Math.floor(Math.random() * 20) + 40}%`
        }
      },
      {
        name: 'Per base sequence quality',
        status: 'PASS',
        data: generateQualityData()
      },
      {
        name: 'Per sequence quality scores',
        status: 'PASS',
        data: generatePerSeqQualityData()
      },
      {
        name: 'Per base sequence content',
        status: 'WARN',
        data: generateBaseContentData()
      },
      {
        name: 'Per sequence GC content',
        status: 'PASS',
        data: generateGCContentData()
      },
      {
        name: 'Per base N content',
        status: 'PASS',
        data: generateNContentData()
      },
      {
        name: 'Sequence Length Distribution',
        status: 'PASS',
        data: generateLengthDistData()
      },
      {
        name: 'Adapter Content',
        status: 'PASS',
        data: generateAdapterData()
      }
    ]
  };

  res.json(mockResults);
});

// Helper functions to generate mock FastQC data
function generateQualityData() {
  const data = [];
  for (let i = 1; i <= 150; i++) {
    data.push({
      position: i,
      mean: Math.max(20, 40 - (i > 100 ? (i - 100) * 0.2 : 0) + Math.random() * 5),
      median: Math.max(18, 38 - (i > 100 ? (i - 100) * 0.18 : 0) + Math.random() * 5),
      q25: Math.max(15, 35 - (i > 100 ? (i - 100) * 0.15 : 0) + Math.random() * 5),
      q75: Math.max(25, 42 - (i > 100 ? (i - 100) * 0.25 : 0) + Math.random() * 5)
    });
  }
  return data;
}

function generatePerSeqQualityData() {
  const data = [];
  for (let q = 0; q <= 40; q++) {
    const count = q < 20 ? Math.random() * 1000 : 
                  q < 30 ? Math.random() * 10000 + 5000 :
                  Math.random() * 50000 + 20000;
    data.push({ quality: q, count: Math.floor(count) });
  }
  return data;
}

function generateBaseContentData() {
  const data = [];
  for (let i = 1; i <= 150; i++) {
    data.push({
      position: i,
      A: 20 + Math.random() * 10,
      T: 20 + Math.random() * 10,
      G: 30 + Math.random() * 10,
      C: 30 + Math.random() * 10
    });
  }
  return data;
}

function generateGCContentData() {
  const data = [];
  for (let gc = 0; gc <= 100; gc++) {
    const theoretical = Math.exp(-0.5 * Math.pow((gc - 50) / 10, 2));
    const observed = theoretical * (0.8 + Math.random() * 0.4);
    data.push({
      gcContent: gc,
      count: Math.floor(observed * 10000),
      theoretical: Math.floor(theoretical * 10000)
    });
  }
  return data;
}

function generateNContentData() {
  const data = [];
  for (let i = 1; i <= 150; i++) {
    data.push({
      position: i,
      nContent: Math.random() * 2
    });
  }
  return data;
}

function generateLengthDistData() {
  const data = [];
  const targetLength = 150;
  for (let len = targetLength - 10; len <= targetLength + 10; len++) {
    const count = len === targetLength ? Math.random() * 100000 + 50000 :
                  Math.random() * 5000;
    data.push({
      length: len,
      count: Math.floor(count)
    });
  }
  return data;
}

function generateAdapterData() {
  const adapters = [
    'Illumina Universal Adapter',
    'Illumina Small RNA 3\' Adapter',
    'Illumina Small RNA 5\' Adapter',
    'Nextera Transposase Sequence'
  ];
  
  return adapters.map(adapter => ({
    name: adapter,
    data: Array.from({ length: 150 }, (_, i) => ({
      position: i + 1,
      percentage: Math.max(0, Math.random() * 2 - 1.5)
    }))
  }));
}

// List uploaded files endpoint
router.get('/files', (req, res) => {
  try {
    const uploadsDir = join(__dirname, '..', 'uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      return res.json({ files: [] });
    }

    const files = fs.readdirSync(uploadsDir).map(filename => {
      const filePath = join(uploadsDir, filename);
      const stats = fs.statSync(filePath);
      
      return {
        filename,
        size: stats.size,
        uploadedAt: stats.birthtime,
        id: filename.split('_')[0] // Extract timestamp from filename
      };
    });

    res.json({ files });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({
      error: 'Failed to list files',
      message: 'An error occurred while retrieving file list'
    });
  }
});

export default router;