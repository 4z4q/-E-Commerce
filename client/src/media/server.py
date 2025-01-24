from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
from image_processing import (
    draw_shape,
    transform_image,
    convert_color_space,
    enhance_image,
    smooth_image,
    detect_edges,
)

app = Flask(__name__)
CORS(app)


@app.route("/process-image", methods=["POST"])
def process_image():
    try:
        if "image" not in request.files:
            return jsonify({"error": "Image is required"}), 400

        file = request.files["image"]
        npimg = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({"error": "Invalid image"}), 400

        operation = request.form.get("operation")

        if not operation:
            return jsonify({"error": "Operation is required"}), 400

        if operation == "draw":
            shape = request.form.get("shape")
            if not shape:
                return jsonify({"error": "Shape is required for drawing"}), 400
            processed_img = draw_shape(img, shape , text=request.form.get("text"))
        elif operation == "transform":
            sub_option = request.form.get("subOption")
            if not sub_option:
                return (
                    jsonify({"error": "Sub-option is required for transformation"}),
                    400,
                )
            angle = int(request.form.get("angle")) if "angle" in request.form else None
            scale_factor = (
                float(request.form.get("scale_factor"))
                if "scale_factor" in request.form
                else None
            )
            processed_img = transform_image(img, sub_option, angle, scale_factor)
        elif operation == "color":
            color_space = request.form.get("color_space")
            if not color_space:
                return jsonify({"error": "Color space is required"}), 400
            processed_img = convert_color_space(img, color_space)
        elif operation == "enhance":
            sub_option = request.form.get("subOption")
            if not sub_option:
                return jsonify({"error": "Sub-option is required for enhancement"}), 400
            max_value = (
                int(request.form.get("max_value"))
                if "max_value" in request.form
                else None
            )
            c = float(request.form.get("c")) if "c" in request.form else None
            processed_img = enhance_image(img, sub_option, max_value, c)
        elif operation == "smooth":
            filter_type = request.form.get("filter_type")
            if not filter_type:
                return jsonify({"error": "Filter type is required for smoothing"}), 400
            kernel_size = (
                int(request.form.get("kernel_size"))
                if "kernel_size" in request.form
                else 3
            )
            sigma = float(request.form.get("sigma")) if "sigma" in request.form else 0
            processed_img = smooth_image(img, filter_type, kernel_size, sigma)
        elif operation == "edge":
            edge_detector = request.form.get("edge_detector")
            if not edge_detector:
                return jsonify({"error": "Edge detector is required"}), 400
            processed_img = detect_edges(img, edge_detector)
        else:
            return jsonify({"error": "Unsupported operation"}), 400

        _, buffer = cv2.imencode(".png", processed_img)
        encoded_image = base64.b64encode(buffer).decode("utf-8")

        return jsonify({"image": encoded_image})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
