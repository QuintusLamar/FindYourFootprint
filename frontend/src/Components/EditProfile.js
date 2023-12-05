import { useState } from "react";
import "../Style/App.css";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Sidebar from "../Components/Sidebar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

function EditProfile({removeCookie, setAuthenticated}) {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  window.scrollTo(0, 0);

  const submitForm = async () => {
    try {
      const updateProfileFormData = {
        name: first,
        email: email,
        password: password,
        vehicle: vehicle,
      };

      const response = await fetch("http://127.0.0.1:5000/update_profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updateProfileFormData }),
      });

      if (response.ok) {
        console.log("Profile updated successfully");
        // Add any further actions after a successful update
      } else {
        console.error("Failed to update profile");
        // Handle error cases
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network errors or other exceptions
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar setAuthenticated={setAuthenticated} removeCookie={removeCookie}/>

      <Box sx={{ ml: "10px", flexGrow: 1, p: 3 }}>
        <Typography variant="h3" gutterBottom color={'white'}>
          Edit Profile
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                required={true}
                value={first}
                onChange={(event) => setFirst(event.target.value)}
                label="First Name"
                placeholder="First Name"
                variant="outlined"
                fullWidth
                mb={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required={true}
                value={last}
                onChange={(event) => setLast(event.target.value)}
                label="Last Name"
                placeholder="Last Name"
                variant="outlined"
                fullWidth
                mb={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required={true}
                value={vehicle}
                onChange={(event) => setVehicle(event.target.value)}
                label="Primary Vehicle"
                placeholder="Honda Civic"
                variant="outlined"
                fullWidth
                mb={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required={true}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                label="Email"
                placeholder="name@gmail.com"
                variant="outlined"
                fullWidth
                mb={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required={true}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                label="Password"
                placeholder="123abc"
                variant="outlined"
                fullWidth
                mb={2}
              />
            </Grid>
          </Grid>
          <Button 
            variant="contained" 
            onClick={submitForm} 
            sx={{ 
              mt: '2%', 
              color: 'white',
              backgroundColor: "#349dd0",
              "&:hover": { backgroundColor: "#2fc484" }
            }}
          >
            Submit
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}

export default EditProfile;
