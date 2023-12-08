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
import ProgressBar from "../Components/ProgressBar";
import DirectionsBusFilledIcon from "@mui/icons-material/DirectionsBusFilled";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

// This should be nicer, idk what the plan is for the design though

const Stats = ({ ck, setAuthenticated, removeCookie }) => {
  window.scrollTo(0, 0);

  const [name, setName] = useState(""); // These need to be updated
  const [savedCO2, setSavedCO2] = useState(0);
  const [traveledMiles, setTraveledMiles] = useState(0);
  const [favMode, setFavMode] = useState("Bike");
  const [numWalk, setNumWalk] = useState(0);
  const [numBike, setNumBike] = useState(0);
  const [numTransit, setNumTransit] = useState(0);
  const [monthSavedCO2, setMonthSavedCO2] = useState(0);
  const [icon, setIcon] = useState(<></>);

  const modeIcons = {
    sedan: <DirectionsCarIcon fontSize="large" />,
    transit: <DirectionsBusFilledIcon fontSize="large" />,
    bike: <DirectionsBikeIcon fontSize="large" />,
    walk: <DirectionsWalkIcon fontSize="large" />,
  };

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
      console.log("RESPONSE:", response.data);

      if (response.status === 200) {
        console.log("Calculated user stats successfully");
        console.log(result);
        setName(result["name"]);
        setTraveledMiles(format_twodec(result["total_distance"]));
        setSavedCO2(format_twodec(result["saved_carbon"]));
        setFavMode(result["favorite_mode"]);
        setNumWalk(result["num_walk_this_month"]);
        setNumBike(result["num_bike_this_month"]);
        setNumTransit(result["num_transit_this_month"]);
        setMonthSavedCO2(result["saved_carbon_this_month"]);
        setIcon(modeIcons[result["favorite_mode"]]);
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
      <Box sx={{ ml: "10px", flexGrow: 1, p: 3 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h3" gutterBottom>
            {name}'s Stats!
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar
                  sx={{ width: 100, height: 100, bgcolor: "#349dd0", mb: 2 }}
                >
                  <Co2Icon fontSize="large" />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  Saved CO2: {savedCO2} grams
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar
                  sx={{ width: 100, height: 100, bgcolor: "#2fc484", mb: 2 }}
                >
                  <MovingIcon fontSize="large" />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  Traveled Miles: {traveledMiles} miles
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar
                  sx={{ width: 100, height: 100, bgcolor: "#FFA500", mb: 2 }}
                >
                  {favMode == "walk" ? (
                    <DirectionsWalkIcon fontSize="large" />
                  ) : favMode == "bike" ? (
                    <DirectionsBikeIcon fontSize="large" />
                  ) : favMode == "transit" ? (
                    <DirectionsBusFilledIcon fontSize="large" />
                  ) : (
                    <DirectionsCarIcon fontSize="large" />
                  )}
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  Favorite Mode: {favMode}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        {/* <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h3" gutterBottom>{name}'s Stats!</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ width: 100, height: 100, bgcolor: '#349dd0', mb: 2 }}>
                  <Co2Icon fontSize="large" />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  Saved CO2: {savedCO2} pounds
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ width: 100, height: 100, bgcolor: '#2fc484', mb: 2 }}>
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

        <Paper elevation={3} sx={{ p: 3, justifyContent:'center', alignItems:'center' }}>
          <Typography variant="h4" gutterBottom sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            Your favorite mode of sustainable transportation is: {favMode}
          </Typography>
          <Avatar sx={{ width: 150, height: 150, bgcolor: 'info.main', mx: 'auto', mt: 2 }}>
            {
              favMode=="walk"? <DirectionsWalkIcon fontSize="large"/> : favMode=="bike"? <DirectionsBikeIcon fontSize="large"/> : favMode=="transit"? <DirectionsBusFilledIcon fontSize="large"/> : <DirectionsCarIcon fontSize="large"/>
            }
          </Avatar>
          <Typography variant="h5" align="center" gutterBottom sx={{ mt: 2 }}>
            {favMode}
          </Typography>
        </Paper> */}

        <Divider sx={{ my: 3 }} />

        <Paper
          elevation={3}
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <ProgressBar
            width={"80%"}
            label={"Number of walk routes this month"}
            currAmount={numWalk}
            maxAmount={12}
          />
          <ProgressBar
            width={"80%"}
            label={"Number of bike routes this month"}
            currAmount={numBike}
            maxAmount={20}
          />
          <ProgressBar
            width={"80%"}
            label={"Number of public transport routes this month"}
            currAmount={numTransit}
            maxAmount={10}
          />
          <ProgressBar
            width={"80%"}
            label={"Saved CO2"}
            currAmount={monthSavedCO2}
            maxAmount={1000}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default Stats;
