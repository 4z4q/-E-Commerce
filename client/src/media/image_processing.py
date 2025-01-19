import cv2
import numpy as np


def negative_transform(image):
    """Applies negative transformation to an image."""
    cv2.imwrite("image", image)
    return 255 - image


def log_transform(image, c=100):
    """Applies log transformation to an image."""
    image_float = np.float32(image)
    c = c / np.log(1 + np.max(image_float))
    image_log = c * np.log(1 + image_float)
    return np.uint8(image_log)


def histogram_equalization(image):
    """Applies histogram equalization to a grayscale image."""
    return cv2.equalizeHist(image)


def mean_filter(image, kernel_size=(5, 5)):
    """Applies mean filter for smoothing."""
    return cv2.blur(image, kernel_size)


def gaussian_filter(image, kernel_size=(5, 5), sigma=0):
    """Applies Gaussian filter for smoothing."""
    return cv2.GaussianBlur(image, kernel_size, sigma)


def median_filter(image, kernel_size=5):
    """Applies median filter for noise reduction."""
    return cv2.medianBlur(image, kernel_size)


def custom_filter(image, kernel):
    """Applies a custom filter to an image."""
    return cv2.filter2D(src=image, ddepth=-1, kernel=kernel)


def apply_sharpening(image, masks):
    """Applies sharpening to an image using custom masks."""
    sharpened_images = [
        cv2.filter2D(src=image, ddepth=-1, kernel=mask) for mask in masks
    ]
    return sharpened_images


def apply_gaussian_blur(image, kernel_size=(5, 5), sigma=0):
    """Applies Gaussian blur to an image."""
    return cv2.GaussianBlur(image, kernel_size, sigma)


def combine_images(image1, image2):
    """Combines two images by adding them."""
    return cv2.add(image1, image2)


def rotate_image(image, angle):
    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    return cv2.warpAffine(image, M, (w, h))


def flip_image(image, flip_code):
    return cv2.flip(image, flip_code)
