import { useState, useEffect } from 'react';
import '../App.css';
import UserTable from '../Components/UserTable'
import UserTypeSelector from '../Components/UserTypeSelector'
import TimeRangeSelector from '../Components/TimeRangeSelector';
import { private_excludeVariablesFromRoot } from '@mui/material';
import { create } from '@mui/material/styles/createTransitions';


function createData(rank, name, output) {
  return { rank, name, output };
}


function Leaderboard() {
  const [userType, setUserType] = useState("Friends");
  const [title, setTitle] = useState("Leaders in Carbon Output All Time");
  const [rows, setRows] = useState([
    createData(1, "Tom Brady", 0.5),
    createData(2, "Aaron Rodgers", 1),
    createData(3, "Patrick Mahomes", 2),
    createData(4, "Lamar Jackson", 6),
    createData(5, "Jalen hurts", 12),
    createData(6, "Brock Purdy", 14),
    createData(7, "Joe Burrow", 18),
    createData(8, "Trevor Lawrence", 21),
    createData(9, "Joshua Dobbs", 26),
    createData(10, "CJ Stroud", 28)
  ]);

  // Don't implement this yet
  useEffect(() => {
    // Pretty sure I want to change data (aka rows) if either the title or users gets changed,
    const updateData = async () => { try {
      const apiUrl = 'http://127.0.0.1:5000/leaderboard';
      const email = "user_5@example.com"
      const time_period = title.replace('Leaders in Carbon Output ', '').replace(' ', '').toLowerCase()
      const urlWithParameters = `${apiUrl}?email=${email}&time_period=${time_period}&is_friends_only=${userType}`;
      const response = await fetch(urlWithParameters, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        const newrows = [];
        for (let index = 0; index < data.length; index++) {
          newrows.push(createData(data[index][0], data[index][1], data[index][2]))
        }
        setRows(newrows)
    
      } else {
        console.error('Failed to update profile');
        // Handle error cases
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle network errors or other exceptions
    } };
    updateData();
  }, [title, userType]);


  function changeUsers(target) {
    console.log("Selected user: ", target)
    setUserType(target)
  }

  function changeTime(target) {
    console.log("Selected title: ", target)
    setTitle("Leaders in Carbon Output " + target)
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