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
      const response = await axios.post("http://127.0.0.1:5000/login", {
        email,
        password,
      });

      console.log("Response: ", response);

      if (response.statusText === "OK") {
        const data = response.data;
        if (data.success) {
          // Authentication successful
          console.log("Authentication success");
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
      <Box className="login-container" sx={{ textAlign: "center"}}>
        <Typography variant="h2" sx={{ mb: 5 }} color={"white"} bottom={400} fontSize={72}>
          Find Your Footprint
        </Typography>
        <Box className="login-form" sx={{ backgroundColor: "white", width: '290px'}}>
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
          <Button 
            variant="contained" 
            onClick={handleLogin} 
            sx={{ 
              mb: 2, 
              color: 'white',
              backgroundColor: "#349dd0",
              "&:hover": { backgroundColor: "#2fc484" }
            }}
          >
            Login
          </Button>
          <Typography variant="body1" mt={2}>
            Don't have an account?  <Link to="/register">Register here</Link>
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
