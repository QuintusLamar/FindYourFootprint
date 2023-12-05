import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Profile from "./Pages/Profile";
import EditProfile from "./Components/EditProfile";
import checkTokenExpiration from "./Components/Auth";
import NavPage from "./Pages/NavPage";
import Leaderboard from "./Pages/Leaderboard";
import BottomNav from "./Components/BottomNav";
import Login from "./Components/Login";
import Register from "./Components/Register"; // Import your Register component
import Stats from "./Pages/Stats"
import { CookiesProvider } from "react-cookie";
import { useCookies } from "react-cookie";
import ViewFriends from './Components/ViewFriends';

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [authenticated, setAuthenticated] = useState([false]);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkToken() {
      const token = cookies["token"]; // Example: Retrieve the token from local storage
      if (!token || !authenticated) {
        console.log("No token currently");
        setAuthenticated(false);
        removeCookie("token");
      } else if (await checkTokenExpiration(token)) {
        // Token has expired, redirect to the login page
        console.log("Token has expired");
        removeCookie("token");
        setAuthenticated(false);
        navigate("/");
      } else {
      }
    }
    checkToken();
    // Get the token from your authentication state or storage
  }, [navigate, authenticated, cookies]);

  return (
    <CookiesProvider>
      <div style={{ 
      background: 'linear-gradient(to right, #3498db, #2ecc71)', 
      minHeight: '100vh', 
      padding: '20px' 
    }}>
        <Routes>
          <Route
            path="/"
            element={
              authenticated ? (
                <NavPage ck={cookies} />
              ) : (
                <>
                  <Login
                    setAuthenticated={setAuthenticated}
                    setCookie={setCookie}
                  />
                </>
              )
            }
          />
          <Route
            path="/Register"
            element={
              <Register
                setAuthenticated={setAuthenticated}
                setCookie={setCookie}
              />
            }
          />
          {/* <Route
            path="/Profile/"
            element={
              authenticated ? (
                <Profile
                  ck={cookies}
                  setAuthenticated={setAuthenticated}
                  removeCookie={removeCookie}
                />
              ) : (
                <Login
                  setAuthenticated={setAuthenticated}
                  setCookie={setCookie}
                />
              )
            }
          /> */}
          <Route
            path="/Profile/EditProfile"
            element={
              authenticated ? (
                <EditProfile ck={cookies} />
              ) : (
                <Login
                  ck={cookies}
                  setAuthenticated={setAuthenticated}
                  removeCookie={removeCookie}
                />
              )
            }
          />
          <Route
            path="/Profile/Friends"
            element={
              authenticated ? (
                <ViewFriends 
                  ck={cookies}
                  setAuthenticated={setAuthenticated}
                  removeCookie={removeCookie}
                />
              ) : (
                <Login
                  setAuthenticated={setAuthenticated}
                  setCookie={setCookie}
                />
              )
            }
          />
          <Route
            path="/Stats"
            element={
              authenticated ? (
                <Stats ck={cookies} />
              ) : (
                <Login
                  setAuthenticated={setAuthenticated}
                  setCookie={setCookie}
                />
              )
            }
          />
          <Route
            path="/Leaderboard"
            element={
              authenticated ? (
                <Leaderboard ck={cookies} />
              ) : (
                <Login
                  setAuthenticated={setAuthenticated}
                  setCookie={setCookie}
                />
              )
            }
          />
        </Routes>
        {authenticated && <BottomNav />}{" "}
        {/* Render BottomNav only when authenticated */}
      </div>
    </CookiesProvider>
  );
}

export default App;
