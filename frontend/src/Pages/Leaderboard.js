import { useState } from 'react';
import '../App.css';
import UserTable from '../Components/UserTable'
import UserTypeSelector from '../Components/UserTypeSelector'
import TimeRangeSelector from '../Components/TimeRangeSelector';
import { private_excludeVariablesFromRoot } from '@mui/material';


function createData(rank, name, output, prev_rank) {
  return { rank, name, output, prev_rank };
}


function Leaderboard() {
  const [userType, setUserType] = useState("Friends");
  const [title, setTitle] = useState("Leaders in Carbon Output All Time");

  // Don't implement this yet
  // useEffect(() => {
  //   // Pretty sure I want to change data (aka rows) if either the title or users gets changed
  //   load_leaderboard();

  // }, [title, users]);

  const rows = [
    createData(1, "Tom Brady", 0.5, 5),
    createData(2, "Aaron Rodgers", 1, 2),
    createData(3, "Patrick Mahomes", 2, 1),
    createData(4, "Lamar Jackson", 6, 3),
    createData(5, "Jalen hurts", 12, 9),
    createData(6, "Brock Purdy", 14, 4),
    createData(7, "Joe Burrow", 18, 8),
    createData(8, "Trevor Lawrence", 21, 7),
    createData(9, "Joshua Dobbs", 26, 10),
    createData(10, "CJ Stroud", 28, 6)
  ];


  const load_leaderboard = async () => {
    const leaderboardFormData = {
      email: "user_5@example.com",
      time_period: "week",
    };

    try {

      const apiUrl = 'http://127.0.0.1:5000/leaderboard';
      const parameter1 = "user_5@example.com"
      const parameter2 = "week"
      const urlWithParameters = `${apiUrl}?param1=${parameter1}&param2=${parameter2}`;
      console.log("HERE 0")
      const response = await fetch(urlWithParameters, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log("HERE 1")

      if (response.ok) {
        console.log('Profile updated successfully');
        // Add any further actions after a successful update

        console.log("HERE 2")

        console.log(response.json())

      } else {
        console.error('Failed to update profile');
        // Handle error cases
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle network errors or other exceptions
    }
  }


  function changeUsers(target) {
    console.log("Selected user: ", target)
    setUserType(target)

    // console.log(target)
    load_leaderboard()
  }

  function changeTime(target) {
    console.log("Selected title: ", target)
    setTitle("Leaders in Carbon Output " + target)

    // console.log(target)
    load_leaderboard()
  }

  return (
    <div className="Leaderboard">
      <TimeRangeSelector 
        changeTime={changeTime}

      />
      <UserTypeSelector 
        changeUsers={changeUsers}
        title={title}
      />
      <UserTable 
        rows = {rows}
      />
      
    </div>
  );
}

export default Leaderboard;