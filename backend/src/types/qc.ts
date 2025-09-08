export interface QCMetrics {
  filename: string;
  fileSize: number;
  encoding: string;
  totalSequences: number;
  poorQualitySequences: number;
  sequenceLength: string;
  gcContent: number;
}

export interface PerBaseQuality {
  position: number;
  mean: number;
  median: number;
  lowerQuartile: number;
  upperQuartile: number;
  tenthPercentile: number;
  ninetiethPercentile: number;
}

export interface QualityScores {
  quality: number;
  count: number;
}

export interface SequenceLengthDistribution {
  length: number;
  count: number;
}

export interface NucleotideContent {
  position: number;
  G: number;
  A: number;
  T: number;
  C: number;
  N: number;
}

export interface QCResults {
  id: string;
  metrics: QCMetrics;
  perBaseQuality: PerBaseQuality[];
  qualityScores: QualityScores[];
  sequenceLengthDistribution: SequenceLengthDistribution[];
  nucleotideContent: NucleotideContent[];
  gcContent: number;
  status: 'processing' | 'completed' | 'failed';
  createdAt: Date;
}

export interface UploadResponse {
  id: string;
  message: string;
  filename: string;
}