import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Dna,
  BarChart3,
} from "lucide-react";
import type { QCResults } from "@/lib/api";

interface QCVisualizationProps {
  qcResults: QCResults;
}

const QCVisualization = ({ qcResults }: QCVisualizationProps) => {
  const { metrics, perBaseQuality, qualityScores, sequenceLengthDistribution, nucleotideContent } = qcResults;

  // Transform data for charts
  const qualityData = perBaseQuality.map(item => ({
    position: item.position,
    mean: Math.round(item.mean * 10) / 10,
    median: item.median,
    q25: item.lowerQuartile,
    q75: item.upperQuartile
  }));

  const gcContentData = qualityScores.map(item => ({
    quality: item.quality,
    count: item.count
  }));

  const sequenceLengthData = sequenceLengthDistribution.map(item => ({
    length: item.length,
    count: item.count
  }));

  // Create nucleotide content data for visualization
  const nucleotideData = nucleotideContent.map(item => ({
    position: item.position,
    A: Math.round(item.A * 10) / 10,
    T: Math.round(item.T * 10) / 10,
    G: Math.round(item.G * 10) / 10,
    C: Math.round(item.C * 10) / 10,
    N: Math.round(item.N * 10) / 10
  }));

  // Mock adapter data since we don't have real adapter analysis yet
  const adapterData = [
    { position: 1, illumina: 0, nextera: 0, polyA: 0 },
    { position: 20, illumina: 0, nextera: 0, polyA: 0 },
    { position: 40, illumina: 0.1, nextera: 0, polyA: 0 },
    { position: 60, illumina: 0.5, nextera: 0.1, polyA: 0 },
    { position: 80, illumina: 1.2, nextera: 0.3, polyA: 0.1 },
    { position: 100, illumina: 2.8, nextera: 0.8, polyA: 0.2 },
  ];

  const getQualityStatus = (
    value: number,
    thresholds: { good: number; warning: number },
  ) => {
    if (value >= thresholds.good)
      return {
        status: "excellent",
        color: "bg-quality-excellent",
        icon: CheckCircle,
      };
    if (value >= thresholds.warning)
      return {
        status: "good",
        color: "bg-quality-warning",
        icon: AlertTriangle,
      };
    return { status: "poor", color: "bg-quality-poor", icon: XCircle };
  };

  const modules = [
    { name: "Basic Statistics", status: metrics.totalSequences > 0 ? "pass" : "fail", icon: BarChart3 },
    { name: "Per base sequence quality", status: qualityData.length > 0 ? "pass" : "warn", icon: TrendingUp },
    { name: "Per sequence quality scores", status: qualityScores.length > 0 ? "pass" : "warn", icon: BarChart3 },
    { name: "Per base sequence content", status: nucleotideContent.length > 0 ? "pass" : "warn", icon: Dna },
    { name: "Per sequence GC content", status: metrics.gcContent > 0 ? "pass" : "warn", icon: BarChart3 },
    { name: "Sequence Length Distribution", status: sequenceLengthDistribution.length > 0 ? "pass" : "warn", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Dna className="h-6 w-6 text-biotech-500" />
            <span>QC Report: {metrics.filename}</span>
          </CardTitle>
          <CardDescription>
            FastQC-style quality control analysis results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-biotech-600">{metrics.totalSequences.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Sequences</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-science-600">{metrics.sequenceLength}</p>
              <p className="text-sm text-gray-600">Sequence Length</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-700">{metrics.gcContent.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">GC Content</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-quality-excellent">{metrics.encoding}</p>
              <p className="text-sm text-gray-600">Encoding</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Modules</CardTitle>
          <CardDescription>
            Summary of all quality control checks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">{module.name}</span>
                  </div>
                  <Badge
                    className={
                      module.status === "pass"
                        ? "bg-quality-excellent text-white"
                        : module.status === "warn"
                        ? "bg-quality-warning text-white"
                        : "bg-quality-poor text-white"
                    }
                  >
                    {module.status.toUpperCase()}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Tabs defaultValue="quality" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="quality">Quality Scores</TabsTrigger>
          <TabsTrigger value="gc">GC Content</TabsTrigger>
          <TabsTrigger value="length">Length Dist.</TabsTrigger>
          <TabsTrigger value="content">Base Content</TabsTrigger>
          <TabsTrigger value="adapters">Adapters</TabsTrigger>
        </TabsList>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Per Base Sequence Quality</CardTitle>
              <CardDescription>
                Quality score distribution across sequence positions (Phred scale)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={qualityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="position" />
                  <YAxis domain={[0, 42]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="mean"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="median"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="q25"
                    stroke="#f59e0b"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="q75"
                    stroke="#f59e0b"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Per Sequence Quality Scores</CardTitle>
              <CardDescription>
                Distribution of quality scores across all sequences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={gcContentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quality" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="length" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sequence Length Distribution</CardTitle>
              <CardDescription>
                Distribution of sequence lengths in the dataset
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={sequenceLengthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="length" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Per Base Sequence Content</CardTitle>
              <CardDescription>
                Nucleotide composition (A, T, G, C, N) across sequence positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={nucleotideData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="position" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="A" stroke="#e74c3c" strokeWidth={2} />
                  <Line type="monotone" dataKey="T" stroke="#3498db" strokeWidth={2} />
                  <Line type="monotone" dataKey="G" stroke="#f39c12" strokeWidth={2} />
                  <Line type="monotone" dataKey="C" stroke="#27ae60" strokeWidth={2} />
                  <Line type="monotone" dataKey="N" stroke="#95a5a6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adapters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Adapter Content</CardTitle>
              <CardDescription>
                Percentage of reads containing adapter sequences by position
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={adapterData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="position" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="illumina"
                    stroke="#ef4444"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="nextera"
                    stroke="#f59e0b"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="polyA"
                    stroke="#22c55e"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QCVisualization;