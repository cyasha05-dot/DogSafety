import axios from "axios";

export const getNearbyDoctors = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: "lat and lng required" });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
    const params = {
      location: `${lat},${lng}`,
      radius: 5000, // 5 km
      type: "veterinary_care",
      key: process.env.GOOGLE_MAPS_API_KEY,
    };
    // console.log(process.env.GOOGLE_MAPS_API_KEY);

    const response = await axios.get(url, { params });

    const vets = response.data.results.slice(0, 6).map((place) => ({
      placeId: place.place_id,
      name: place.name,
      address: place.vicinity,
      rating: place.rating,
      userRatings: place.user_ratings_total,
      openNow: place.opening_hours?.open_now,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      photo:
        place.photos?.length > 0
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
          : null,
    }));

    res.status(200).json(vets, { message: "the vets returned" });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Failed to fetch nearby clinics" });
  }
};

export const getDoctorDetails = async (req, res) => {
  const { placeId } = req.params;

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json`;
    const params = {
      place_id: placeId,
      key: process.env.GOOGLE_MAPS_API_KEY,
      fields:
        "name,rating,formatted_phone_number,formatted_address,opening_hours,website,photo,reviews,geometry,url",
    };

    const response = await axios.get(url, { params });
    const details = response.data.result;

    res.json(details);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Failed to fetch place details" });
  }
};
