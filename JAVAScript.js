const video = document.getElementById('video');
const captureBtn = document.getElementById('capture-btn');
const canvas = document.getElementById('canvas');
const capturedImage = document.getElementById('captured-image');
const analyzeBtn = document.getElementById('analyze-btn');
const resultsDiv = document.getElementById('results');

// Function to start the camera
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = stream;
    } catch (err) {
        alert("Error accessing camera. Please allow camera permissions.");
        console.error("Camera access error:", err);
    }
}

// Start the camera automatically when the page loads
document.addEventListener("DOMContentLoaded", startCamera);

// Capture image from video stream
captureBtn.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to image
    const imageData = canvas.toDataURL('image/png');
    capturedImage.src = imageData;
    capturedImage.style.display = "block";
    analyzeBtn.style.display = "block";
});

// Send the captured image to backend
analyzeBtn.addEventListener('click', () => {
    const imageData = capturedImage.src;
    fetch('https://your-api-name.onrender.com/analyze', { // Replace with your actual API URL
        method: 'POST',
        body: JSON.stringify({ image: imageData }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        resultsDiv.innerHTML = `<h2>Analysis Result:</h2><p>${data.result}</p>`;
    })
    .catch(err => console.error("Error:", err));
});
