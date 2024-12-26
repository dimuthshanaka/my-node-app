const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Middleware to serve static files, parse JSON, and enable CORS
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());

// In-memory storage for demo purposes (replace with database in production)
let users = [];

// Endpoint to save user location
app.post('/api/location', (req, res) => {
    const { name, latitude, longitude } = req.body;

    if (!name || isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: 'Invalid or missing required fields: name, latitude, or longitude' });
    }

    const existingUser = users.find(user => user.name === name);

    if (existingUser) {
        // Add new location to the user's streak
        existingUser.locations.push({ latitude, longitude, timestamp: Date.now() });
    } else {
        // Create a new user with an array of locations
        users.push({
            name,
            locations: [{ latitude, longitude, timestamp: Date.now() }]
        });
    }

    console.log('Updated Users:', users);
    res.json({ message: 'Location saved successfully!' });
});

// Endpoint to fetch nearby users
app.get('/api/nearby', (req, res) => {
    const latitude = parseFloat(req.query.latitude);
    const longitude = parseFloat(req.query.longitude);
    const radius = parseFloat(req.query.radius);

    if (isNaN(latitude) || isNaN(longitude) || isNaN(radius)) {
        return res.status(400).json({ error: 'Invalid latitude, longitude, or radius' });
    }

    const now = Date.now();
    const maxAge = 2 * 60 * 1000; // 2 minutes

    const nearbyUsers = users.filter(user => {
        // Check if any location in the streak is within the radius and recent
        return user.locations.some(location => {
            const distance = getDistance(
                { lat: latitude, lon: longitude },
                { lat: location.latitude, lon: location.longitude }
            );

            const isWithinRadius = distance <= radius;
            const isRecent = now - location.timestamp <= maxAge;

            return isWithinRadius && isRecent;
        });
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

// Periodic cleanup of stale users
const CLEANUP_INTERVAL = 2 * 60 * 1000; // 2 minutes
setInterval(() => {
    const now = Date.now();
    users = users.filter(user => {
        user.locations = user.locations.filter(location => now - location.timestamp <= CLEANUP_INTERVAL);
        return user.locations.length > 0; // Keep users with recent locations
    });
    console.log('Cleaned up stale users:', users);
}, CLEANUP_INTERVAL);

// Root route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Port and server listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
