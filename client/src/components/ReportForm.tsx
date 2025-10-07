import { useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import {
  MapPin,
  Camera,
  Clock,
  AlertTriangle,
  Upload,
  CheckCircle,
  Navigation,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface FormDataType {
  location: string;
  description: string;
  severity: "low" | "medium" | "high" | "";
  dogCount: "1-2" | "3-5" | "6-10" | "10+" | "";
  contactNumber: string;
  photos: File[];
}

export function ReportForm() {
  const [formData, setFormData] = useState<FormDataType>({
    location: "",
    description: "",
    severity: "",
    dogCount: "",
    contactNumber: "",
    photos: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string>("");

  // Handle photo selection
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...files] }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  // Get GPS location
  const getCurrentLocation = () => {
    setGpsLoading(true);
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mockAddress = `Lat: ${latitude.toFixed(
          6
        )}, Long: ${longitude.toFixed(6)}`;
        setCurrentLocation(mockAddress);
        setFormData((prev) => ({ ...prev, location: mockAddress }));
        setGpsLoading(false);
        toast.success("Location detected successfully!");
      },
      (error) => {
        setGpsLoading(false);
        toast.error("Unable to retrieve location. Please enter manually.");
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("location", formData.location);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("severity", formData.severity);
      formDataToSend.append("dogCount", formData.dogCount);
      formDataToSend.append("contactNumber", formData.contactNumber);

      formData.photos.forEach((photo) =>
        formDataToSend.append("photos", photo)
      );

      const res = await axios.post(
        "http://localhost:5000/api/reports",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(
        `Report submitted successfully! Incident ID: #${res.data.report._id}`
      );

      setSubmitted(true);
      setFormData({
        location: "",
        description: "",
        severity: "",
        dogCount: "",
        contactNumber: "",
        photos: [],
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto mt-6">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Report Submitted Successfully!
            </h3>
            <p className="text-green-700 mb-4">
              Municipal authorities have been notified and will respond shortly.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>Report Street Dog Incident</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="flex items-center space-x-1"
                >
                  <MapPin className="h-4 w-4" /> Location / Address
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="location"
                    placeholder="Street name, landmark, area..."
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    required
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={getCurrentLocation}
                    disabled={gpsLoading}
                  >
                    {gpsLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Navigation className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.contactNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactNumber: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="severity">Incident Severity</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value: "low" | "medium" | "high") =>
                    setFormData((prev) => ({ ...prev, severity: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dogCount">Number of Dogs</Label>
                <Select
                  value={formData.dogCount}
                  onValueChange={(value: "1-2" | "3-5" | "6-10" | "10+") =>
                    setFormData((prev) => ({ ...prev, dogCount: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 dogs</SelectItem>
                    <SelectItem value="3-5">3-5 dogs</SelectItem>
                    <SelectItem value="6-10">6-10 dogs</SelectItem>
                    <SelectItem value="10+">More than 10 dogs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Incident Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the incident, dog behavior, any injuries..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center space-x-1">
                <Camera className="h-4 w-4" /> Photo Evidence (Optional)
              </Label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
              />
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {formData.photos.map((photo, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`upload-${idx}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
