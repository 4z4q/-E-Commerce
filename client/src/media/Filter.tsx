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
  const [operation, setOperation] = useState<string>("negative");
  const [subOption, setSubOption] = useState("");
  const [rotationAngle, setRotationAngle] = useState<number>(0);

  const handleSubmit = async () => {
    if (!image) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("operation", subOption);

    if (operation === "filter") {
      formData.append("filter", subOption);
    }

    if (operation === "rotate") {
      formData.append("angle", rotationAngle.toString());
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
    setOperation("negative"); // Reset operation when image is deleted
  };

  return (
    <Box
      sx={{ padding: 4, textAlign: "center", maxWidth: 600, margin: "0 auto" }}
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
        sx={{ position: "relative" }}
      >
        {image && (
          <Box mt={2}>
            <img
              src={URL.createObjectURL(image)}
              alt="Uploaded"
              style={{
                maxWidth: "100%",
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
              style={{ maxWidth: "100%", borderRadius: 8 }}
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
          <FormControlLabel value="filter" control={<Radio />} label="Filter" />
          {operation === "filter" && (
            <RadioGroup
              value={subOption}
              onChange={(e) => {
                setSubOption(e.target.value);
              }}
              style={{ paddingLeft: "20px", marginTop: "10px" }}
            >
              <FormControlLabel value="log" control={<Radio />} label="Log" />
              <FormControlLabel value="median" control={<Radio />} label="Median" />
              <FormControlLabel value="gaussian" control={<Radio />} label="Gaussian" />
            </RadioGroup>
          )}

          <FormControlLabel value="enhancement" control={<Radio />} label="Enhancement" />
          {operation === "enhancement" && (
            <RadioGroup
              value={subOption}
              onChange={(e) => {
                setSubOption(e.target.value);
                console.log(e.target.value);
              }}
              style={{ paddingLeft: "20px", marginTop: "10px" }}
            >
              <FormControlLabel value="log" control={<Radio />} label="Log" />
              <FormControlLabel value="negative" control={<Radio />} label="Negative" />
              <FormControlLabel value="histogram" control={<Radio />} label="Histogram Equalization" />
            </RadioGroup>
          )}

          <FormControlLabel value="rotate" control={<Radio />} label="Rotate" />
        </RadioGroup>

        {operation === "rotate" && (
          <TextField
            label="Rotation Angle (degrees)"
            type="number"
            value={rotationAngle}
            onChange={(e) => setRotationAngle(Number(e.target.value))}
            fullWidth
          />
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isLoading || !image}
        >
          {isLoading ? <CircularProgress size={20} /> : "Process Image"}
        </Button>
      </Box>
    </Box>
  );
};

export default ImageProcessor;
