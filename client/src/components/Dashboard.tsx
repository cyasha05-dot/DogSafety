import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { motion } from "motion/react";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Calendar,
  Eye,
  Users,
} from "lucide-react";
import { toast } from "sonner";

interface Report {
  _id: string;
  location: string;
  severity: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "resolved" | "dismissed";
  dogCount: string;
  description: string;
  contactNumber: string;
  timestamp: string;
  reportedBy: string;
}

export function Dashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch reports from backend
  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Report[]>(
        "http://localhost:5000/api/reports"
      );
      setReports(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Update status
  const updateReportStatus = async (
    reportId: string,
    newStatus: Report["status"]
  ) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/reports/${reportId}/status`,
        { status: newStatus }
      );
      setReports((prev) =>
        prev.map((r) => (r._id === reportId ? res.data : r))
      );
      toast.success("Report status updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  // Colors & Icons
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "dismissed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "in-progress":
        return <AlertTriangle className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "dismissed":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Filters
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;
    const matchesSeverity =
      severityFilter === "all" || report.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    inProgress: reports.filter((r) => r.status === "in-progress").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
    highSeverity: reports.filter((r) => r.severity === "high").length,
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: "Total Reports",
            value: stats.total,
            icon: Users,
            color: "text-blue-500",
          },
          {
            label: "Pending",
            value: stats.pending,
            icon: Clock,
            color: "text-orange-500",
          },
          {
            label: "In Progress",
            value: stats.inProgress,
            icon: AlertTriangle,
            color: "text-blue-500",
          },
          {
            label: "Resolved",
            value: stats.resolved,
            icon: CheckCircle,
            color: "text-green-500",
          },
          {
            label: "High Priority",
            value: stats.highSeverity,
            icon: AlertTriangle,
            color: "text-red-500",
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Search by location or report ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reports List */}
          {loading ? (
            <p>Loading reports...</p>
          ) : filteredReports.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No reports found.</p>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <Card key={report._id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6 flex flex-col lg:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{report._id}</Badge>
                        <Badge className={getSeverityColor(report.severity)}>
                          {report.severity.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(report.status)}>
                          {getStatusIcon(report.status)}
                          <span className="ml-1">
                            {report.status.replace("-", " ").toUpperCase()}
                          </span>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="flex items-center text-sm text-gray-600 mb-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {report.location}
                          </p>
                          <p className="flex items-center text-sm text-gray-600 mb-1">
                            <Phone className="h-4 w-4 mr-1" />
                            {report.contactNumber}
                          </p>
                          <p className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(report.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Dogs:</span>{" "}
                            {report.dogCount}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Reported by:</span>{" "}
                            {report.reportedBy}
                          </p>
                          <p className="text-sm text-gray-700 mt-2">
                            {report.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 lg:w-48">
                      <Select
                        value={report.status}
                        onValueChange={(value: Report["status"]) =>
                          updateReportStatus(report._id, value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="dismissed">Dismissed</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
