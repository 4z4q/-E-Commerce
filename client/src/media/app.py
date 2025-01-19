from flask import Flask, request, jsonify
from flask_cors import CORS  # استيراد CORS
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
CORS(app)  # تمكين CORS لجميع الطلبات


@app.route("/process-image", methods=["POST"])
def process_image():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image provided"}), 400

        file = request.files["image"]
        if file.filename == "":
            return jsonify({"error": "No image selected"}), 400

        # قراءة الصورة
        image = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

        type = request.form.get("type")
        angle = request.form.get("angle", type=float)

        if type == "mean":
            image = mean_filter(image)
        elif type == "gaussian":
            image = gaussian_filter(image)
        elif type == "median":
            image = median_filter(image)
        elif type == "negative":
            image = negative_transform(image)
            cv2.imwrite("neg.png", image)
            print("saved")
        elif type == "log":
            image = log_transform(image)
        elif type == "histogram":
            image = histogram_equalization(image)
        elif type == "rotate":
            if angle is not None:
                image = rotate_image(image, angle)
        elif type == "flip_horizontal":
            image = flip_image(image, 1)
        elif type == "flip_vertical":
            image = flip_image(image, 0)

        # تحويل الصورة إلى base64
        _, img_encoded = cv2.imencode(".jpg", image)
        img_base64 = base64.b64encode(img_encoded).decode("utf-8")

        return jsonify({"image": f"data:image/jpeg;base64,{img_base64}"})

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
