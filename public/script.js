// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the map
    const map = L.map('map').setView([0, 0], 2); // Default to world view

    // Add a tile layer (the map design)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

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
                fetch(`/api/nearby?latitude=${latitude}&longitude=${longitude}&radius=5`) // Adjust radius as needed
                    .then(response => response.json())
                    .then(users => {
                        users.forEach(user => {
                            L.marker([user.latitude, user.longitude]).addTo(map)
                                .bindPopup(`${user.name} is here!`);
                        });
                    });

                // Center the map on the user's location
                map.setView([latitude, longitude], 13);
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
