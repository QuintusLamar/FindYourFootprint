import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import NaturePeopleIcon from "@mui/icons-material/NaturePeople";
import Co2Icon from "@mui/icons-material/Co2";
import MovingIcon from "@mui/icons-material/Moving";
import axios from "axios";
import ViewFriends from "../Components/ViewFriends";

// This should be nicer, idk what the plan is for the design though

const Profile = ({ ck, setAuthenticated, removeCookie }) => {
  const [name, setName] = useState(""); // These need to be updated
  const [savedCO2, setSavedCO2] = useState(0);
  const [traveledMiles, setTraveledMiles] = useState(0);
  const [favMode, setFavMode] = useState("Bike");

  console.log(ck);
  const format_twodec = (x) => {
    return Math.floor(x) + Math.floor(x * 100 - Math.floor(x) * 100) / 100;
  };
  const get_stats = async () => {
    try {
      const apiUrl = "http://127.0.0.1:5000/user_stats";

      const urlWithParameters = `${apiUrl}?token=${encodeURIComponent(
        ck["token"]
      )}`;
      const response = await axios.get(urlWithParameters);
      const result = await response.data;
      // console.log("RESPONSE:", response.data);

      if (response.status === 200) {
        console.log("Calculated user stats successfully");
        console.log(result);
        setName(result["name"]);
        setTraveledMiles(format_twodec(result["total_distance"]));
        setSavedCO2(format_twodec(result["saved_carbon"]));
        // Add any further actions after a successful update
      } else {
        console.error("Failed to calculate user stats successfully");
        // Handle error cases
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network errors or other exceptions
    }
  };
  get_stats();

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar />
      <Box sx={{ ml: "10px", flexGrow: 1, p: 3 }}>
        <Typography variant="h3" gutterBottom>
          Welcome, {name}!
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: "primary.main",
                    mb: 2,
                  }}
                >
                  <Co2Icon fontSize="large" />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  Saved CO2: {savedCO2} grams
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: "secondary.main",
                    mb: 2,
                  }}
                >
                  <MovingIcon fontSize="large" />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  Traveled Miles: {traveledMiles} miles
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Divider sx={{ my: 3 }} />

        <Paper
          elevation={3}
          sx={{ p: 3, justifyContent: "center", alignItems: "center" }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Your favorite mode of sustainable transportation is:
          </Typography>
          <Avatar
            sx={{
              width: 150,
              height: 150,
              bgcolor: "info.main",
              mx: "auto",
              mt: 2,
            }}
          >
            <DirectionsBikeIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" align="center" gutterBottom sx={{ mt: 2 }}>
            {favMode}
          </Typography>
        </Paper>

        <Divider sx={{ my: 3 }} />

        <Paper
          elevation={3}
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ViewFriends />
        </Paper>
      </Box>
    </Box>
  );
};

export default Profile;
