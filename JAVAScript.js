const video = document.getElementById('video');
const captureBtn = document.getElementById('capture-btn');
const canvas = document.getElementById('canvas');
const capturedImage = document.getElementById('captured-image');
const analyzeBtn = document.getElementById('analyze-btn');
const resultsDiv = document.getElementById('results');

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => console.error("Error accessing camera:", err));

captureBtn.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');
    capturedImage.src = imageData;
    analyzeBtn.style.display = "block";
});

analyzeBtn.addEventListener('click', () => {
    const imageData = capturedImage.src;
    fetch('/analyze', {
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
