import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  MapPin,
  Phone,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";

interface Report {
  _id: string;
  location?: string;
  severity?: "low" | "medium" | "high";
  status?: "pending" | "in-progress" | "resolved" | "dismissed";
  dogCount?: string;
  description?: string;
  contactNumber?: string;
  timestamp?: string;
  reportedBy?: string;
  photos?: string[];
}

export function ReportDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`/api/reports/${id}`);
        setReport(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const getSeverityColor = (severity?: string) => {
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

  const getStatusColor = (status?: string) => {
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

  const getStatusIcon = (status?: string) => {
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

  if (loading) return <p className="text-center mt-10">Loading report...</p>;
  if (!report)
    return <p className="text-center mt-10 text-red-500">Report not found.</p>;

  return (
    <div className="max-w-3xl mx-auto my-8">
      <Button variant="outline" className="mb-4" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 flex-wrap">
              <span>Report Details - {report._id}</span>

              <Badge className={getSeverityColor(report.severity)}>
                {report.severity?.toUpperCase() || "UNKNOWN"}
              </Badge>

              <Badge className={getStatusColor(report.status)}>
                {getStatusIcon(report.status)}
                <span className="ml-1">
                  {report.status?.replace("-", " ").toUpperCase() || "UNKNOWN"}
                </span>
              </Badge>
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Reported by: {report.reportedBy || "Unknown"} |{" "}
              {report.timestamp
                ? new Date(report.timestamp).toLocaleString()
                : "Unknown date"}
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-gray-700">
              {report.description || "No description provided."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                {report.location || "Unknown location"}
              </p>

              <p className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-1" />
                {report.contactNumber || "N/A"}
              </p>

              <p className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                {report.timestamp
                  ? new Date(report.timestamp).toLocaleString()
                  : "Unknown date"}
              </p>

              <p className="text-sm text-gray-600">
                Dogs Involved: {report.dogCount || "N/A"}
              </p>
            </div>

            {report.photos && report.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                {report.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Report Photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
