import { useState, useEffect } from "react";
import "../Style/App.css";
import UserTable from "../Components/UserTable";
import UserTypeSelector from "../Components/UserTypeSelector";
import TimeRangeSelector from "../Components/TimeRangeSelector";
import axios from "axios";

function createData(rank, name, output) {
  return { rank, name, output };
}

const Leaderboard = (ck) => {
  const [userType, setUserType] = useState("Friends");
  const [title, setTitle] = useState("Leaders in Carbon Output All Time");

  // This shouldn't be used by anything
  const [rows, setRows] = useState([
    // createData(1, "Tom Brady", 0.5),
    // createData(2, "Aaron Rodgers", 1),
    // createData(3, "Patrick Mahomes", 2),
    // createData(4, "Lamar Jackson", 6),
    // createData(5, "Jalen hurts", 12),
    // createData(6, "Brock Purdy", 14),
    // createData(7, "Joe Burrow", 18),
    // createData(8, "Trevor Lawrence", 21),
    // createData(9, "Joshua Dobbs", 26),
    // createData(10, "CJ Stroud", 28)
  ]);
  console.log(ck);
  const token = ck["token"];
  // console.log(token)
  // Don't implement this yet
  useEffect(() => {
    // Pretty sure I want to change data (aka rows) if either the title or users gets changed,
    const updateData = async () => {
      try {
        const apiUrl = "http://localhost:5000/leaderboard";
        const time_period = title
          .replace("Leaders in Carbon Output ", "")
          .replace(" ", "")
          .toLowerCase();
        const urlWithParameters = `${apiUrl}?token=${ck["ck"]["token"]}&time_period=${time_period}&is_friends_only=${userType}`;
        const response = await axios.get(urlWithParameters);
        if (response.statusText === "OK") {
          const data = await response.data;
          const newrows = [];
          for (let index = 0; index < data.length; index++) {
            newrows.push(
              createData(data[index][0], data[index][1], data[index][2])
            );
          }
          setRows(newrows);
        } else {
          // Handle error cases
        }
      } catch (error) {
        console.error("Error:", error);
        // Handle network errors or other exceptions
      }
    };
    updateData();
  }, [title, userType, ck]);

  function changeUsers(target) {
    console.log("Selected user: ", target);
    setUserType(target);
  }

  function changeTime(target) {
    console.log("Selected title: ", target);
    setTitle("Leaders in Carbon Output " + target);
  }

  return (
    <div className="Leaderboard">
      <TimeRangeSelector changeTime={changeTime} />
      <UserTypeSelector changeUsers={changeUsers} title={title} />
      <UserTable rows={rows} />
    </div>
  );
};

export default Leaderboard;
