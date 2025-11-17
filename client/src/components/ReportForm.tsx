import { useState } from "react";
import api from "../api/axios";
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
import {
  CheckCircle,
  MapPin,
  Camera,
  AlertTriangle,
  Navigation,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

// ✅ Corrected Types
interface FormDataType {
  name: string;
  email: string;
  location: string;
  description: string;
  severity: "Aggressive" | "Struck" | "Injured" | "";
  dogCount: number;
  contactNumber: string;
  photos: File[];
}

export function ReportForm() {
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    location: "",
    description: "",
    severity: "",
    dogCount: 0,
    contactNumber: "",
    photos: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

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

  const getCurrentLocation = () => {
    setGpsLoading(true);

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported on this device.");
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const locationText = `Lat: ${latitude.toFixed(
          6
        )}, Long: ${longitude.toFixed(6)}`;

        setFormData((prev) => ({ ...prev, location: locationText }));
        setGpsLoading(false);
        toast.success("Location fetched!");
      },
      (err) => {
        console.error(err);
        toast.error("Unable to fetch location.");
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "photos") {
          formData.photos.forEach((photo) =>
            formDataToSend.append("photos", photo)
          );
        } else {
          formDataToSend.append(key, value as string);
        }
      });

      const res = await api.post("/reports", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(
        `Report submitted successfully! Incident ID: #${res.data.report._id}`
      );

      setSubmitted(true);

      setFormData({
        name: "",
        email: "",
        location: "",
        description: "",
        severity: "",
        dogCount: 0,
        contactNumber: "",
        photos: [],
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto mt-6">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Report Submitted Successfully!
            </h3>
            <p className="text-green-700">
              Municipal authorities have been notified.
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
            {/* Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> Location
              </Label>

              <div className="flex gap-2">
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
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

            {/* Contact Number */}
            <div>
              <Label>Contact Number</Label>
              <Input
                value={formData.contactNumber}
                onChange={(e) =>
                  setFormData({ ...formData, contactNumber: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Severity</label>

              <Select
                value={formData.severity}
                onValueChange={(value: "Aggressive" | "Struck" | "Injured") =>
                  setFormData({ ...formData, severity: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Aggressive">Aggressive</SelectItem>
                  <SelectItem value="Struck">Struck</SelectItem>
                  <SelectItem value="Injured">Injured</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Number of Dogs</Label>
              <Input
                type="number"
                min="1"
                value={formData.dogCount}
                onChange={(e) =>
                  setFormData({ ...formData, dogCount: Number(e.target.value) })
                }
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="min-h-[100px]"
              />
            </div>

            {/* Photos */}
            <div>
              <Label className="flex items-center gap-1">
                <Camera className="h-4 w-4" /> Photos (Optional)
              </Label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
              />

              {formData.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {formData.photos.map((photo, i) => (
                    <div key={i} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        className="h-20 w-full object-cover rounded"
                      />

                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 rounded-full"
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
