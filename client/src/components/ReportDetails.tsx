import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../api/axios";
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

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

import { motion } from "motion/react";

// ========================
// INTERFACE
// ========================
interface Report {
  _id: string;
  location?: string;
  severity?: "Aggressive" | "Struck" | "Injured";
  status?: "pending" | "in-progress" | "resolved" | "dismissed";
  dogCount?: string;
  description?: string;
  contactNumber?: string;
  timestamp?: string;
  reportedBy?: string;
  photos?: string[];
}

// ========================
// MAIN PAGE
// ========================
export function ReportDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Action loading state
  const [actionLoading, setActionLoading] = useState(false);

  // ========================
  // FETCH REPORT
  // ========================
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/reports/${id}`);
        // console.log(res.data);
        setReport(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  // ========================
  // ADMIN ACTION HANDLER
  // ========================
  const handleStatusUpdate = async (
    newStatus: "pending" | "in-progress" | "resolved" | "dismissed",
  ) => {
    try {
      setActionLoading(true);

      await api.put(`/reports/${id}/status`, {
        status: newStatus,
      });

      // Update state immediately
      setReport((prev) => (prev ? { ...prev, status: newStatus } : prev));

      toast.success(`Status updated to: ${newStatus.toUpperCase()}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  // ========================
  // STYLE HELPERS
  // ========================
  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "Injured":
        return "bg-red-100 text-red-800 border-red-200";
      case "Struck":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Aggressive":
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

  // ========================
  // RENDER
  // ========================
  if (loading) return <p className="text-center mt-10">Loading report...</p>;
  if (!report)
    return <p className="text-center mt-10 text-red-500">Report not found.</p>;

  return (
    <div className="w-full min-h-screen px-8 py-10 bg-background text-foreground">
      {/* Back Button */}
      <Button
        variant="outline"
        className="mb-6 text-lg px-4 py-2"
        onClick={() => navigate(-1)}
      >
        ← Back
      </Button>

      {/* Animated Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* MAIN CARD */}
        <Card className="w-full shadow-lg rounded-xl border border-border">
          <CardHeader>
            <CardTitle className="flex items-center flex-wrap gap-4 text-2xl font-semibold">
              <span>Report Details - {report._id}</span>

              <Badge
                className={`${getSeverityColor(
                  report.severity,
                )} text-base px-3 py-1`}
              >
                {report.severity?.toUpperCase() || "UNKNOWN"}
              </Badge>

              <Badge
                className={`${getStatusColor(
                  report.status,
                )} text-base px-3 py-1 flex items-center`}
              >
                {getStatusIcon(report.status)}
                <span className="ml-2">
                  {report.status?.replace("-", " ").toUpperCase() || "UNKNOWN"}
                </span>
              </Badge>
            </CardTitle>

            <p className="text-lg text-muted-foreground mt-1">
              Reported by:{" "}
              <span className="font-medium">
                {report.reportedBy || "Unknown"}
              </span>{" "}
              •{" "}
              {report.timestamp
                ? new Date(report.timestamp).toLocaleString()
                : "Unknown date"}
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* DESCRIPTION */}
            <p className="text-xl leading-relaxed text-foreground">
              {report.description || "No description provided."}
            </p>

            {/* DETAILS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
              <p className="flex items-center text-muted-foreground">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="font-medium">
                  {report.location || "Unknown location"}
                </span>
              </p>

              <p className="flex items-center text-muted-foreground">
                <Phone className="h-5 w-5 mr-2" />
                <span className="font-medium">
                  {report.contactNumber || "N/A"}
                </span>
              </p>

              <p className="flex items-center text-muted-foreground">
                <Calendar className="h-5 w-5 mr-2" />
                <span className="font-medium">
                  {report.timestamp
                    ? new Date(report.timestamp).toLocaleString()
                    : "Unknown date"}
                </span>
              </p>

              <p className="text-muted-foreground">
                Dogs Involved:{" "}
                <span className="font-medium">{report.dogCount || "N/A"}</span>
              </p>
            </div>

            {/* PHOTO GRID */}
            {report.photos && report.photos.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Photos</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {report.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      onClick={() => setSelectedPhoto(photo)}
                      alt={`Report Photo ${index + 1}`}
                      className="w-full h-40 object-cover rounded-xl cursor-pointer hover:scale-[1.03] transition-transform"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ADMIN ACTION BUTTONS */}
            {/* ---------------------- ADMIN ACTION BUTTONS ---------------------- */}
            <div className="mt-10 flex flex-wrap gap-4 z-50">
              {/* PENDING → IN-PROGRESS */}
              {report.status === "pending" && (
                <>
                  <Button
                    disabled={actionLoading}
                    onClick={() => handleStatusUpdate("in-progress")}
                    className="px-6 py-3 text-lg "
                  >
                    Mark In-Progress
                  </Button>

                  <Button
                    variant="destructive"
                    disabled={actionLoading}
                    onClick={() => handleStatusUpdate("dismissed")}
                    className="px-6 py-3 text-lg"
                  >
                    Dismiss
                  </Button>
                </>
              )}

              {/* IN-PROGRESS → RESOLVED */}
              {report.status === "in-progress" && (
                <>
                  <Button
                    disabled={actionLoading}
                    onClick={() => handleStatusUpdate("resolved")}
                    className="px-6 py-3 text-lg "
                  >
                    Resolve Report
                  </Button>

                  <Button
                    variant="destructive"
                    disabled={actionLoading}
                    onClick={() => handleStatusUpdate("dismissed")}
                    className="px-6 py-3 text-lg "
                  >
                    Dismiss
                  </Button>
                </>
              )}

              {/* RESOLVED */}
              {report.status === "resolved" && (
                <p className="text-lg text-green-700 font-medium">
                  ✔ This report is resolved.
                </p>
              )}

              {/* DISMISSED */}
              {report.status === "dismissed" && (
                <p className="text-lg text-red-700 font-medium">
                  ✖ This report is dismissed.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* PHOTO MODAL */}
      <Dialog
        open={!!selectedPhoto}
        onOpenChange={() => setSelectedPhoto(null)}
      >
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          <DialogHeader className="p-4">
            <DialogTitle className="text-xl">Photo Preview</DialogTitle>
          </DialogHeader>
          <img
            src={selectedPhoto || ""}
            alt="Preview"
            className="w-full max-h-[85vh] object-contain bg-black"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
