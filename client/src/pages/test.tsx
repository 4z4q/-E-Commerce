import { Alert, Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import Select from "react-select";

type AlgorithmOption = {
  value: string;
  label: string;
};

const options: AlgorithmOption[] = [
  { value: "playfair", label: "Playfair" },
  { value: "caesar", label: "Caesar" },
  { value: "hill", label: "Hill" },
  { value: "des", label: "DES" },
  { value: "rsa", label: "RSA" },
  { value: "dh", label: "DIFFIE-HELLMAN" },
];

const EncryptApp: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<AlgorithmOption | null>(null);
  const [text, setText] = useState<string>("");
  const [key, setKey] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [e, setE] = useState<string>("");
  const [n, setN] = useState<string>("");


  const handleEncrypt = async () => {
    if (!algorithm || !text || !key) {
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
      return;
    }

    try {
      let parsedKey = key;
      if (algorithm?.value === "hill") {
        try {
          parsedKey = JSON.parse(key);
          if (
            !Array.isArray(parsedKey) ||
            parsedKey.length === 0 ||
            !Array.isArray(parsedKey[0])
          ) {
            throw new Error("Invalid key for Hill cipher!");
          }
        } catch {
          throw new Error("Invalid key format for Hill cipher!");
        }
      }

      const response = await fetch("http://127.0.0.1:5000/encrypt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          algorithm: algorithm?.value,
          key: algorithm.value === "hill" ? parsedKey : key,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to encrypt!");
      }

      const data = await response.json();
      setResult(data.encrypted_text);

      // تحديث حالة n و e إذا كانت الخوارزمية هي RSA
      if (algorithm?.value === "rsa") {
        setE(data.e);
        setN(data.n);
      }
    } catch (error) {
      console.error("Error:", error);
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
    }
  };

  const handleDecrypt = async () => {
    if (!algorithm || !text || !key) {
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
      return;
    }

    try {
      let parsedKey = key;
      if (algorithm?.value === "hill") {
        try {
          parsedKey = JSON.parse(key);
          if (
            !Array.isArray(parsedKey) ||
            parsedKey.length === 0 ||
            !Array.isArray(parsedKey[0])
          ) {
            throw new Error("Invalid key for Hill cipher!");
          }
        } catch {
          throw new Error("Invalid key format for Hill cipher!");
        }
      }

      const response = await fetch("http://127.0.0.1:5000/decrypt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: result,
          algorithm: algorithm?.value,
          key: parsedKey,
          e,
          n,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to decrypt!");
      }

      const data = await response.json();
      setResult(data.decrypted_text); // تحديث النتيجة
    } catch (error) {
      console.error("Error:", error);
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
    }
  };

  return (
    <div className="container">
      {alertVisible && (
        <Alert severity="error">Please fill in all fields!</Alert>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 className="text-2xl font-bold">Encrypt Text</h1>

        <Select
          styles={{
            control: (base) => ({
              ...base,
              width: "200px",
              boxShadow: "none",
            }),
          }}
          defaultValue={options[0]}
          onChange={(selectedOption) => setAlgorithm(selectedOption)}
          options={options}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          mt: "20px",
        }}
      >
        <TextField
          type="text"
          label="Text"
          variant="outlined"
          placeholder="Enter text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <TextField
          type="text"
          label="Key"
          placeholder="Enter key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        {algorithm?.value === "rsa" && (
          <>
            <TextField
              type="text"
              label="E"
              placeholder="Enter E"
              value={e}
              onChange={(e) => setE(e.target.value)}
              disabled
            />
            <TextField
              type="text"
              label="N"
              placeholder="Enter N"
              value={n}
              onChange={(e) => setN(e.target.value)}
              disabled
            />
          </>
        )}
        <Box
          sx={{ display: "flex", justifyContent: "space-between", gap: "20px" }}
        >
          <Button
            variant="contained"
            onClick={handleEncrypt}
            sx={{ width: "100%" }}
            color="inherit"
          >
            Encrypt
          </Button>
          <Button
            variant="contained"
            onClick={handleDecrypt}
            sx={{ width: "100%" }}
            color="inherit"
          >
            Decrypt
          </Button>
        </Box>
        {result && (
          <p
            style={{
              background: "#1976d2",
              textAlign: "center",
              padding: "10px",
              color: "white",
              borderRadius: "6px",
              fontFamily: "inherit",
            }}
          >
            Result: {result}
          </p>
        )}
      </Box>
    </div>
  );
};

export default EncryptApp;
