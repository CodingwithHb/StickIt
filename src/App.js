import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import List from "./components/listesnotes";
import Login from "./components/Login";
import UsersList from "./components/users";
import ChangePassword from "./components/ChangePassword";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const [isconnected, setisconnected] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserName = localStorage.getItem("userName");
    if (token) {
      setisconnected(true); // If token exists, the user is logged in
      if (storedUserName) {
        setUserName(storedUserName); // Retrieve and set the user name
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token
    localStorage.removeItem("userName"); // Remove the user name
    setisconnected(false); // Set user as logged out
    setUserName(""); // Clear the user name
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Protected Route for List, only accessible when the user is logged in */}
          <Route
            path="/"
            element={
              isconnected ? (
                <List onLogout={handleLogout} firstName={userName} />
              ) : (
                <Login setisconnected={setisconnected} setUserName={setUserName} />
              )
            }
          />

          {/* Route for UsersList, can be accessed only if logged in */}
          {isconnected && <Route path="/users" element={<UsersList />} />}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
