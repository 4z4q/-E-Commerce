import cv2
import numpy as np


def draw_shape(image, shape , text):
    """Draws a shape on the image."""
    height, width = image.shape[:2]
    center_x = width // 2
    center_y = height // 2
    if shape == "circle":
        cv2.circle(image, (center_x, center_y), 400, (0, 255, 0), 8)
    elif shape == "square":
        cv2.rectangle(image, (center_x-50, center_y-50), (center_x+50, center_y+50), (0, 255, 0), 20)
    elif shape == "line":
        cv2.line(image, (0, 0), (width, height), (0, 255, 0), 20)
    elif shape == "text":
        cv2.putText(
            image, text, (center_x, center_y), cv2.FONT_HERSHEY_SIMPLEX, 5, (0, 255, 0), 20
        )
    return image


def transform_image(image, operation, angle=None, scale_factor=None):
    """Applies transformations to the image."""
    if operation == "rotate":
        (h, w) = image.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        return cv2.warpAffine(image, M, (w, h))
    elif operation == "scale":
        return cv2.resize(image, None, fx=scale_factor, fy=scale_factor)
    elif operation == "translate":
        # Example translation matrix
        M = np.float32([[1, 0, 100], [0, 1, 50]])
        return cv2.warpAffine(image, M, (image.shape[1], image.shape[0]))
    return image


def convert_color_space(image, color_space):
    """Converts the image to the specified color space."""
    if color_space == "hsv":
        return cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    elif color_space == "rgb":
        return cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    elif color_space == "bgr":
        return image  # Already in BGR
    elif color_space == "gray":
        return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    return image


def enhance_image(image, operation, max_value=None, c=None):
    """Applies enhancement operations to the image."""
    if operation == "histogram":
        if len(image.shape) == 2:  # Grayscale image
            return cv2.equalizeHist(image)
        else:  # Color image
            channels = cv2.split(image)
            for i in range(len(channels)):
                channels[i] = cv2.equalizeHist(channels[i])
            return cv2.merge(channels)
    elif operation == "negative":
        return 255 - image if max_value is None else max_value - image
    elif operation == "log":
        c = 255 / np.log(1 + 255) if c is None else c
        log_transformed = c * (np.log(image + 1))
        return np.uint8(log_transformed)
    return image


def smooth_image(image, filter_type, kernel_size=3, sigma=0):
    """Applies smoothing filters to the image."""
    if filter_type == "median":
        return cv2.medianBlur(image, kernel_size)
    elif filter_type == "average":
        return cv2.blur(image, (kernel_size, kernel_size))
    elif filter_type == "gaussian":
        return cv2.GaussianBlur(image, (kernel_size, kernel_size), sigma)
    return image


def detect_edges(image, edge_detector):
    """Applies edge detection to the image."""
    if edge_detector == "laplacian":
        return cv2.Laplacian(image, cv2.CV_64F)
    elif edge_detector == "difference":
        # Example: Difference of Gaussians (DoG)
        g1 = cv2.GaussianBlur(image, (5, 5), 0)
        g2 = cv2.GaussianBlur(image, (9, 9), 0)
        return g1 - g2
    elif edge_detector == "canny":
        return cv2.Canny(image, 100, 200)
    elif edge_detector == "sobel":
        sobel_x = cv2.Sobel(image, cv2.CV_64F, 1, 0, ksize=5)
        sobel_y = cv2.Sobel(image, cv2.CV_64F, 0, 1, ksize=5)
        return cv2.magnitude(sobel_x, sobel_y)
    return image
