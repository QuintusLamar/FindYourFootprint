import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../Style/App.css";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import axios from "axios";

const Register = ({ setAuthenticated, setCookie }) => {
  const navigate = useNavigate();

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const goBack = () => {
    navigate("/");
  };

  const submitForm = async () => {
    console.log("First: ", first + last);
    console.log("Last: ", last);
    console.log("Vehicle: ", vehicle);
    console.log("Email: ", email);
    console.log("Password: ", password);

    const registerProfileFormData = {
      name: first + last,
      email: email,
      password: password,
      vehicle: vehicle,
    };

    try {
      const response = await axios.post("http://127.0.0.1:5000/register", {
        registerProfileFormData,
        "Access-Control-Allow-Origin": "*",
      });

      if (response.status === 200) {
        const data = response.data;

        if (data.success) {
          console.log("Registration successful");
          // Navigate to the main page upon successful registration
          const token = data.token;
          console.log("This is the token");
          console.log(token);
          setCookie("token", token);
          setAuthenticated(true);
          navigate("/");
        } else {
          console.error("Registration failed:", data.message);
          // Handle registration failure cases
        }
      } else {
        console.error("Failed to register:", response.statusText);
        // Handle error cases
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network errors or other exceptions
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <CssBaseline />
      <Button
        variant="outlined"
        onClick={goBack}
        sx={{
          position: "absolute",
          left: 16,
          top: 16,
        }}
      >
        Back to Login
      </Button>
      <Grid container direction="column" alignItems="center">
        <Typography variant="h1" gutterBottom>
          Register Profile
        </Typography>
        <Box sx={{ width: "40%" }}>
          <Grid container spacing={0}>
            <Grid item xs={6}>
              <TextField
                required
                value={first}
                onChange={(event) => setFirst(event.target.value)}
                label="First Name"
                placeholder="First Name"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                value={last}
                onChange={(event) => setLast(event.target.value)}
                label="Last Name"
                placeholder="Last Name"
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
          <TextField
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            label="Email"
            placeholder="name@gmail.com"
            variant="outlined"
            fullWidth
            mb={2}
          />
          <TextField
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            label="Password"
            type="password" // Set type to "password" for password input
            placeholder="123abc"
            variant="outlined"
            fullWidth
            mb={2}
          />
          <TextField
            required
            value={vehicle}
            onChange={(event) => setVehicle(event.target.value)}
            label="Vehicle"
            placeholder="Honda"
            variant="outlined"
            fullWidth
            mb={2}
          />
          <Button variant="outlined" onClick={submitForm} fullWidth>
            Submit
          </Button>

          {/* <Button variant="outlined" onClick={goBack} fullWidth>
            Back to Login
          </Button> */}
        </Box>
      </Grid>
    </Box>
  );
};

export default Register;
