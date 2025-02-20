document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("video");
    const captureBtn = document.getElementById("capture-btn");
    const analyzeBtn = document.getElementById("analyze-btn");
    const canvas = document.getElementById("canvas");
    const capturedImage = document.getElementById("captured-image");
    const resultText = document.getElementById("result-text");

    // Access camera
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((error) => {
            console.error("Error accessing camera:", error);
        });

    // Capture image
    captureBtn.addEventListener("click", () => {
        const context = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to image
        const imageDataUrl = canvas.toDataURL("image/png");
        capturedImage.src = imageDataUrl;
        capturedImage.style.display = "block";
        analyzeBtn.style.display = "block";
    });

    // Send image to backend
    analyzeBtn.addEventListener("click", () => {
        const imageData = capturedImage.src;

        fetch("http://localhost:5000/analyze", {
            method: "POST",
            body: JSON.stringify({ image: imageData }),
            headers: { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(data => {
            resultText.innerHTML = `Detected: ${data.object} <br> Color: ${data.color}`;
        })
        .catch(error => console.error("Error analyzing image:", error));
    });
});
