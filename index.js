const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.static('public'));


// Root route (serves an HTML file)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// About route
app.get('/about', (req, res) => {
    res.send('This is the About Page.');
});

app.get('/contact', (req, res) => {
    res.send('Contact us at contact@example.com');
});




// Port and server listener
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
