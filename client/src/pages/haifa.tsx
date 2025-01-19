import { useState } from "react";
import { Alert, Box, Button, TextField } from "@mui/material";
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
  { value: "aes", label: "AES" },
  { value: "rc4", label: "RC4" },
  { value: "dh", label: "DIFFIE-HELLMAN" },
  
];

const EncryptApp = () => {
  const [algorithm, setAlgorithm] = useState<AlgorithmOption | null>(null);
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [e, setE] = useState("");
  const [n, setN] = useState("");

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
          key: algorithm?.value === "hill" ? parsedKey : key,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to encrypt!");
      }

      const data = await response.json();
      setResult(data.encrypted_text);
      setE(data.e);
      setN(data.n);
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
          key: algorithm?.value === "hill" ? parsedKey : key,
          e,
          n,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to decrypt!");
      }

      const data = await response.json();
      setResult(data.decrypted_text);
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
          options={options}
          defaultValue={options[0]}
          onChange={(selectedOption) => setAlgorithm(selectedOption)}
          styles={{
            control: (provided) => ({
              ...provided,
              width: "200px",
            }),
          }}
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
          label="Text"
          variant="outlined"
          placeholder="Enter text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <TextField
          label="Key (p,q)"
          placeholder="Enter p,q (e.g., 61,53)"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        {algorithm?.value === "rsa" && (
          <>
            <TextField label="E" placeholder="E" value={e} disabled />
            <TextField label="N" placeholder="N" value={n} disabled />
          </>
        )}
        <Box
          sx={{ display: "flex", justifyContent: "space-between", gap: "20px" }}
        >
          <Button
            variant="contained"
            onClick={handleEncrypt}
            sx={{ width: "100%" }}
          >
            Encrypt
          </Button>
          <Button
            variant="contained"
            onClick={handleDecrypt}
            sx={{ width: "100%" }}
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
