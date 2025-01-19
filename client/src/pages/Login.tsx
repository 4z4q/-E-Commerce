import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { BASE_URL } from "../constants/baseUrl";
import { useAuth } from "../context/Auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const navigator = useNavigate();

  const auth = useAuth();
  const { login } = auth;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
  
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
  
    try {
      const response = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });
  
      const result = await response.json();
  
      if (!response.ok  || !result) {
        setError(result.message || "Invalid email or password");
        return;
      }
  

  
      setError(""); // Clear any previous errors
      login(email, result);
      navigator("/"); // Redirect to home page
    } catch (error) {
      setError("Something went wrong. Please try again later.");
      console.error("Login error:", error);
    }
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

        <h1
          // style={{ marginBottom: "10px", color: "text.primary" }}
          className="mb-3 text-5xl "
        >
          Login
        </h1>

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
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Don't have an account ?
          <Link to="/register" style={{ color: "inherit" }}>
            Register
          </Link>
        </Typography>
        <Button variant="contained" type="submit">
          Login
        </Button>
      </Box>
    </>
  );
};

export default LoginPage;
