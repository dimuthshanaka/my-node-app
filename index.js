const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); // To parse JSON
const app = express();

// Middleware to serve static files and parse JSON
app.use(express.static('public'));
app.use(bodyParser.json()); 

// In-memory storage for demo (replace with a database in production)
let users = [];

// Endpoint to save user location
app.post('/api/location', (req, res) => {
    const { name, latitude, longitude } = req.body;

    // Save user data
    users.push({ name, latitude, longitude, timestamp: Date.now() });
    console.log('Users:', users);

    res.json({ message: 'Location saved successfully!' });
});

// Endpoint to fetch nearby users
app.get('/api/nearby', (req, res) => {
    const { latitude, longitude, radius } = req.query;
    const nearbyUsers = users.filter(user => {
        const distance = getDistance(
            { lat: latitude, lon: longitude },
            { lat: user.latitude, lon: user.longitude }
        );
        return distance <= radius;
    });

    res.json(nearbyUsers);
});

// Function to calculate distance between two coordinates (Haversine formula)
function getDistance(coord1, coord2) {
    const R = 6371; // Earth's radius in km
    const dLat = deg2rad(coord2.lat - coord1.lat);
    const dLon = deg2rad(coord2.lon - coord1.lon);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(coord1.lat)) * Math.cos(deg2rad(coord2.lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Port and server listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
