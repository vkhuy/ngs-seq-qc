import Navigation from "@/components/Navigation";
import UploadSection from "@/components/UploadSection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dna, Zap, Shield, BarChart3, CheckCircle, Users } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Zap,
      title: "Fast Processing",
      description:
        "Analyze large FASTQ files in minutes with optimized algorithms",
    },
    {
      icon: BarChart3,
      title: "Comprehensive Reports",
      description:
        "FastQC-style visualizations with quality metrics and statistics",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your data is processed securely and never stored permanently",
    },
    {
      icon: CheckCircle,
      title: "Quality Assured",
      description:
        "Industry-standard QC checks for reliable sequencing data analysis",
    },
  ];

  const stats = [
    { label: "Files Processed", value: "∞∞", icon: Dna },
    { label: "Labs Using SeqQC", value: "∞∞", icon: Users },
    { label: "Avg Processing Time", value: "3 min", icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-biotech-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            NGS Quality Control
            <span className="block text-biotech-600">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Upload your FASTQ files and get comprehensive quality control
            reports in minutes. Professional-grade analysis with FastQC-style
            visualizations for your sequencing data.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              FASTQ
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              FastQC Compatible
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Illumina
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              NGS
            </Badge>
          </div>
        </div>

        {/* Upload Section */}
        <div className="flex justify-center mb-20">
          <UploadSection />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-biotech-100">
                      <Icon className="h-8 w-8 text-biotech-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose SeqQC?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built for researchers, by researchers. Get the insights you need
              to ensure your sequencing data is ready for analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full bg-science-100">
                        <Icon className="h-6 w-6 text-science-600" />
                      </div>
                    </div>
                    <CardTitle className="text-center text-lg">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-biotech-500 to-science-500 text-white">
          <CardContent className="text-center py-12">
            <h3 className="text-2xl font-bold mb-4">
              Ready to analyze your data?
            </h3>
            <p className="text-lg opacity-90 mb-6">
              Upload your FASTQ files above and get started with professional
              quality control analysis.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm opacity-75">
              <span>✓ No registration required</span>
              <span>✓ Files processed securely</span>
              <span>✓ Results available instantly</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
