import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import QCVisualization from "@/components/QCVisualization";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Download, Share2, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { apiClient, type QCResults as QCResultsType } from "@/lib/api";

const QCResults = () => {
  const location = useLocation();
  const fileId = location.state?.fileId;
  const filename = location.state?.filename;
  
  const [results, setResults] = useState<QCResultsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileId) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const data = await apiClient.getResults(fileId);
        setResults(data);
        
        // If still processing, poll for updates
        if (data.status === 'processing') {
          setTimeout(fetchResults, 2000);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [fileId]);

  if (!fileId || (!loading && !results && !error)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-biotech-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-8">
              <h2 className="text-xl font-semibold mb-4">No Files Found</h2>
              <p className="text-gray-600 mb-6">
                No files were provided for analysis. Please upload files first.
              </p>
              <Button asChild>
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Upload
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-biotech-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-biotech-500" />
              <h2 className="text-xl font-semibold mb-4">
                {results?.status === 'processing' ? 'Processing...' : 'Loading Results...'}
              </h2>
              <p className="text-gray-600 mb-6">
                {results?.status === 'processing' 
                  ? 'Your FASTQ file is being analyzed. This may take a few minutes.'
                  : 'Fetching quality control results...'}
              </p>
              {filename && (
                <p className="text-sm text-gray-500">File: {filename}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-biotech-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-8">
              <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-semibold mb-4">Error Loading Results</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="space-y-3">
                <Button asChild>
                  <Link to="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Upload
                  </Link>
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!results || results.status === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-biotech-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-8">
              <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-semibold mb-4">Analysis Failed</h2>
              <p className="text-gray-600 mb-6">
                {results?.status === 'failed' 
                  ? 'The quality control analysis failed. Please try uploading the file again.'
                  : 'No analysis results found. Please upload a file first.'}
              </p>
              <Button asChild>
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Upload
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getQualityStatus = () => {
    const poorQualityPercent = (results.metrics.poorQualitySequences / results.metrics.totalSequences) * 100;
    if (poorQualityPercent < 10) return { label: 'PASS', color: 'bg-quality-excellent', description: 'Good Quality' };
    if (poorQualityPercent < 25) return { label: 'WARN', color: 'bg-quality-warning', description: 'Moderate Quality' };
    return { label: 'FAIL', color: 'bg-quality-poor', description: 'Poor Quality' };
  };

  const qualityStatus = getQualityStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-biotech-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Upload
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quality Control Results
            </h1>
            <p className="text-gray-600">
              Analysis completed for {results.metrics.filename}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share Results
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Re-analyze
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Overall Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge className={`${qualityStatus.color} text-white`}>{qualityStatus.label}</Badge>
                <span className="text-2xl font-bold text-gray-900">
                  {qualityStatus.description}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {results.metrics.totalSequences.toLocaleString()} sequences analyzed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Encoding & Length
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{results.metrics.encoding}</div>
              <p className="text-sm text-gray-600 mt-2">
                Sequence length: {results.metrics.sequenceLength}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                GC Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{results.metrics.gcContent.toFixed(1)}%</div>
              <p className="text-sm text-gray-600 mt-2">
                {Math.round((results.metrics.fileSize / 1024 / 1024) * 100) / 100} MB file size
              </p>
            </CardContent>
          </Card>
        </div>

        {/* File Results */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {results.metrics.filename}
              </h2>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {(results.metrics.fileSize / 1024 / 1024).toFixed(2)} MB
                </Badge>
                <Badge className={`${qualityStatus.color} text-white`}>
                  {qualityStatus.label}
                </Badge>
              </div>
            </div>

            <QCVisualization qcResults={results} />
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Card className="bg-gradient-to-r from-biotech-50 to-science-50">
            <CardContent className="text-center py-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Analysis Complete!
              </h3>
              <p className="text-gray-600 mb-6">
                Your sequencing data quality has been analyzed. You can proceed with
                downstream analysis or analyze more files.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link to="/">Analyze More Files</Link>
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Full Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default QCResults;