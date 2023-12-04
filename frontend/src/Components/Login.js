import React, { useState } from "react";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "../Style/Login.css";
import axios from "axios";

const Login = ({ setAuthenticated, setCookie }) => {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const theme = createTheme(); // Create a theme instance

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      console.log("Response: ", response);

      if (response.statusText === "OK") {
        const data = response.data;
        if (data.success) {
          // Authentication successful
          const token = data.token;
          setCookie("token", token);
          console.log(token);
          setAuthenticated(true);
        } else {
          // Authentication failed
          alert(data.message);
        }
      } else {
        console.error("Login failed:", response.statusText);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="login-container" sx={{ textAlign: "center" }}>
        <Typography variant="h2" sx={{ mb: 5 }}>
          Find Your Footprint
        </Typography>
        <Box className="login-form">
          <Typography variant="h4" sx={{ mb: 3 }}>
            {/* Login */}
          </Typography>
          <TextField
            label="Email"
            type="text"
            value={email}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 0, width: "100%" }}
          />
          <br />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 0, width: "100%" }}
          />
          <br />
          <Button variant="contained" onClick={handleLogin} sx={{ mb: 4 }}>
            Login
          </Button>
          {/* Link to the register page */}
          <Typography variant="body1">
            Don't have an account? <Link to="/register">Register here</Link>
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
