import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadSectionProps {
  className?: string;
}

const UploadSection = ({ className }: UploadSectionProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const navigate = useNavigate();

  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

  const isAcceptedFastq = (file: File) => {
    const name = file.name.toLowerCase();
    return (
      name.endsWith(".fastq") ||
      name.endsWith(".fastq.gz") ||
      name.endsWith(".fq") ||
      name.endsWith(".fq.gz")
    );
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      const allFiles = Array.from(e.dataTransfer.files);
      const acceptedFiles = allFiles.filter(
        (file) => isAcceptedFastq(file) && file.size <= MAX_FILE_SIZE
      );
      const oversized = allFiles.find(
        (file) => isAcceptedFastq(file) && file.size > MAX_FILE_SIZE
      );

      if (oversized) {
        setFileError("Each file must be 100 MB or less.");
      } else {
        setFileError(null);
      }

      setFiles(acceptedFiles);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const allFiles = Array.from(e.target.files);
      const acceptedFiles = allFiles.filter(
        (file) => isAcceptedFastq(file) && file.size <= MAX_FILE_SIZE
      );
      const oversized = allFiles.find(
        (file) => isAcceptedFastq(file) && file.size > MAX_FILE_SIZE
      );

      if (oversized) {
        setFileError("Each file must be 100 MB or less.");
      } else {
        setFileError(null);
      }

      setFiles(acceptedFiles);
    }
  };

  const startQC = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          navigate("/results", { state: { files } });
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card className={cn("w-full max-w-2xl", className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-biotech-500" />
          <span>Upload FASTQ Files</span>
        </CardTitle>
        <CardDescription>
          Upload your NGS short read data for quality control analysis.
          Supported formats: <code>.fastq</code>, <code>.fq</code>, <code>.fastq.gz</code>, <code>.fq.gz</code> (up to 100 MB each).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Drop Zone */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            dragActive ? "border-biotech-500 bg-biotech-50" : "border-gray-300",
            "hover:border-biotech-400 hover:bg-gray-50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload
            className={cn(
              "mx-auto h-12 w-12 mb-4",
              dragActive ? "text-biotech-500" : "text-gray-400"
            )}
          />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Drop your FASTQ files here
          </p>
          <p className="text-sm text-gray-600 mb-4">or click to browse</p>

          <input
            type="file"
            multiple
            accept=".fastq,.fq,.fastq.gz,.fq.gz,application/gzip"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />

          <Button asChild variant="outline">
            <label htmlFor="file-upload" className="cursor-pointer">
              Browse Files
            </label>
          </Button>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Selected Files:</h3>
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-biotech-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <CheckCircle className="h-5 w-5 text-science-500" />
              </div>
            ))}
          </div>
        )}

        {/* File Error Message */}
        {fileError && (
          <div className="text-red-600 text-sm mb-2">{fileError}</div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">
                Processing...
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(uploadProgress)}%
              </span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={startQC}
          disabled={files.length === 0 || isUploading}
          className="w-full bg-biotech-500 hover:bg-biotech-600"
          size="lg"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Quality Control...
            </>
          ) : (
            <>
              <BarChart3 className="mr-2 h-4 w-4" />
              Start Quality Control Analysis
            </>
          )}
        </Button>

        {/* Info Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Quality control analysis typically takes 2–5 minutes per file depending on size.
            You’ll get FastQC-style reports with sequence quality, GC content, and adapter content.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default UploadSection;
