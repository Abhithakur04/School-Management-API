const express = require("express");
const router = express.Router();
const db = require("../db");

// Helper: calculate distance using Haversine formula
const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371; // Radius of Earth in KM
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
router.get('/', (req, res) => {
  res.send('Backend is live. Use /addSchool (POST) or /listSchools (GET)');
});
// addschool api
router.post("/addSchool", async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // validateion checks
  if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: "All fields are required and must be valid" });
  }

  try {
    await db.execute(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name, address, latitude, longitude]
    );
    res.status(201).json({ message: "School added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to insert school", details: err.message });
  }
});

// GET /listSchools?lat=...&lng=...
router.get("/listSchools", async (req, res) => {
  const userLat = parseFloat(req.query.lat);
  const userLng = parseFloat(req.query.lng);

  if (isNaN(userLat) || isNaN(userLng)) {
    return res.status(400).json({ error: "Invalid coordinates" });
  }

  try {
    const [schools] = await db.query("SELECT * FROM schools");

    const result = schools.map((school) => ({
      ...school,
      distance: getDistance(userLat, userLng, school.latitude, school.longitude),
    }));

    // Sort by distance
    result.sort((a, b) => a.distance - b.distance);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch schools", details: err.message });
  }
});

module.exports = router;
