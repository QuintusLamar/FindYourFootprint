import React, { useState, useEffect } from "react";
import Map from "../Components/Map";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import {
  Grid,
  IconButton,
  Typography,
  Box,
  Container,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import DirectionsBusFilledIcon from "@mui/icons-material/DirectionsBusFilled";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { styled } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";
import EnergySavingsLeafOutlinedIcon from "@mui/icons-material/EnergySavingsLeafOutlined";
import { Dialog, DialogContent } from "@mui/material";

const InputForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  position: "absolute",
  top: 0,
  left: 0,
  padding: 2,
  zIndex: 1000,
  backgroundColor: "rgba(255, 255, 255, 0.9)",
});

const InputField = styled(TextField)({
  width: "100%",
  marginBottom: 2,
});

const SubmitButton = styled(Button)({
  width: "100%",
});

const CarbonInfo = styled("div")(({ theme }) => ({
  position: "absolute",
  top: 20,
  right: 5,
  zIndex: 1000,
  display: "flex",
  flexDirection: "row",
  "& > *:not(:last-child)": {
    marginRight: "8px", // Adjust the margin as needed
  },
  "& > div": {
    borderColor: theme.palette.grey[400], // Match the border color with the primary color of the theme
  },
}));

const FullHeightContainer = styled(Container)({
  height: "100vh",
});

// Sample coordinates below

// Pencil building
// Address: 600 W Peachtree St NW, Atlanta, GA 30308
// Lat/Lng: 33.7707, -84.3866

// Coca Cola building
// Address: 1 Coca Cola Plz NW, Atlanta, GA 30313
// Lat/Lng: 33.7628 -84.3928

const NavPage = (ck) => {
  const [instructionArray, setInstructionArray] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const theme = createTheme();

  const [startAddr, setStartAddr] = useState(
    "600 W Peachtree St NW, Atlanta, GA 30308"
  );
  const [endAddr, setEndAddr] = useState(
    "1 Coca Cola Plz NW, Atlanta, GA 30313"
  );
  const [selectedMode, setSelectedMode] = useState("drive");
  const [routePoints, setRoutePoints] = useState(null);

  const [driveDistance, setdriveDistance] = useState("");
  const [driveTime, setDriveTime] = useState("");
  const [driveCO2, setDriveCO2] = useState("");
  const [driveCO2Ratio, setDriveCO2Ratio] = useState(0);

  const [transitDistance, setTransitDistance] = useState("");
  const [transitTime, setTransitTime] = useState("");
  const [transitCO2, setTransitCO2] = useState("");
  const [transitCO2Ratio, setTransitCO2Ratio] = useState(0);

  const [bikeDistance, setBikeDistance] = useState("");
  const [bikeTime, setBikeTime] = useState("");

  const [walkDistance, setWalkDistance] = useState("");
  const [walkTime, setWalkTime] = useState("");

  const selectedStyle = {
    color: "#fff",
    bgcolor: "#9dc183",
  };

  useEffect(() => {
    if (selectedMode) {
      const event = { preventDefault: () => {} };
      submitRoute(event);
    }
  }, [selectedMode]);

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    const event = { preventDefault: () => {} };
    // submitRoute(event); //TODO TEST IF YOU CAN REMOVE THIS AND FUNCTIONALITY STILL WORKS
    displayDirections();
  };

  async function getDirections(startCoord, endCoord, mode) {
    const apiUrl = `https://api.geoapify.com/v1/routing?waypoints=${encodeURIComponent(
      `${startCoord[0]},${startCoord[1]}`
    )}|${encodeURIComponent(
      `${endCoord[0]},${endCoord[1]}`
    )}&mode=${encodeURIComponent(mode)}&apiKey=${encodeURIComponent(api_key)}`;

    try {
      const response = await axios.get(apiUrl);
      return response.data;
    } catch (error) {
      console.error("Error fetching directions from Geoapify:", error.message);
      throw error;
    }
  }

  async function displayDirections() {
    console.log("INSIDE DISPLAY DIRECTIONS");
    if (startAddr !== "" && endAddr !== "") {
      console.log("INSIDE IF");
      let startAddrStr = addressToString(startAddr);
      let startUrl =
        "https://api.geoapify.com/v1/geocode/search?text=" +
        startAddrStr +
        "&apiKey=" +
        api_key;
      let endAddrStr = addressToString(endAddr);
      let endUrl =
        "https://api.geoapify.com/v1/geocode/search?text=" +
        endAddrStr +
        "&apiKey=" +
        api_key;

      let startResult = await getPoints(startUrl);
      let endResult = await getPoints(endUrl);

      let startCoord = getAve(startResult.features);
      let endCoord = getAve(endResult.features);

      const routeDirections = await getDirections(
        startCoord,
        endCoord,
        selectedMode
      );
      const directionSteps =
        routeDirections.features[0].properties.legs[0].steps;
      const instructionArray = [];

      console.log(directionSteps);
      for (let i = 0; i < directionSteps.length; i++) {
        instructionArray.push(directionSteps[i].instruction.text);
      }

      setInstructionArray(instructionArray);
      setOpenDialog(true);
    }
  }

  async function recordingRoute(e) {
    e.preventDefault();
    console.log("INSIDE RECORDING ROUTE:", selectedMode);

    if (startAddr !== "" && endAddr !== "") {
      let startAddrStr = addressToString(startAddr);
      let startUrl =
        "https://api.geoapify.com/v1/geocode/search?text=" +
        startAddrStr +
        "&apiKey=" +
        api_key;
      let endAddrStr = addressToString(endAddr);
      let endUrl =
        "https://api.geoapify.com/v1/geocode/search?text=" +
        endAddrStr +
        "&apiKey=" +
        api_key;

      let startResult = await getPoints(startUrl);
      let endResult = await getPoints(endUrl);

      let startCoord = getAve(startResult.features);
      let endCoord = getAve(endResult.features);

      // let driveRoute = await getRoute(startCoord, endCoord, "drive");
      // let drivePoints = driveRoute.features[0].geometry.coordinates[0];
      // console.log("DRIVE Route: ", driveRoute)
      // things we need for recording route: userId, routeId, carbonOutput, timeStamp, vehicleId, routeDistance
      switch (selectedMode) {
        case "drive":
          try {
            const apiUrl = "http://127.0.0.1:5000/add_routeRecord";
            const tokenDrive = ck["ck"]["token"];
            const currentOptionDistance = driveDistance;
            const currentOptionTime = driveTime;
            const currentOptionCO2 = driveCO2;
            const response = await axios.post(apiUrl, {
              tokenDrive,
              currentOptionDistance,
              currentOptionTime,
              currentOptionCO2,
              "Access-Control-Allow-Origin": "*",
            });

            if (response.status === 200) {
              console.log(
                "GREAT! SUCCESSFULLY ADDED DRIVE RECORD TO RECORDS TABLE"
              );
            }
          } catch (error) {
            console.log(error);
          }
          break;
        case "bus":
          try {
            const apiUrl = "http://127.0.0.1:5000/add_routeRecord";
            const tokenDrive = ck["ck"]["token"];
            const currentOptionDistance = transitDistance;
            const currentOptionTime = transitTime;
            const currentOptionCO2 = transitCO2;
            const response = await axios.post(apiUrl, {
              tokenDrive,
              currentOptionDistance,
              currentOptionTime,
              currentOptionCO2,
              "Access-Control-Allow-Origin": "*",
            });

            if (response.status === 200) {
              console.log(
                "GREAT! SUCCESSFULLY ADDED TRANSIT RECORD TO RECORDS TABLE"
              );
            }
          } catch (error) {
            console.log(error);
          }
          break;
        case "bicycle":
          try {
            const apiUrl = "http://127.0.0.1:5000/add_routeRecord";
            const tokenDrive = ck["ck"]["token"];
            const currentOptionDistance = bikeDistance;
            const currentOptionTime = bikeTime;
            const currentOptionCO2 = 0.0;
            const response = await axios.post(apiUrl, {
              tokenDrive,
              currentOptionDistance,
              currentOptionTime,
              currentOptionCO2,
              "Access-Control-Allow-Origin": "*",
            });

            if (response.status === 200) {
              console.log(
                "GREAT! SUCCESSFULLY ADDED BIKE RECORD TO RECORDS TABLE"
              );
            }
          } catch (error) {
            console.log(error);
          }
          break;

        case "walk":
          try {
            const apiUrl = "http://127.0.0.1:5000/add_routeRecord";
            const tokenDrive = ck["ck"]["token"];
            const currentOptionDistance = walkDistance;
            const currentOptionTime = walkTime;
            const currentOptionCO2 = 0.0;
            const response = await axios.post(apiUrl, {
              tokenDrive,
              currentOptionDistance,
              currentOptionTime,
              currentOptionCO2,
              "Access-Control-Allow-Origin": "*",
            });

            if (response.status === 200) {
              console.log(
                "GREAT! SUCCESSFULLY ADDED WALK RECORD TO RECORDS TABLE"
              );
            }
          } catch (error) {
            console.log(error);
          }
          break;
        default:
          // setRoutePoints(drivePoints);
          console.log("Walk route: ", routePoints);
          break;
      }
    }
  }

  const format_twodec = (x) => {
    return Math.floor(x) + Math.floor(x * 100 - Math.floor(x) * 100) / 100;
  };

  const api_key = "48fbefd89de548768e248393b9881b79";

  function addressToString(addr) {
    let newAddr = addr.replaceAll(",", "%2C");
    let addrStr = newAddr.replaceAll(" ", "%20");
    return addrStr;
  }

  function getPoints(url) {
    var requestOptions = {
      method: "GET",
    };

    return fetch(url, requestOptions)
      .then((response) => response.json())
      .catch((error) => console.log("Error: ", error));
  }

  function getRoute(startCoord, endCoord, mode) {
    let final_url = `https://api.geoapify.com/v1/routing?waypoints=${startCoord.join(
      ","
    )}|${endCoord.join(
      ","
    )}&mode=${mode}&details=instruction_details&apiKey=${api_key}`;
    return fetch(final_url).then((res) => res.json());
  }

  //TODO LOOK INTO IF THIS AVERAGE IS CORRECT, sometimes it gives multiple routes
  function getAve(features) {
    let finalCoord = [0, 0];
    features.forEach((feature) => {
      finalCoord[0] = finalCoord[0] + feature.geometry.coordinates[1];
      finalCoord[1] = finalCoord[1] + feature.geometry.coordinates[0];
    });
    finalCoord[0] = finalCoord[0] / features.length;
    finalCoord[1] = finalCoord[1] / features.length;

    return finalCoord;
  }

  async function submitRoute(e) {
    e.preventDefault();
    // console.log("INSIDE SUBMIT ROUTE:", selectedMode)
    if (startAddr !== "" && endAddr !== "") {
      let startAddrStr = addressToString(startAddr);
      let startUrl =
        "https://api.geoapify.com/v1/geocode/search?text=" +
        startAddrStr +
        "&apiKey=" +
        api_key;
      let endAddrStr = addressToString(endAddr);
      let endUrl =
        "https://api.geoapify.com/v1/geocode/search?text=" +
        endAddrStr +
        "&apiKey=" +
        api_key;

      let startResult = await getPoints(startUrl);
      let endResult = await getPoints(endUrl);

      let startCoord = getAve(startResult.features);
      let endCoord = getAve(endResult.features);

      let driveRoute = await getRoute(startCoord, endCoord, "drive");
      let transitRoute = await getRoute(startCoord, endCoord, "transit");
      let bikeRoute = await getRoute(startCoord, endCoord, "bicycle");
      let walkRoute = await getRoute(startCoord, endCoord, "walk");

      try {
        let drivePoints = driveRoute.features[0].geometry.coordinates[0];
        setRoutePoints(drivePoints);
        let transitPoints = transitRoute.features[0].geometry.coordinates[0];
        let bikePoints = bikeRoute.features[0].geometry.coordinates[0];
        let walkPoints = walkRoute.features[0].geometry.coordinates[0];

        switch (selectedMode) {
          case "drive":
            setRoutePoints(drivePoints);
            // console.log("Drive route: ", routePoints);
            break;
          case "bus":
            setRoutePoints(transitPoints);
            // console.log("Transit route: ", routePoints);
            break;
          case "bicycle":
            setRoutePoints(bikePoints);
            // console.log("Bicycle route: ", routePoints);
            break;
          case "walk":
            setRoutePoints(walkPoints);
            break;
          default:
            setRoutePoints(drivePoints);
            console.log("Walk route: ", routePoints);
            break;
        }
      } catch (error) {
        //catches when there's the limbo stage between a null vlaue for route
        console.log(error);
      }

      let drivePoints = driveRoute.features[0].geometry.coordinates[0];
      let transitPoints;
      console.log("sarang");
      console.log(driveRoute);
      console.log(transitRoute);
      if (transitRoute.features != null) {
        transitPoints = transitRoute.features[0].geometry.coordinates[0];
      }
      let bikePoints = bikeRoute.features[0].geometry.coordinates[0];
      let walkPoints = walkRoute.features[0].geometry.coordinates[0];

      // all the distances are in meters
      let driveDistance =
        driveRoute.features[0].properties.distance / 1000 / 1.609;

      let transitDistance;
      if (transitPoints) {
        transitDistance =
          transitRoute.features[0].properties.distance / 1000 / 1.609;
      }

      let bikeDistance =
        bikeRoute.features[0].properties.distance / 1000 / 1.609;
      let walkDistance =
        walkRoute.features[0].properties.distance / 1000 / 1.609;

      if (transitRoute.features == null) {
        transitDistance = 0;
      }

      try {
        const apiUrl = "http://127.0.0.1:5000/carboncost";
        const urlWithParameters = `${apiUrl}?token=${
          ck["ck"]["token"]
        }&driveDistance=${driveDistance.toString()}&transitDistance=${transitDistance.toString()}`;
        const response = await axios.get(urlWithParameters);
        const result = await response.data;

        if (response.status === 200) {
          console.log("Test: ", (result["Sedan"] + result["SUV"]) / 2)
          console.log("Test again: ", driveDistance)
          setDriveCO2((result["Sedan"] + result["SUV"]) / 2);
          setTransitCO2(result["Bus"] + result["Train"] / 2);
          setdriveDistance(driveDistance);
          setTransitDistance(transitDistance);
          setBikeDistance(bikeDistance);
          setWalkDistance(walkDistance);
          setDriveTime(driveRoute.features[0].properties.time);
          setWalkTime(walkRoute.features[0].properties.time);
          setTransitCO2Ratio(((result["Bus"] + result["Train"]) / 2) / (transitDistance * 1.609));
          setDriveCO2Ratio(((result["Sedan"] + result["SUV"]) / 2) / (driveDistance * 1.609));
          console.log(driveCO2Ratio)

          if (transitRoute.features == null) {
            setTransitTime(0);
          } else {
            setTransitTime(transitRoute.features[0].properties.time);
          }
          setBikeTime(bikeRoute.features[0].properties.time);
          // Add any further actions after a successful update
        } else {
          console.error("Failed to calculate carbon cost successfully");
          // Handle error cases
        }
      } catch (error) {
        console.error("Error:", error);
        // Handle network errors or other exceptions
      }
    } else {
      console.log("Starting address or ending address not entered");
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <FullHeightContainer sx={{ paddingTop: 10 }}>
        <Grid container spacing={0}>
          <InputForm
            sx={{
              p: 2,
              backgroundColor: "rgba(255, 255, 255, 0)",
              width: "380px",
            }}
          >
            <InputField
              type="text"
              placeholder="Enter starting address here"
              value={startAddr}
              onChange={(e) => setStartAddr(e.target.value)}
              required={true}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 1)",
                width: "100%",
                mb: 1,
                p: 0,
                borderRadius: "4px",
              }}
            />
            <InputField
              type="text"
              placeholder="Enter ending address here"
              value={endAddr}
              onChange={(e) => setEndAddr(e.target.value)}
              required={true}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 1)",
                width: "100%",
                mb: 2,
                p: 0,
                borderRadius: "4px",
              }}
            />
            <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
              <SubmitButton
                variant="contained"
                onClick={submitRoute}
                sx={{ width: "1%", mb: 2, p: 1 }}
              >
                <SearchIcon />
              </SubmitButton>
              <SubmitButton
                variant="contained"
                onClick={recordingRoute}
                sx={{ width: "100%", mb: 2, p: 1 }}
              >
                Submit Route
              </SubmitButton>
            </div>
          </InputForm>

          <CarbonInfo>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{
                backgroundColor: selectedMode === "drive" ? "grey" : "white",
                color: selectedMode === "drive" ? "white" : "black",
                "&:hover": {
                  backgroundColor: "lightgrey",
                  color: "black",
                },
                padding: "10px",
                borderRadius: "30px",
                border: "1px solid",
                cursor: "pointer",
              }}
              onClick={() => {
                handleModeSelect("drive");
              }}
            >
              <Box
                sx={{
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <DirectionsCarIcon sx={{ml: "45%"}}/>
                <EnergySavingsLeafOutlinedIcon 
                  sx={{
                    ml: "20%",
                    color: driveCO2Ratio < 100 ? 'lightgreen' : (driveCO2Ratio >= 100 && driveCO2Ratio <= 125) ? 'green' : 'brown'

                  }}
                />
              </Box>

              <Typography textAlign={"center"}>
                {format_twodec(driveCO2)} grams of CO2
              </Typography>
              <Typography textAlign={"center"}>
                {format_twodec(driveDistance)} miles{" "}
              </Typography>
              <Typography textAlign={"center"}>
                {format_twodec(driveTime / 60)} minutes
              </Typography>
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{
                backgroundColor: selectedMode === "bus" ? "grey" : "white",
                color: selectedMode === "bus" ? "white" : "black",
                "&:hover": {
                  backgroundColor: "lightgrey",
                  color: "black",
                },
                padding: "10px",
                borderRadius: "30px",
                border: "1px solid",
                cursor: "pointer",
              }}
              onClick={() => {
                handleModeSelect("bus");
              }}
            >
              
              <Box
                sx={{
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <DirectionsBusFilledIcon sx={{ml: "45%"}}/>
                <EnergySavingsLeafOutlinedIcon 
                  sx={{
                    ml: "20%",
                    color: transitCO2Ratio < 63 ? 'lightgreen' : (transitCO2Ratio >= 63 && transitCO2Ratio <= 160) ? 'green' : 'brown'

                  }}
                />
              </Box>

              <Typography textAlign={"center"}>
                {format_twodec(transitCO2)} grams of CO2
              </Typography>
              <Typography textAlign={"center"}>
                {format_twodec(transitDistance)} miles
              </Typography>
              <Typography textAlign={"center"}>
                {format_twodec(transitTime / 60)} minutes
              </Typography>
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{
                backgroundColor: selectedMode === "bicycle" ? "grey" : "white",
                color: selectedMode === "bicycle" ? "white" : "black",
                "&:hover": {
                  backgroundColor: "lightgrey",
                  color: "black",
                },
                padding: "10px",
                borderRadius: "30px",
                border: "1px solid",
                cursor: "pointer",
              }}
              onClick={() => {
                handleModeSelect("bicycle");
              }}
            >
              
              <Box
                sx={{
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <DirectionsBikeIcon sx={{ml: "45%"}}/>
                <EnergySavingsLeafOutlinedIcon 
                  sx={{
                    ml: "12%",
                    color: "lightgreen"
                  }}
                />
              </Box>
              

              <Typography textAlign={"center"}>0 grams of CO2</Typography>
              <Typography textAlign={"center"}>
                {format_twodec(bikeDistance)} miles
              </Typography>
              <Typography textAlign={"center"}>
                {format_twodec(bikeTime / 60)} minutes
              </Typography>
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{
                backgroundColor: selectedMode === "walk" ? "grey" : "white",
                color: selectedMode === "walk" ? "white" : "black",
                "&:hover": {
                  backgroundColor: "lightgrey",
                  color: "black",
                },
                padding: "10px",
                borderRadius: "30px",
                border: "1px solid",
                cursor: "pointer",
              }}
              onClick={() => {
                handleModeSelect("walk");
              }}
            >
              <Box
                sx={{
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <DirectionsWalkIcon sx={{ml: "45%"}}/>
                <EnergySavingsLeafOutlinedIcon sx={{ml: "12%", color: "lightgreen"}}/>
              </Box>

              <Typography textAlign={"center"}>0 grams of CO2</Typography>
              <Typography textAlign={"center"}>
                {format_twodec(walkDistance)} mile
              </Typography>
              <Typography textAlign={"center"}>
                {format_twodec(walkTime / 60)} minutes
              </Typography>
            </Box>
          </CarbonInfo>

          <Paper
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1, // Adjust zIndex as needed
            }}
          >
            <Map routePoints={routePoints} />
          </Paper>
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogContent>
              <Typography variant="h6" gutterBottom>
                Route Instructions:
              </Typography>
              {instructionArray.map((instruction, index) => (
                <Typography key={index} paragraph>
                  {instruction}
                </Typography>
              ))}
            </DialogContent>
          </Dialog>
        </Grid>
      </FullHeightContainer>
    </ThemeProvider>
  );
};

export default NavPage;
