import { useState } from "react";
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
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import {
  Stethoscope,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Heart,
  CheckCircle,
  User,
  PawPrint,
  Star,
} from "lucide-react";
import { toast } from "sonner";

interface Appointment {
  id: string;
  doctorName: string;
  specialization: string;
  time: string;
  date: string;
  location: string;
  rating: number;
  experience: string;
  image: string;
}

interface FormData {
  patientName: string;
  contactNumber: string;
  animalType: string;
  urgency: string;
  symptoms: string;
  preferredDate: string;
  preferredTime: string;
  selectedDoctor: string;
}

const availableDoctors: Appointment[] = [
  {
    id: "1",
    doctorName: "Dr. Sarah Johnson",
    specialization: "Emergency Animal Care",
    time: "9:00 AM - 6:00 PM",
    date: "Available Today",
    location: "City Veterinary Hospital",
    rating: 4.9,
    experience: "15+ years",
    image:
      "https://images.unsplash.com/photo-1644675443401-ea4c14bad0e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXRlcmluYXJpYW4lMjBhbmltYWwlMjBkb2N0b3IlMjBjbGluaWN8ZW58MXx8fHwxNzU4NzIxMzMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "2",
    doctorName: "Dr. Michael Chen",
    specialization: "Animal Behavior & Training",
    time: "10:00 AM - 8:00 PM",
    date: "Available Tomorrow",
    location: "Pet Care Clinic",
    rating: 4.8,
    experience: "12+ years",
    image:
      "https://images.unsplash.com/photo-1644675443401-ea4c14bad0e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXRlcmluYXJpYW4lMjBhbmltYWwlMjBkb2N0b3IlMjBjbGluaWN8ZW58MXx8fHwxNzU4NzIxMzMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "3",
    doctorName: "Dr. Emily Rodriguez",
    specialization: "Wildlife & Street Animal Care",
    time: "8:00 AM - 4:00 PM",
    date: "Available Today",
    location: "Animal Welfare Center",
    rating: 5.0,
    experience: "20+ years",
    image:
      "https://images.unsplash.com/photo-1644675443401-ea4c14bad0e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXRlcmluYXJpYW4lMjBhbmltYWwlMjBkb2N0b3IlMjBjbGluaWN8ZW58MXx8fHwxNzU4NzIxMzMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

export function AnimalDoctor() {
  const [formData, setFormData] = useState<FormData>({
    patientName: "",
    contactNumber: "",
    animalType: "",
    urgency: "",
    symptoms: "",
    preferredDate: "",
    preferredTime: "",
    selectedDoctor: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setSubmitted(true);
    toast.success(
      "Appointment booked successfully! Confirmation ID: #APT2024-001"
    );

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        patientName: "",
        contactNumber: "",
        animalType: "",
        urgency: "",
        symptoms: "",
        preferredDate: "",
        preferredTime: "",
        selectedDoctor: "",
      });
      setSelectedDoctorId(null);
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
                >
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Appointment Booked Successfully!
                  </h3>
                  <p className="text-green-700 mb-4">
                    Your appointment has been confirmed. Reference ID:{" "}
                    <Badge variant="outline" className="text-green-800">
                      #APT2024-001
                    </Badge>
                  </p>
                  <p className="text-sm text-green-600">
                    You will receive a confirmation call within 30 minutes.
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-4 mb-12"
      >
        <div className="flex items-center justify-center space-x-2 mb-4">
          <motion.div
            initial={{ rotate: -180 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Stethoscope className="h-8 w-8 text-blue-600" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900">
            Animal Care Services
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Professional veterinary care for street animals and pets. Book
          appointments with certified animal doctors for emergency care,
          behavioral training, and health checkups.
        </p>
      </motion.div>

      {/* Available Doctors */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Heart className="h-6 w-6 text-red-500 mr-2" />
          Available Doctors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {availableDoctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 ${
                  selectedDoctorId === doctor.id
                    ? "ring-2 ring-blue-500 border-blue-500 shadow-lg"
                    : "hover:shadow-lg border-gray-200"
                }`}
                onClick={() => {
                  setSelectedDoctorId(doctor.id);
                  setFormData((prev) => ({
                    ...prev,
                    selectedDoctor: doctor.doctorName,
                  }));
                }}
              >
                <CardContent className="p-6">
                  <div className="relative mb-4">
                    <ImageWithFallback
                      src={doctor.image}
                      alt={doctor.doctorName}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Badge className="absolute top-2 right-2 bg-green-100 text-green-800">
                      {doctor.date}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {doctor.doctorName}
                      </h3>
                      <p className="text-sm text-blue-600">
                        {doctor.specialization}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span>{doctor.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{doctor.experience}</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{doctor.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{doctor.location}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Appointment Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span>Book Appointment</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Fill in the details to schedule an appointment with our animal
              care specialists.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Pet/Animal Name</Label>
                  <Input
                    id="patientName"
                    placeholder="Enter pet name or 'Street Dog' if stray"
                    value={formData.patientName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev) => ({
                        ...prev,
                        patientName: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.contactNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactNumber: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="animalType">Animal Type</Label>
                  <Select
                    value={formData.animalType}
                    onValueChange={(value: string) =>
                      setFormData((prev) => ({ ...prev, animalType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select animal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">Dog</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                      <SelectItem value="bird">Bird</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <Select
                    value={formData.urgency}
                    onValueChange={(value: string) =>
                      setFormData((prev) => ({ ...prev, urgency: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">
                        Emergency - Immediate care needed
                      </SelectItem>
                      <SelectItem value="urgent">
                        Urgent - Within 24 hours
                      </SelectItem>
                      <SelectItem value="routine">
                        Routine - Within a week
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="preferredDate">Preferred Date</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev) => ({
                        ...prev,
                        preferredDate: e.target.value,
                      }))
                    }
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredTime">Preferred Time</Label>
                  <Select
                    value={formData.preferredTime}
                    onValueChange={(value: string) =>
                      setFormData((prev) => ({ ...prev, preferredTime: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                      <SelectItem value="17:00">5:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms / Reason for Visit</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Describe the animal's condition, behavior, or reason for the appointment..."
                  value={formData.symptoms}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData((prev) => ({
                      ...prev,
                      symptoms: e.target.value,
                    }))
                  }
                  className="min-h-[100px]"
                  required
                />
              </div>

              {selectedDoctorId && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <PawPrint className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Selected Doctor
                      </p>
                      <p className="text-sm text-blue-700">
                        {
                          availableDoctors.find(
                            (d) => d.id === selectedDoctorId
                          )?.doctorName
                        }{" "}
                        -{" "}
                        {
                          availableDoctors.find(
                            (d) => d.id === selectedDoctorId
                          )?.specialization
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Booking Appointment..." : "Book Appointment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Emergency Contact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between"
      >
        <div className="flex items-center space-x-2 text-blue-700">
          <Phone className="h-5 w-5" />
          <span>Emergency Animal Helpline:</span>
        </div>
        <a
          href="tel:+919876543210"
          className="font-semibold text-blue-800 hover:underline"
        >
          +91 98765 43210
        </a>
      </motion.div>
    </div>
  );
}
