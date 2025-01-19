from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
from image_processing import (
    negative_transform,
    log_transform,
    histogram_equalization,
    mean_filter,
    gaussian_filter,
    median_filter,
    rotate_image,
    flip_image,
)

app = Flask(__name__)
CORS(app)




@app.route("/process-image", methods=["POST"])
def process_image():
    try:
        if "image" not in request.files:
            return jsonify({"error": "Image  are required"}), 400

        if "operation" not in request.form:
            return jsonify({"error": "  operation are required"}), 400

        file = request.files["image"]
        operation = request.form["operation"]

        npimg = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({"error": "Invalid image"}), 400

        # Apply selected operation
        if operation == "negative":
            processed_img = negative_transform(img)
        elif operation == "log":
            processed_img = log_transform(img)

        elif operation == "median":
            processed_img = median_filter(img)

        elif operation == "histogram":
            processed_img = histogram_equalization(
                cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            )
        elif operation == "mean":
            processed_img = mean_filter(img)
        elif operation == "gaussian":
            processed_img = gaussian_filter(img)
            
        elif operation == "rotate":
            angle = int(request.form.get("angle", 0))
            processed_img = rotate_image(img, angle)

        else:
            return jsonify({"error": "Unsupported operation"}), 400

        _, buffer = cv2.imencode(".png", processed_img)
        encoded_image = base64.b64encode(buffer).decode("utf-8")

        return jsonify({"image": encoded_image})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
