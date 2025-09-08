import fs from 'fs';
import { createReadStream } from 'fs';
import { createGunzip } from 'zlib';
import type { QCResults, QCMetrics, PerBaseQuality, QualityScores, SequenceLengthDistribution, NucleotideContent } from '../types/qc.js';
import { saveQCResults } from './resultsStorage.js';

interface FastqSequence {
  header: string;
  sequence: string;
  quality: string;
}

export async function processFastqFile(filePath: string, originalName: string, fileId: string): Promise<void> {
  try {
    console.log(`Starting to process FASTQ file: ${originalName}`);
    
    // Initialize results with processing status
    const initialResults: QCResults = {
      id: fileId,
      metrics: {
        filename: originalName,
        fileSize: fs.statSync(filePath).size,
        encoding: 'Sanger / Illumina 1.9',
        totalSequences: 0,
        poorQualitySequences: 0,
        sequenceLength: '',
        gcContent: 0
      },
      perBaseQuality: [],
      qualityScores: [],
      sequenceLengthDistribution: [],
      nucleotideContent: [],
      gcContent: 0,
      status: 'processing',
      createdAt: new Date()
    };
    
    await saveQCResults(fileId, initialResults);

    const sequences = await parseFastqFile(filePath);
    const results = await analyzeSequences(sequences, initialResults.metrics);
    
    const finalResults: QCResults = {
      ...initialResults,
      ...results,
      status: 'completed'
    };
    
    await saveQCResults(fileId, finalResults);
    console.log(`Completed processing FASTQ file: ${originalName}`);
  } catch (error) {
    console.error(`Error processing file ${fileId}:`, error);
    
    // Save failed status
    const errorResults: QCResults = {
      id: fileId,
      metrics: {
        filename: originalName,
        fileSize: fs.statSync(filePath).size,
        encoding: 'Unknown',
        totalSequences: 0,
        poorQualitySequences: 0,
        sequenceLength: '',
        gcContent: 0
      },
      perBaseQuality: [],
      qualityScores: [],
      sequenceLengthDistribution: [],
      nucleotideContent: [],
      gcContent: 0,
      status: 'failed',
      createdAt: new Date()
    };
    
    await saveQCResults(fileId, errorResults);
  }
}

async function parseFastqFile(filePath: string): Promise<FastqSequence[]> {
  const sequences: FastqSequence[] = [];
  const isGzipped = filePath.endsWith('.gz');
  
  return new Promise((resolve, reject) => {
    let content = '';
    const stream = isGzipped 
      ? createReadStream(filePath).pipe(createGunzip())
      : createReadStream(filePath);

    stream.on('data', (chunk: Buffer) => {
      content += chunk.toString();
    });

    stream.on('end', () => {
      try {
        const lines = content.split('\n').filter(line => line.trim() !== '');
        
        // Parse FASTQ format (4 lines per sequence)
        for (let i = 0; i < lines.length; i += 4) {
          if (i + 3 < lines.length) {
            const header = lines[i];
            const sequence = lines[i + 1];
            const quality = lines[i + 3];
            
            if (header.startsWith('@') && sequence && quality) {
              sequences.push({ header, sequence, quality });
            }
          }
        }
        
        // Limit to first 10000 sequences for demo purposes
        resolve(sequences.slice(0, 10000));
      } catch (error) {
        reject(error);
      }
    });

    stream.on('error', reject);
  });
}

async function analyzeSequences(sequences: FastqSequence[], metrics: QCMetrics): Promise<Partial<QCResults>> {
  if (sequences.length === 0) {
    throw new Error('No valid sequences found in FASTQ file');
  }

  // Update basic metrics
  metrics.totalSequences = sequences.length;
  
  // Calculate sequence length statistics
  const lengths = sequences.map(seq => seq.sequence.length);
  const minLength = Math.min(...lengths);
  const maxLength = Math.max(...lengths);
  metrics.sequenceLength = minLength === maxLength ? `${minLength}` : `${minLength}-${maxLength}`;

  // Calculate per-base quality
  const perBaseQuality = calculatePerBaseQuality(sequences);
  
  // Calculate quality score distribution
  const qualityScores = calculateQualityScores(sequences);
  
  // Calculate sequence length distribution
  const sequenceLengthDistribution = calculateSequenceLengthDistribution(lengths);
  
  // Calculate nucleotide content per position
  const nucleotideContent = calculateNucleotideContent(sequences);
  
  // Calculate GC content
  const gcContent = calculateGCContent(sequences);
  metrics.gcContent = gcContent;
  
  // Count poor quality sequences (mean quality < 20)
  metrics.poorQualitySequences = sequences.filter(seq => {
    const meanQuality = calculateMeanQuality(seq.quality);
    return meanQuality < 20;
  }).length;

  return {
    metrics,
    perBaseQuality,
    qualityScores,
    sequenceLengthDistribution,
    nucleotideContent,
    gcContent
  };
}

function calculatePerBaseQuality(sequences: FastqSequence[]): PerBaseQuality[] {
  const maxLength = Math.max(...sequences.map(seq => seq.sequence.length));
  const perBaseQuality: PerBaseQuality[] = [];

  for (let pos = 0; pos < Math.min(maxLength, 150); pos++) {
    const qualitiesAtPosition: number[] = [];
    
    sequences.forEach(seq => {
      if (pos < seq.quality.length) {
        // Convert ASCII quality to Phred score
        const phredScore = seq.quality.charCodeAt(pos) - 33;
        qualitiesAtPosition.push(phredScore);
      }
    });

    if (qualitiesAtPosition.length > 0) {
      qualitiesAtPosition.sort((a, b) => a - b);
      const mean = qualitiesAtPosition.reduce((sum, q) => sum + q, 0) / qualitiesAtPosition.length;
      const median = qualitiesAtPosition[Math.floor(qualitiesAtPosition.length / 2)];
      const lowerQuartile = qualitiesAtPosition[Math.floor(qualitiesAtPosition.length * 0.25)];
      const upperQuartile = qualitiesAtPosition[Math.floor(qualitiesAtPosition.length * 0.75)];
      const tenthPercentile = qualitiesAtPosition[Math.floor(qualitiesAtPosition.length * 0.1)];
      const ninetiethPercentile = qualitiesAtPosition[Math.floor(qualitiesAtPosition.length * 0.9)];

      perBaseQuality.push({
        position: pos + 1,
        mean,
        median,
        lowerQuartile,
        upperQuartile,
        tenthPercentile,
        ninetiethPercentile
      });
    }
  }

  return perBaseQuality;
}

function calculateQualityScores(sequences: FastqSequence[]): QualityScores[] {
  const qualityCount: { [key: number]: number } = {};

  sequences.forEach(seq => {
    const meanQuality = Math.round(calculateMeanQuality(seq.quality));
    qualityCount[meanQuality] = (qualityCount[meanQuality] || 0) + 1;
  });

  return Object.entries(qualityCount)
    .map(([quality, count]) => ({ quality: parseInt(quality), count }))
    .sort((a, b) => a.quality - b.quality);
}

function calculateMeanQuality(qualityString: string): number {
  let totalQuality = 0;
  for (let i = 0; i < qualityString.length; i++) {
    totalQuality += qualityString.charCodeAt(i) - 33;
  }
  return totalQuality / qualityString.length;
}

function calculateSequenceLengthDistribution(lengths: number[]): SequenceLengthDistribution[] {
  const lengthCount: { [key: number]: number } = {};
  
  lengths.forEach(length => {
    lengthCount[length] = (lengthCount[length] || 0) + 1;
  });

  return Object.entries(lengthCount)
    .map(([length, count]) => ({ length: parseInt(length), count }))
    .sort((a, b) => a.length - b.length);
}

function calculateNucleotideContent(sequences: FastqSequence[]): NucleotideContent[] {
  const maxLength = Math.max(...sequences.map(seq => seq.sequence.length));
  const nucleotideContent: NucleotideContent[] = [];

  for (let pos = 0; pos < Math.min(maxLength, 150); pos++) {
    const counts = { G: 0, A: 0, T: 0, C: 0, N: 0 };
    let total = 0;

    sequences.forEach(seq => {
      if (pos < seq.sequence.length) {
        const nucleotide = seq.sequence[pos].toUpperCase();
        if (nucleotide in counts) {
          counts[nucleotide as keyof typeof counts]++;
        } else {
          counts.N++;
        }
        total++;
      }
    });

    if (total > 0) {
      nucleotideContent.push({
        position: pos + 1,
        G: (counts.G / total) * 100,
        A: (counts.A / total) * 100,
        T: (counts.T / total) * 100,
        C: (counts.C / total) * 100,
        N: (counts.N / total) * 100
      });
    }
  }

  return nucleotideContent;
}

function calculateGCContent(sequences: FastqSequence[]): number {
  let totalBases = 0;
  let gcBases = 0;

  sequences.forEach(seq => {
    seq.sequence.split('').forEach(base => {
      const upperBase = base.toUpperCase();
      if (['G', 'C', 'A', 'T'].includes(upperBase)) {
        totalBases++;
        if (upperBase === 'G' || upperBase === 'C') {
          gcBases++;
        }
      }
    });
  });

  return totalBases > 0 ? (gcBases / totalBases) * 100 : 0;
}