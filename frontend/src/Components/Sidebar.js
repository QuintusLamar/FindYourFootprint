import { useState } from 'react';
import '../Style/App.css';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useNavigate } from "react-router-dom";
import LogoutButton from './LogoutButton';
import Box from '@mui/material/Box';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';

function Sidebar({setAuthenticated, removeCookie}) {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout actions
    // Example: Redirect to the login page, clear user data, etc.
    removeCookie("token");
    setAuthenticated(false);
    navigate("/")
  };

  const sideBarItems = [
    { "text": "View Profile", "navigation": "ViewProfile", "element": <AccountBoxOutlinedIcon ></AccountBoxOutlinedIcon> },
    { "text": "Edit Profile", "navigation": "EditProfile", "element": <EditOutlinedIcon></EditOutlinedIcon> },
    { "text": "Friends", "navigation": "Friends", "element": <PeopleOutlineOutlinedIcon></PeopleOutlineOutlinedIcon> },
    // { "text": "Add Friend", "navigation": "AddFriend", "element": <PersonAddOutlinedIcon></PersonAddOutlinedIcon> },
  ]

  const selectedStyle = {
    color: '#fff',
    bgcolor: '#9dc183'
  };

  function clicked(event) {
    const text = event.target.outerText;
    const replacedText = text.replace(/\s/g, '');

    if (replacedText === "ViewProfile") {
      navigate("/Profile")
    }
    else {
      setTitle(text);
      navigate("/Profile/" + replacedText);
    }
  }

  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box sx={{ display: 'flex', alignItems: 'right' }}>
          <Box>
              <LogoutButton onLogout={handleLogout} />
          </Box>
        </Box>
      <Toolbar />
      <Divider />

      <List>
        {sideBarItems.map((key) => {
          const isSelected = key.text === title;
          // console.log(key.text)
          return (
            < ListItem key={key.text} disablePadding >
              {/* Something about this needs to be updated, the state takes too long to set */}

              <ListItemButton
                onClick={clicked}

                sx={isSelected ? selectedStyle : null} >
                {/* <ListItemButton onClick={(event) => {
                  console.log("Key: ", event)
                }}
                selected={key.text===title}
              > */}
                {key.element}
                < ListItemText primary={key.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List >
    </Drawer >
  )
}

export default Sidebar;