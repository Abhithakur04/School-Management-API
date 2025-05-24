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

// Root route to confirm the backend is running.
//temporary frontend guide
router.get("/", (req, res) => {
  res.send(`
    <h1>📚 School Locator API is Live!</h1>
    <p>Welcome to the backend API.</p>
    <h3>Available Endpoints:</h3>
    <ul>
      <li><strong>POST /addSchool</strong> - Add a new school</li>
      <li><strong>GET /listSchools?lat=YOUR_LAT&lng=YOUR_LNG</strong> - List all schools sorted by distance</li>
    </ul>
    <h3>Usage Guide:</h3>
    <p>1️⃣ Use <strong>/addSchool</strong> with JSON body like:</p>
    <pre>
{
  "name": "ABC High School",
  "address": "123 Main St",
  "latitude": 28.7041,
  "longitude": 77.1025
}
    </pre>
    <p>2️⃣ Then access <strong>/listSchools?lat=28.7041&lng=77.1025</strong> in the browser to see nearby schools.</p>
    <p style="color: gray;">🚀 Happy Testing!</p>
  `);
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
