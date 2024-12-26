// Log a message to the console
console.log('Script is loaded successfully!');

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Change the header text when the page loads
    const header = document.querySelector('h1');
    header.textContent = "It's Dimuth's Blue Nail app, under construction!";

    // Initialize the map
    const map = L.map('map').setView([0, 0], 2); // Default to world view

    // Add a tile layer (the map design)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Try to get the user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                // Set the map view to the user's location
                map.setView([latitude, longitude], 13);

                // Add a marker to the map
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

    // Function to generate random colors
    function randomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
});
