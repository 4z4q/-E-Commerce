import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  Box,
  Typography,
  IconButton,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";

const ImageProcessor = () => {
  const [image, setImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [operation, setOperation] = useState<string>("draw");
  const [subOption, setSubOption] = useState("");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [scaleFactor, setScaleFactor] = useState<number>(1);
  const [kernelSize, setKernelSize] = useState<number>(3);
  const [maxValue, setMaxValue] = useState<number>(255);
  const [c, setC] = useState<number>(255 / Math.log(1 + 255));
  const [sigma, setSigma] = useState<number>(0);
  const [text, setText] = useState("");

  const handleSubmit = async () => {
    if (!image) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("operation", operation);
    formData.append("subOption", subOption);

    if (operation === "draw") {
      formData.append("shape", subOption);
      formData.append("text", text);
    } else if (operation === "transform") {
      if (subOption === "rotate") {
        formData.append("angle", rotationAngle.toString());
      } else if (subOption === "scale") {
        formData.append("scale_factor", scaleFactor.toString());
      }
    } else if (operation === "color") {
      formData.append("color_space", subOption);
    } else if (operation === "enhance") {
      if (subOption === "negative") {
        formData.append("max_value", maxValue.toString());
      } else if (subOption === "log") {
        formData.append("c", c.toString());
      }
    } else if (operation === "smooth") {
      formData.append("filter", subOption);
      formData.append("kernel_size", kernelSize.toString());
      if (subOption === "gaussian") {
        formData.append("sigma", sigma.toString());
      }
    } else if (operation === "edge") {
      formData.append("edge_detector", subOption);
    }

    try {
      const response = await fetch("http://localhost:5000/process-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setProcessedImage(`data:image/png;base64,${result.image}`);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setProcessedImage(null); // Reset processed image when new image is uploaded
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
    setProcessedImage(null);
    setOperation("draw"); // Reset operation when image is deleted
  };

  return (
    <Box
      component={"form"}
      sx={{
        padding: 4,
        textAlign: "center",
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Image Processing Tool
      </Typography>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
        id="upload"
      />
      <label htmlFor="upload">
        <Button
          variant="contained"
          color="primary"
          startIcon={<UploadIcon />}
          disabled={isLoading}
          onClick={() => document.getElementById("upload")?.click()}
        >
          {isLoading ? <CircularProgress size={20} /> : "Upload Image"}
        </Button>
      </label>

      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={2}
        sx={{ position: "relative", width: "500px" }}
      >
        {image && (
          <Box mt={2}>
            <img
              src={URL.createObjectURL(image)}
              alt="Uploaded"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 8,
                position: "relative",
              }}
            />
            <IconButton
              onClick={handleDeleteImage}
              sx={{ position: "absolute", top: 0, right: 0 }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}

        {processedImage && (
          <Box mt={2}>
            <img
              src={processedImage}
              alt="Processed"
              style={{ width: "100%", borderRadius: 8 }}
            />
          </Box>
        )}
      </Box>

      <Box mt={2}>
        <Typography variant="h6">Choose an Operation:</Typography>
        <RadioGroup
          value={operation}
          onChange={(e) => {
            setOperation(e.target.value);
            setSubOption(""); // Reset subOption when operation changes
          }}
        >
          {/* قسم الرسم */}
          <FormControlLabel value="draw" control={<Radio />} label="Drawing" />
          {operation === "draw" && (
            <RadioGroup
              value={subOption}
              onChange={(e) => setSubOption(e.target.value)}
              sx={{ pl: 2, display: "flex", flexDirection: "row", gap: 2 }}
            >
              <FormControlLabel
                value="circle"
                control={<Radio />}
                label="Circle"
              />
              <FormControlLabel
                value="square"
                control={<Radio />}
                label="Square"
              />
              <FormControlLabel value="line" control={<Radio />} label="Line" />
              <FormControlLabel value="text" control={<Radio />} label="Text" />
              {subOption === "text" && (
                <TextField
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  variant="outlined"
                  placeholder="Enter text"
                  fullWidth
                  sx={{margin:"0 auto 20px" }}
                />
              )}
            </RadioGroup>
          )}

          {/* قسم التحويلات */}
          <FormControlLabel
            value="transform"
            control={<Radio />}
            label="Transformations"
          />
          {operation === "transform" && (
            <RadioGroup
              value={subOption}
              onChange={(e) => setSubOption(e.target.value)}
              sx={{ pl: 2, display: "flex", flexDirection: "row", gap: 2 }}
            >
              <FormControlLabel
                value="rotate"
                control={<Radio />}
                label="Rotate"
              />
              <FormControlLabel
                value="scale"
                control={<Radio />}
                label="Scale"
              />
              <FormControlLabel
                value="translate"
                control={<Radio />}
                label="Translate"
              />
            </RadioGroup>
          )}

          {/* قسم الأنظمة اللونية */}
          <FormControlLabel
            value="color"
            control={<Radio />}
            label="Color Spaces"
          />
          {operation === "color" && (
            <RadioGroup
              value={subOption}
              onChange={(e) => setSubOption(e.target.value)}
              sx={{ pl: 2, display: "flex", flexDirection: "row", gap: 2 }}
            >
              <FormControlLabel value="hsv" control={<Radio />} label="HSV" />
              <FormControlLabel value="rgb" control={<Radio />} label="RGB" />
              <FormControlLabel value="bgr" control={<Radio />} label="BGR" />
              <FormControlLabel value="gray" control={<Radio />} label="GRAY" />
            </RadioGroup>
          )}

          {/* قسم تحسين الصورة */}
          <FormControlLabel
            value="enhance"
            control={<Radio />}
            label="Enhancement"
          />
          {operation === "enhance" && (
            <RadioGroup
              value={subOption}
              onChange={(e) => setSubOption(e.target.value)}
              sx={{ pl: 2, display: "flex", flexDirection: "row", gap: 2 }}
            >
              <FormControlLabel
                value="histogram"
                control={<Radio />}
                label="Histogram"
              />
              <FormControlLabel
                value="negative"
                control={<Radio />}
                label="Negative"
              />
              <FormControlLabel value="log" control={<Radio />} label="Log" />
            </RadioGroup>
          )}

          {/* قسم تنعيم الصورة */}
          <FormControlLabel
            value="smooth"
            control={<Radio />}
            label="Smoothing"
          />
          {operation === "smooth" && (
            <RadioGroup
              value={subOption}
              onChange={(e) => setSubOption(e.target.value)}
              sx={{ pl: 2, display: "flex", flexDirection: "row", gap: 2 }}
            >
              <FormControlLabel
                value="median"
                control={<Radio />}
                label="Median"
              />
              <FormControlLabel
                value="average"
                control={<Radio />}
                label="Average"
              />
              <FormControlLabel
                value="gaussian"
                control={<Radio />}
                label="Gaussian"
              />
            </RadioGroup>
          )}

          {/* قسم تحديد الحواف */}
          <FormControlLabel
            value="edge"
            control={<Radio />}
            label="Edge Detection"
          />
          {operation === "edge" && (
            <RadioGroup
              value={subOption}
              onChange={(e) => setSubOption(e.target.value)}
              sx={{ pl: 2, display: "flex", flexDirection: "row", gap: 2 }}
            >
              <FormControlLabel
                value="laplacian"
                control={<Radio />}
                label="Laplacian"
              />
              <FormControlLabel
                value="difference"
                control={<Radio />}
                label="Difference"
              />
              <FormControlLabel
                value="canny"
                control={<Radio />}
                label="Canny"
              />
              <FormControlLabel
                value="sobel"
                control={<Radio />}
                label="Sobel"
              />
            </RadioGroup>
          )}
        </RadioGroup>

        {/* حقول الإدخال بناءً على العملية المحددة */}
        {operation === "transform" && subOption === "rotate" && (
          <TextField
            label="Rotation Angle (degrees)"
            type="number"
            value={rotationAngle}
            onChange={(e) => setRotationAngle(Number(e.target.value))}
            fullWidth
            sx={{ mt: 2 }}
          />
        )}

        {operation === "transform" && subOption === "scale" && (
          <TextField
            label="Scale Factor"
            type="number"
            value={scaleFactor}
            onChange={(e) => setScaleFactor(Number(e.target.value))}
            fullWidth
            sx={{ mt: 2 }}
          />
        )}

        {operation === "enhance" && subOption === "negative" && (
          <TextField
            label="Max Value"
            type="number"
            value={maxValue}
            onChange={(e) => setMaxValue(Number(e.target.value))}
            fullWidth
            sx={{ mt: 2 }}
          />
        )}

        {operation === "enhance" && subOption === "log" && (
          <TextField
            label="Constant (c)"
            type="number"
            value={c}
            onChange={(e) => setC(Number(e.target.value))}
            fullWidth
            sx={{ mt: 2 }}
          />
        )}

        {operation === "smooth" && (
          <>
            <TextField
              label="Kernel Size"
              type="number"
              value={kernelSize}
              onChange={(e) => setKernelSize(Number(e.target.value))}
              fullWidth
              sx={{ mt: 2 }}
            />
            {subOption === "gaussian" && (
              <TextField
                label="Sigma"
                type="number"
                value={sigma}
                onChange={(e) => setSigma(Number(e.target.value))}
                fullWidth
                sx={{ mt: 2 }}
              />
            )}
          </>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isLoading || !image}
          sx={{ mt: 2 }}
        >
          {isLoading ? <CircularProgress size={20} /> : "Process Image"}
        </Button>
      </Box>
    </Box>
  );
};

export default ImageProcessor;
