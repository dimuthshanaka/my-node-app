const express = require('express');
const path = require('path');
const app = express();

// Middleware to serve static files from the "public" folder
app.use(express.static('public'));

// Root route (serves the index.html file)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// About route
app.get('/about', (req, res) => {
    res.send('This is the About Page.');
});

// Contact route
app.get('/contact', (req, res) => {
    res.send('Contact us at contact@example.com');
});

// Port and server listener
const PORT = process.env.PORT || 3000; // Use PORT from environment for deployment
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
