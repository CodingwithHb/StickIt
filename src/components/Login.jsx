import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.scss";

function Login({ setisconnected ,setUserName }) {
  const [cin, setCin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("https://notes.devlop.tech/api/login", {
        cin,
        password,
      });
      localStorage.setItem("token", response.data.token); 
      
      const userFirstName = response.data.user.first_name;
      const userLastName = response.data.user.last_name;
      const fullName = `${userFirstName} ${userLastName}`;

     
      localStorage.setItem("userName", fullName); // Save full name to localStorage
      setUserName(fullName);

      // Save token to localStorage
      setisconnected(true); // Update state to show notes list
      navigate("/"); // Redirect to home or notes list page
    } catch (err) {
      setError("Invalid CIN or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container">
      <h1 className="name_app">StickIt 📝</h1>
      <div className="login-container">
        <div className="circle circle-one"></div>
        <div className="form-container">
          <img
            src="https://raw.githubusercontent.com/hicodersofficial/glassmorphism-login-form/master/assets/illustration.png"
            alt="illustration"
            className="illustration"
          />
         
          <form>
            <input
              type="text"
              placeholder="CIN"
              value={cin}
              onChange={(e) => setCin(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={handleLogin}
              disabled={loading}
              className="opacity"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
          
        </div>
        <div className="circle circle-two"></div>
      </div>
    </section>
  );
}

export default Login;
