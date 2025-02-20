from flask import Flask, request, jsonify
import base64
import cv2
import numpy as np
import torch
from ultralytics import YOLO

app = Flask(__name__)

# Load YOLO model
model = YOLO("best.pt")  

# Function to decode base64 image
def decode_image(image_base64):
    image_data = base64.b64decode(image_base64.split(",")[1])
    nparr = np.frombuffer(image_data, np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)

@app.route("/analyze", methods=["POST"])
def analyze_image():
    data = request.get_json()
    image = decode_image(data["image"])

    # Run YOLO model
    results = model(image)
    
    detected_objects = results[0].names  # Extract detected objects
    object_name = detected_objects[0] if detected_objects else "Unknown"

    # Convert color info (dummy for now)
    color = "Red"  

    return jsonify({"object": object_name, "color": color})

if __name__ == "__main__":
    app.run(debug=True)
