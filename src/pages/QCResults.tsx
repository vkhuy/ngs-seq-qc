import { useLocation, Link } from "react-router-dom";
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
import { ArrowLeft, Download, Share2, RefreshCw } from "lucide-react";

const QCResults = () => {
  const location = useLocation();
  const files = location.state?.files || [];

  if (files.length === 0) {
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
              Analysis completed for {files.length} file
              {files.length > 1 ? "s" : ""}
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
                <Badge className="bg-quality-excellent text-white">PASS</Badge>
                <span className="text-2xl font-bold text-gray-900">
                  Good Quality
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                7/8 modules passed quality checks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Processing Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">2m 34s</div>
              <p className="text-sm text-gray-600 mt-2">
                Faster than 85% of similar files
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">2 items</div>
              <p className="text-sm text-gray-600 mt-2">
                Minor adapter contamination detected
              </p>
            </CardContent>
          </Card>
        </div>

        {/* File Results */}
        <div className="space-y-8">
          {files.map((file: File, index: number) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  File {index + 1}: {file.name}
                </h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </Badge>
                  <Badge className="bg-quality-excellent text-white">
                    PASS
                  </Badge>
                </div>
              </div>

              <QCVisualization filename={file.name} />

              {index < files.length - 1 && (
                <div className="border-t border-gray-200 my-12"></div>
              )}
            </div>
          ))}
        </div>

        {/* Action Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Card className="bg-gradient-to-r from-biotech-50 to-science-50">
            <CardContent className="text-center py-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Analysis Complete!
              </h3>
              <p className="text-gray-600 mb-6">
                Your sequencing data quality looks good. You can proceed with
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
