import { Alert, Box, Button, TextField } from "@mui/material";
import { useRef, useState } from "react";
import { BASE_URL } from "../constants/baseUrl";
import { useAuth } from "../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const navigator = useNavigate();

  const auth = useAuth();
  const { login } = auth;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const firstName = firstNameRef.current?.value;
    const lastName = lastNameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    console.log(firstName, lastName, email, password);

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return;
    }

    // Get Data From Backend
    const response = await fetch(`${BASE_URL}/user/register`, {
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }),

      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      setError("User already exists");
    } else {
      setError("");
    }

    const token = await response.json();

    if (!token) {
      setError("User already exists");
    }

    login(email, token);

    navigator("/"); // Redirect To Home Page After Login

    console.log(token);
  };

  return (
    <>
      <Box
        onSubmit={onSubmit}
        component={"form"}
        sx={{
          width: { xs: "auto", md: "auto" },
          height: "calc(100vh - 100px)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
          justifyContent: "center",
          margin: { xs: "0 auto", md: " auto " },
          padding: "20px",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
      >
        {error && <Alert severity="error">{error}</Alert>}

        <h1>Sign Up</h1>
        <TextField
          sx={{ width: "300px" }}
          label="First Name"
          variant="outlined"
          size="small"
          inputRef={firstNameRef}
        />

        <TextField
          sx={{ width: "300px" }}
          label="Last Name"
          variant="outlined"
          size="small"
          inputRef={lastNameRef}
        />

        <TextField
          sx={{ width: "300px" }}
          type="email"
          label="Email"
          variant="outlined"
          size="small"
          inputRef={emailRef}
        />
        <TextField
          sx={{ width: "300px" }}
          label="Password"
          variant="outlined"
          size="small"
          inputRef={passwordRef}
          type="password"
        />
        <Button variant="contained" type="submit">
          Register
        </Button>
      </Box>
    </>
  );
};

export default RegisterPage;
