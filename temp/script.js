// Log a message to the console
console.log('Script is loaded successfully!');

// Change the header text when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('h1');
    header.textContent = 'Welcome to My Interactive Page!';
});

// Add a click event to the image
const image = document.querySelector('img');
image.addEventListener('click', () => {
    alert('You clicked the image!');
});

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
