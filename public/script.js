// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the map with extended zoom options
    const map = L.map('map', {
        minZoom: 5,  // Prevent excessive zoom-out
        maxZoom: 22, // Support deeper zoom levels
        zoomSnap: 0.1 // Allow finer zoom increments
    }).setView([0, 0], 2); // Default to world view

    // Add a high-resolution tile layer (MapTiler)
    L.tileLayer('https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png?key=lk7XYxvKwjKOd2lHjoSC', {
        attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> contributors',
        maxZoom: 22 // Allow zooming in to level 22
    }).addTo(map);

    let boundsAdjusted = false; // Track if bounds are already adjusted

    // Function to generate random colors
    function randomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Try to get the user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                // Generate a unique identifier for the user
                const uniqueName = `User-${Date.now()}`;

                // Save user location
                fetch('/api/location', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: uniqueName, latitude, longitude })
                })
                    .then(response => response.json())
                    .then(data => console.log(data));

                // Fetch and display nearby users
                fetch(`/api/nearby?latitude=${latitude}&longitude=${longitude}&radius=500`) // Adjust radius as needed
                    .then(response => response.json())
                    .then(users => {
                        if (users.length > 0) {
                            const bounds = users.map(user => [user.latitude, user.longitude]);

                            // Add markers for each user
                            users.forEach(user => {
                                L.marker([user.latitude, user.longitude]).addTo(map)
                                    .bindPopup(`${user.name} is here!`);
                            });

                            // Only fit bounds the first time
                            if (!boundsAdjusted) {
                                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 22 });
                                boundsAdjusted = true; // Prevent further adjustments
                            }
                        } else {
                            console.log('No nearby users found.');
                        }
                    });

                // Center the map on the user's location
                map.setView([latitude, longitude], 18); // Default closer zoom for user
                L.marker([latitude, longitude]).addTo(map)
                    .bindPopup('You are here!')
                    .openPopup();
            },
            (error) => {
                console.error('Geolocation error:', error.message);
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
    }

    // Change the header text when the page loads
    const header = document.querySelector('h1');
    if (header) {
        header.textContent = "It's Dimuth's Blue Nail app, under construction!";
    }

    // Add a click event to the image
    const image = document.querySelector('img');
    if (image) {
        image.addEventListener('click', () => {
            alert('You clicked the image!');
        });
    }

    // Change the background color when the user clicks the body
    document.body.addEventListener('click', () => {
        document.body.style.backgroundColor = randomColor();
    });
});
