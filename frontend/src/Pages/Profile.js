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
import ViewFriends from '../Components/ViewFriends';
import ProgressBar from '../Components/ProgressBar';

// This should be nicer, idk what the plan is for the design though

const Profile = ({ ck, setAuthenticated, removeCookie }) => {
  const [name, setName] = useState(""); // These need to be updated
  const [savedCO2, setSavedCO2] = useState(0);
  const [traveledMiles, setTraveledMiles] = useState(0);
  const [favMode, setFavMode] = useState("Bike");

  window.scrollTo(0, 0);

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
      <Sidebar setAuthenticated={setAuthenticated} removeCookie={removeCookie}/>
      <Box sx={{ ml: '10px', flexGrow: 1, p: 3 }}>
        <Typography variant="h3" gutterBottom>Welcome, {name}!</Typography>
      </Box>
    </Box>
  );
};

export default Profile;
