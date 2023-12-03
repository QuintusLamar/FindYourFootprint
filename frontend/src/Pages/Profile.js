import { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import axios from "axios";

// This should be nicer, idk what the plan is for the design though

const Profile = ({ ck, setAuthenticated, removeCookie }) => {
  const [name, setName] = useState(""); // These need to be updated
  const [savedCO2, setSavedCO2] = useState(0);
  const [traveledMiles, setTraveledMiles] = useState(0);
  //   const [favMode, setFavMode] = useState("Bike");

  console.log(ck);
  const format_twodec = (x) => {
    return Math.floor(x) + Math.floor(x * 100 - Math.floor(x) * 100) / 100;
  };
  const get_stats = async () => {
    try {
      const apiUrl = "http://localhost:5000/user_stats";
      // console.log()
      const urlWithParameters = `${apiUrl}?token=${encodeURIComponent(
        ck["token"]
      )}`;
      const response = await axios.get(urlWithParameters, {
        "Access-Control-Allow-Origin": "*",
        Accept: "application/json",
      });
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
      <Sidebar
        setAuthenticated={setAuthenticated}
        removeCookie={removeCookie}
      />
      <Box sx={{ ml: "10px" }}>
        <>
          <h1> Welcome {name}!</h1>

          <h2>
            {" "}
            Using FindYourFootprint, you have saved {format_twodec(
              savedCO2
            )}{" "}
            pounds of CO2
          </h2>
          <h2>
            {" "}
            Using FindYourFootprint, you have traveled{" "}
            {format_twodec(traveledMiles)} traveledMiles
          </h2>
          {/* Have the bike icon here? */}
          {/* <h2> Your favorite mode of sustainable transportation is {favMode}</h2> */}
        </>
      </Box>
    </Box>
  );
};

export default Profile;
