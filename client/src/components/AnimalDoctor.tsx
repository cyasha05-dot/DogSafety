// AnimalDoctor.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

import {
  Stethoscope,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Heart,
  CheckCircle,
  PawPrint,
  User,
  Star,
} from "lucide-react";
import api from "../api/axios";

/* ---------------------------
   Types
---------------------------- */
interface NearbyVet {
  placeId: string;
  name: string;
  address: string;
  rating?: number;
  userRatings?: number;
  openNow?: boolean;
  lat: number;
  lng: number;
  photo?: string | null;
  distanceKm?: number;
}

interface PlaceDetails {
  name?: string;
  formatted_phone_number?: string;
  formatted_address?: string;
  website?: string;
  opening_hours?: { weekday_text?: string[]; open_now?: boolean };
  reviews?: any[];
  photos?: any[];
  url?: string;
}

/* ---------------------------
   Fallback (6 mixed-style images)
---------------------------- */
const fallbackDoctors: NearbyVet[] = [
  {
    placeId: "f1",
    name: "Paws & Claws Veterinary Hospital",
    address: "Kothrud, Pune",
    rating: 4.8,
    userRatings: 120,
    lat: 18.516,
    lng: 73.841,
    photo:
      "https://static.vecteezy.com/system/resources/thumbnails/046/757/108/small/veterinarian-doctor-checking-cat-at-a-vet-clinic-photo.jpg",
    distanceKm: 2.1,
  },
  {
    placeId: "f2",
    name: "Happy Tails Pet Clinic",
    address: "Baner, Pune",
    rating: 4.7,
    userRatings: 86,
    lat: 18.564,
    lng: 73.785,
    photo:
      "https://assets.lybrate.com/f_auto,c_limit,w_3840,q_auto/img/documents/doctor/dp/293c8dafb5d83045ea17844dc25ace85/Veterinary-RashmiMahanta-Greater-Noida-f38de9.jpg",
    distanceKm: 3.4,
  },
  {
    placeId: "f3",
    name: "BlueCross Animal Rescue Center",
    address: "Camp, Pune",
    rating: 4.9,
    userRatings: 210,
    lat: 18.52,
    lng: 73.855,
    photo:
      "https://img.freepik.com/free-photo/close-up-veterinary-doctor-taking-care-pet_23-2149267900.jpg?semt=ais_incoming&w=740&q=80",
    distanceKm: 1.8,
  },
  {
    placeId: "f4",
    name: "Pet Wellness Clinic",
    address: "Wakad, Pune",
    rating: 4.6,
    userRatings: 64,
    lat: 18.598,
    lng: 73.738,
    photo:
      "https://static.vecteezy.com/system/resources/thumbnails/024/671/458/small/two-doctors-are-examining-him-veterinary-medicine-concept-pomeranian-in-veterinary-clinic-photo.jpg",
    distanceKm: 7.2,
  },
  {
    placeId: "f5",
    name: "Urban Pet Clinic",
    address: "Aundh, Pune",
    rating: 4.7,
    userRatings: 48,
    lat: 18.556,
    lng: 73.815,
    photo:
      "https://content.jdmagicbox.com/comp/goa/r8/0832px832.x832.150803170509.j1r8/catalogue/pet-concern-clinic-porvorim-goa-veterinary-doctors-ilsf6sukqt-250.jpg?w=640&q=75",
    distanceKm: 4.0,
  },
  {
    placeId: "f6",
    name: "ExoCare Veterinary Studio",
    address: "Hinjewadi, Pune",
    rating: 4.9,
    userRatings: 92,
    lat: 18.595,
    lng: 73.709,
    photo:
      "https://media.gettyimages.com/id/1532552092/photo/veterinarian-poses-with-golden-retriever-outside-a-clinic.jpg?s=612x612&w=0&k=20&c=o35icC9uMY6mxzPui2pz184KQHYy0Pb_5enBOvCcMMc=",
    distanceKm: 9.1,
  },
];

/* ---------------------------
   Helpers
---------------------------- */
// Haversine distance (km)
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/* ---------------------------
   Component
---------------------------- */
export default function AnimalDoctor() {
  const [nearbyDoctors, setNearbyDoctors] = useState<NearbyVet[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState<boolean>(false);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    patientName: string;
    contactNumber: string;
    animalType: string;
    urgency: string;
    symptoms: string;
    preferredDate: string;
    preferredTime: string;
    selectedDoctor: string;
  }>({
    patientName: "",
    contactNumber: "",
    animalType: "",
    urgency: "",
    symptoms: "",
    preferredDate: "",
    preferredTime: "",
    selectedDoctor: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Details modal
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [activeDetails, setActiveDetails] = useState<PlaceDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);

  /* ---------------------------
     Fetch nearby doctors from backend (max 6)
  ---------------------------- */
  const fetchDoctors = async (lat: number, lng: number): Promise<void> => {
    setLoadingDoctors(true);
    try {
      const res = await api.get(`/doctors/nearby?lat=${lat}&lng=${lng}`);
      const data =
        Array.isArray(res.data) && res.data.length > 0 ? res.data : null;

      if (!data) {
        // fallback to local fake doctors (limited to 6)
        setNearbyDoctors(fallbackDoctors);
        return;
      }

      const formatted: NearbyVet[] = data.slice(0, 6).map((p: any) => {
        const latP = p.lat ?? p.geometry?.location?.lat;
        const lngP = p.lng ?? p.geometry?.location?.lng;
        const distance =
          latP && lngP && lat && lng
            ? haversineKm(lat, lng, Number(latP), Number(lngP))
            : undefined;

        return {
          placeId: p.placeId || p.place_id || p.id || String(p.id),
          name: p.name || p.display_name || "Veterinary Clinic",
          address:
            p.address || p.vicinity || p.formatted_address || "Address unknown",
          rating: p.rating ?? undefined,
          userRatings: p.user_ratings_total ?? p.userRatings ?? undefined,
          openNow: p.opening_hours?.open_now ?? p.openNow ?? undefined,
          lat: Number(latP ?? lat),
          lng: Number(lngP ?? lng),
          photo:
            p.photo ??
            (p.photos && p.photos[0] && p.photos[0].getUrl
              ? p.photos[0].getUrl()
              : null),
          distanceKm: distance ? Math.round(distance * 10) / 10 : undefined,
        };
      });

      // if backend returned empty array, fallback
      setNearbyDoctors(formatted.length > 0 ? formatted : fallbackDoctors);
    } catch (err: unknown) {
      console.error("Fetch doctors error:", err);
      toast.error("Unable to fetch nearby doctors. Showing fallback list.");
      setNearbyDoctors(fallbackDoctors);
    } finally {
      setLoadingDoctors(false);
    }
  };

  /* ---------------------------
     Get user location on mount
  ---------------------------- */
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation not available. Showing fallback list.");
      setNearbyDoctors(fallbackDoctors);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos: GeolocationPosition) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        void fetchDoctors(pos.coords.latitude, pos.coords.longitude);
      },
      (err: GeolocationPositionError) => {
        console.warn("Geolocation denied/fail:", err);
        toast.warning(
          "Location denied or unavailable — showing fallback clinics (Pune area).",
        );
        setNearbyDoctors(fallbackDoctors);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------------------
     Open details modal (loads /api/doctors/details/:placeId)
  ---------------------------- */
  const openDetails = async (placeId: string): Promise<void> => {
    setDetailsLoading(true);
    setDetailsOpen(true);
    setActiveDetails(null);
    try {
      const res = await api.get(`/doctors/details/${placeId}`);
      setActiveDetails(res.data || null);
    } catch (err: unknown) {
      console.error("Failed to fetch place details:", err);
      toast.error("Failed to load details.");
      setActiveDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  /* ---------------------------
     Booking form submit
  ---------------------------- */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (!selectedDoctorId) return void toast.error("Select a doctor first.");

    setIsSubmitting(true);
    try {
      // Example: call your backend to create appointment
      // await axios.post('/api/appointments', { ...formData, doctorPlaceId: selectedDoctorId })
      await new Promise((r) => setTimeout(r, 1000)); // mock
      setSubmitted(true);
      toast.success("Appointment booked — confirmation will follow.");
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
      }, 2500);
    } catch (err: unknown) {
      console.error("Booking failed:", err);
      toast.error("Booking failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------------------
     Photo helper
  ---------------------------- */
  const photoUrlFromReference = (photoRef?: string | null): string => {
    if (!photoRef) return "/placeholder-vet.png";
    if (photoRef.startsWith("http")) return photoRef;
    return "/placeholder-vet.png";
  };

  /* ---------------------------
     Render
  ---------------------------- */
  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-green-800">
              Appointment Booked Successfully!
            </h2>
            <p className="text-green-700 mt-2">
              You will receive a confirmation call soon.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-8">
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2">
            <Stethoscope className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Animal Care Services</h1>
          </div>
          <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
            Find verified veterinary clinics near you and book appointments
            quickly.
          </p>
        </div>
      </motion.div>

      {/* DOCTORS LIST */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            Doctors Near You
          </h2>
          <div className="text-sm text-muted-foreground">
            {nearbyDoctors.length > 0
              ? `${nearbyDoctors.length} results`
              : loadingDoctors
                ? "Searching..."
                : "No results"}
          </div>
        </div>

        {loadingDoctors && (
          <p className="text-sm text-muted-foreground">
            Searching for vets close to you…
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {nearbyDoctors.length === 0 && !loadingDoctors && (
            <div className="col-span-full text-center text-gray-600">
              No nearby vets found. Try allowing location access or try again
              later.
            </div>
          )}

          {nearbyDoctors.map((doc) => (
            <Card
              key={doc.placeId}
              className={`cursor-pointer hover:shadow-lg transition ${
                selectedDoctorId === doc.placeId
                  ? "ring-2 ring-blue-500 border-blue-500"
                  : "border-gray-200"
              }`}
              onClick={() => {
                setSelectedDoctorId(doc.placeId);
                setFormData((p) => ({ ...p, selectedDoctor: doc.name }));
              }}
            >
              <CardContent className="p-4">
                <div className="relative mb-3">
                  <ImageWithFallback
                    src={photoUrlFromReference(doc.photo)}
                    alt={doc.name}
                    className="w-full h-36 object-cover rounded-lg"
                  />
                  <br></br>
                  <Badge className="absolute top-3 right-3 bg-blue-100 text-blue-800">
                    {doc.distanceKm !== undefined
                      ? `${doc.distanceKm} km`
                      : "Nearby"}
                  </Badge>
                </div>
                <br></br>

                <h3 className="font-semibold text-lg">{doc.name}</h3>
                <p className="text-sm text-gray-700 mt-1">{doc.address}</p>

                <div className="flex items-center justify-between mt-3">
                  <div className="text-sm text-gray-600 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />{" "}
                      <span>{doc.rating ?? "—"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />{" "}
                      <span className="text-xs text-muted-foreground">
                        {doc.userRatings ?? "—"}
                      </span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      void openDetails(doc.placeId);
                    }}
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <br></br>
      <br></br>

      {/* BOOKING FORM */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" /> Book Appointment
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Select a clinic above, fill details and submit.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Pet / Animal Name</Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((p) => ({
                        ...p,
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
                    value={formData.contactNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((p) => ({
                        ...p,
                        contactNumber: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Animal Type</Label>
                  <Select
                    value={formData.animalType}
                    onValueChange={(v: string) =>
                      setFormData((p) => ({ ...p, animalType: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select animal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dog">Dog</SelectItem>
                      <SelectItem value="Cat">Cat</SelectItem>
                      <SelectItem value="Bird">Bird</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Urgency</Label>
                  <Select
                    value={formData.urgency}
                    onValueChange={(v: string) =>
                      setFormData((p) => ({ ...p, urgency: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                      <SelectItem value="Routine">Routine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Preferred Date</Label>
                  <Input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((p) => ({
                        ...p,
                        preferredDate: e.target.value,
                      }))
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Preferred Time</Label>
                  <Select
                    value={formData.preferredTime}
                    onValueChange={(v: string) =>
                      setFormData((p) => ({ ...p, preferredTime: v }))
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

              <div>
                <Label>Symptoms / Reason</Label>
                <Textarea
                  value={formData.symptoms}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData((p) => ({ ...p, symptoms: e.target.value }))
                  }
                  className="min-h-[100px]"
                />
              </div>

              {selectedDoctorId && (
                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                  <PawPrint className="h-5 w-5 text-blue-600 inline-block mr-2" />
                  <strong>Selected Clinic:</strong>{" "}
                  <span className="ml-2">
                    {
                      nearbyDoctors.find((d) => d.placeId === selectedDoctorId)
                        ?.name
                    }
                  </span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Booking..." : "Book Appointment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* DETAILS DIALOG */}
      <Dialog
        open={detailsOpen}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setActiveDetails(null);
            setDetailsOpen(false);
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{activeDetails?.name || "Clinic details"}</DialogTitle>
          </DialogHeader>

          <div className="p-4">
            {detailsLoading && <p>Loading details…</p>}

            {!detailsLoading && activeDetails && (
              <>
                {activeDetails.photos && activeDetails.photos.length > 0 && (
                  <img
                    src={
                      activeDetails.photos[0].getUrl
                        ? activeDetails.photos[0].getUrl()
                        : "/placeholder-vet.png"
                    }
                    alt={activeDetails.name}
                    className="w-full h-56 object-cover rounded mb-4"
                  />
                )}

                <p className="text-sm text-muted-foreground">
                  {activeDetails.formatted_address}
                </p>

                <div className="mt-3 space-y-2">
                  {activeDetails.formatted_phone_number && (
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />{" "}
                      <a
                        href={`tel:${activeDetails.formatted_phone_number}`}
                        className="underline"
                      >
                        {activeDetails.formatted_phone_number}
                      </a>
                    </p>
                  )}

                  {activeDetails.website && (
                    <p className="flex items-center gap-2">
                      <a
                        href={activeDetails.website}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        Website
                      </a>
                    </p>
                  )}

                  {activeDetails.opening_hours?.weekday_text && (
                    <div>
                      <strong>Opening hours</strong>
                      <ul className="text-sm mt-2 list-disc pl-5">
                        {activeDetails.opening_hours.weekday_text!.map(
                          (txt, i) => (
                            <li key={i}>{txt}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                  {activeDetails.reviews &&
                    activeDetails.reviews.length > 0 && (
                      <div className="mt-3">
                        <strong>Reviews</strong>
                        <div className="space-y-2 mt-2 max-h-40 overflow-auto">
                          {activeDetails.reviews.slice(0, 6).map((r, i) => (
                            <div key={i} className="p-2 border rounded">
                              <div className="text-sm font-medium">
                                {r.author_name} —{" "}
                                <span className="text-xs text-muted-foreground">
                                  {r.rating}★
                                </span>
                              </div>
                              <div className="text-sm">{r.text}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </>
            )}

            {!detailsLoading && !activeDetails && (
              <p className="text-sm text-muted-foreground">
                No extra details available.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <br></br>
      <br></br>
      {/* Emergency */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-blue-700">
          <Phone className="h-5 w-5" />
          <span>Emergency Animal Helpline:</span>
        </div>
        <a href="tel:+919876543210" className="font-semibold text-blue-800">
          +91 98765 43210
        </a>
      </div>
    </div>
  );
}
