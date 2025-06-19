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

// Mock data for FastQC-style visualizations
const qualityData = [
  { position: 1, mean: 38, median: 39, q25: 37, q75: 40 },
  { position: 10, mean: 37, median: 38, q25: 36, q75: 39 },
  { position: 20, mean: 36, median: 37, q25: 35, q75: 38 },
  { position: 30, mean: 35, median: 36, q25: 34, q75: 37 },
  { position: 40, mean: 33, median: 34, q25: 32, q75: 35 },
  { position: 50, mean: 30, median: 31, q25: 29, q75: 32 },
  { position: 60, mean: 28, median: 29, q25: 27, q75: 30 },
  { position: 70, mean: 25, median: 26, q25: 24, q75: 27 },
  { position: 80, mean: 22, median: 23, q25: 21, q75: 24 },
  { position: 90, mean: 20, median: 21, q25: 19, q75: 22 },
  { position: 100, mean: 18, median: 19, q25: 17, q75: 20 },
];

const gcContentData = [
  { gc: 0, count: 12 },
  { gc: 10, count: 45 },
  { gc: 20, count: 123 },
  { gc: 30, count: 234 },
  { gc: 40, count: 456 },
  { gc: 50, count: 678 },
  { gc: 60, count: 345 },
  { gc: 70, count: 123 },
  { gc: 80, count: 67 },
  { gc: 90, count: 23 },
  { gc: 100, count: 8 },
];

const sequenceLengthData = [
  { length: 36, count: 234 },
  { length: 100, count: 5678 },
  { length: 150, count: 12345 },
  { length: 151, count: 987654 },
];

const adapterData = [
  { position: 1, illumina: 0, nextera: 0, polyA: 0 },
  { position: 20, illumina: 0, nextera: 0, polyA: 0 },
  { position: 40, illumina: 0.1, nextera: 0, polyA: 0 },
  { position: 60, illumina: 0.5, nextera: 0.1, polyA: 0 },
  { position: 80, illumina: 1.2, nextera: 0.3, polyA: 0.1 },
  { position: 100, illumina: 2.8, nextera: 0.8, polyA: 0.2 },
  { position: 120, illumina: 5.4, nextera: 1.9, polyA: 0.5 },
  { position: 140, illumina: 12.3, nextera: 4.2, polyA: 1.1 },
  { position: 151, illumina: 18.7, nextera: 7.8, polyA: 2.3 },
];

interface QCVisualizationProps {
  filename: string;
}

const QCVisualization = ({ filename }: QCVisualizationProps) => {
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
    { name: "Basic Statistics", status: "pass", icon: BarChart3 },
    { name: "Per base sequence quality", status: "pass", icon: TrendingUp },
    { name: "Per sequence quality scores", status: "pass", icon: BarChart3 },
    { name: "Per base sequence content", status: "warn", icon: Dna },
    { name: "Per sequence GC content", status: "pass", icon: BarChart3 },
    { name: "Per base N content", status: "pass", icon: TrendingUp },
    { name: "Sequence Length Distribution", status: "pass", icon: BarChart3 },
    { name: "Adapter Content", status: "warn", icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Dna className="h-6 w-6 text-biotech-500" />
            <span>QC Report: {filename}</span>
          </CardTitle>
          <CardDescription>
            FastQC-style quality control analysis results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-biotech-600">2.1M</p>
              <p className="text-sm text-gray-600">Total Sequences</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-science-600">151 bp</p>
              <p className="text-sm text-gray-600">Sequence Length</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-700">49%</p>
              <p className="text-sm text-gray-600">GC Content</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-quality-excellent">Q35</p>
              <p className="text-sm text-gray-600">Avg Quality</p>
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
                    <Icon className="h-5 w-5 text-biotech-500" />
                    <span className="font-medium">{module.name}</span>
                  </div>
                  <Badge
                    variant={module.status === "pass" ? "default" : "secondary"}
                    className={
                      module.status === "pass"
                        ? "bg-quality-excellent text-white"
                        : module.status === "warn"
                          ? "bg-quality-warning text-white"
                          : "bg-quality-fail text-white"
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

      {/* Detailed Charts */}
      <Tabs defaultValue="quality" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quality">Quality Scores</TabsTrigger>
          <TabsTrigger value="gc">GC Content</TabsTrigger>
          <TabsTrigger value="length">Length Dist.</TabsTrigger>
          <TabsTrigger value="adapters">Adapters</TabsTrigger>
        </TabsList>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Per Base Sequence Quality</CardTitle>
              <CardDescription>
                Quality scores across all bases. Higher is better, above 20 is
                good, above 30 is excellent.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={qualityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="position" />
                  <YAxis domain={[0, 40]} />
                  <Tooltip />
                  <defs>
                    <linearGradient
                      id="qualityGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#16a34a" stopOpacity={0.1} />
                      <stop
                        offset="25%"
                        stopColor="#22c55e"
                        stopOpacity={0.1}
                      />
                      <stop
                        offset="50%"
                        stopColor="#f59e0b"
                        stopOpacity={0.1}
                      />
                      <stop
                        offset="100%"
                        stopColor="#ef4444"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="q75"
                    stackId="1"
                    stroke="none"
                    fill="url(#qualityGradient)"
                  />
                  <Line
                    type="monotone"
                    dataKey="mean"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="median"
                    stroke="#16a34a"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Per Sequence GC Content</CardTitle>
              <CardDescription>
                Distribution of GC content across all sequences (normal
                distribution expected)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={gcContentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="gc" />
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
                    name="Illumina Universal"
                  />
                  <Line
                    type="monotone"
                    dataKey="nextera"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Nextera Transposase"
                  />
                  <Line
                    type="monotone"
                    dataKey="polyA"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Poly-A"
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
