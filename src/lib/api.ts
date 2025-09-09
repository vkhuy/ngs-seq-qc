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

const isConnectionError = (error: unknown): boolean => {
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return true;
  }
  return false;
};

const createConnectionErrorMessage = (operation: string): string => {
  return `Unable to connect to the backend server. Please ensure that:

1. The backend server is running on port 3001
2. Run "npm run dev:backend" in a separate terminal, or
3. Run "npm run dev:fullstack" to start both frontend and backend

If the backend is running, check that no firewall is blocking the connection.

Technical details: ${operation} failed - connection to ${API_BASE_URL} was refused.`;
};

export const apiClient = {
  async uploadFile(file: File): Promise<UploadResponse> {
    try {
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
    } catch (error) {
      if (isConnectionError(error)) {
        throw new Error(createConnectionErrorMessage('File upload'));
      }
      throw error;
    }
  },

  async getResults(id: string): Promise<QCResults> {
    try {
      const response = await fetch(`${API_BASE_URL}/results/${id}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch results');
      }

      return response.json();
    } catch (error) {
      if (isConnectionError(error)) {
        throw new Error(createConnectionErrorMessage('Results retrieval'));
      }
      throw error;
    }
  },

  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      
      if (!response.ok) {
        throw new Error('Backend health check failed');
      }

      return response.json();
    } catch (error) {
      if (isConnectionError(error)) {
        throw new Error(createConnectionErrorMessage('Backend health check'));
      }
      throw error;
    }
  }
};