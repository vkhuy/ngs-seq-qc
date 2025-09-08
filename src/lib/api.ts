const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface UploadResponse {
  id: string;
  message: string;
  filename: string;
}

export interface QCResults {
  id: string;
  metrics: {
    filename: string;
    fileSize: number;
    encoding: string;
    totalSequences: number;
    poorQualitySequences: number;
    sequenceLength: string;
    gcContent: number;
  };
  perBaseQuality: Array<{
    position: number;
    mean: number;
    median: number;
    lowerQuartile: number;
    upperQuartile: number;
    tenthPercentile: number;
    ninetiethPercentile: number;
  }>;
  qualityScores: Array<{
    quality: number;
    count: number;
  }>;
  sequenceLengthDistribution: Array<{
    length: number;
    count: number;
  }>;
  nucleotideContent: Array<{
    position: number;
    G: number;
    A: number;
    T: number;
    C: number;
    N: number;
  }>;
  gcContent: number;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
}

export const apiClient = {
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },

  async getResults(id: string): Promise<QCResults> {
    const response = await fetch(`${API_BASE_URL}/results/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch results');
    }

    return response.json();
  },

  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error('Backend health check failed');
    }

    return response.json();
  }
};