import React, { useContext, useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { logout as logoutAction, setCredentials } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";
import { useLocation } from "react-router-dom";
import LoginIcon from '@mui/icons-material/Login';


const ActivitiesPage = () => (
  <Box sx={{ p: 2, border: "1px dashed grey" }}>
    <ActivityForm onActivityAdded={() => window.location.reload()} />
    <ActivityList />
  </Box>
);

function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // <--- Add this

  // Check if current page is an activity detail page
  const isActivityDetailPage = /^\/activities\/[^/]+$/.test(location.pathname);

  useEffect(() => {
    if (token && tokenData) {
      const safeUser = {
        sub: tokenData.sub,
        name: tokenData.name,
        email: tokenData.email,
      };
      dispatch(setCredentials({ token, user: safeUser }));
    }
  }, [token, tokenData, dispatch]);

  const handleLogout = () => {
    dispatch(logoutAction());
    logOut();
    navigate("/");
  };

  const handleBack = () => {
    navigate("/activities"); // or navigate(-1) if you want previous page
  };

  return (
    <Box component="section" sx={{ p: 2, border: "1px dashed grey" }}>
      {!token ? (
        <Button
  variant="contained"
  color="primary"
  startIcon={<LoginIcon />}
  onClick={() => logIn()}
  sx={{
    padding: "10px 25px",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "8px",
    textTransform: "uppercase",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
  }}
>
  Login with Keycloak
</Button>


      ) : (
        <>
          {isActivityDetailPage ? (
            <Button variant="contained" onClick={handleBack}>
              ⬅ BACK
            </Button>
          ) : (
            <Button variant="contained" onClick={handleLogout}>
              LOGOUT
            </Button>
          )}

          <Routes>
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/activities/:id" element={<ActivityDetail />} />
            <Route
              path="/"
              element={token ? <Navigate to="/activities" replace /> : <div>Welcome! Please login</div>}
            />
          </Routes>
        </>
      )}
    </Box>
  );
}


export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
