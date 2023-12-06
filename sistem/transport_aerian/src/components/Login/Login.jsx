import React, { useEffect, useState } from "react";
import "./Login.css";
import NavigationBar from "../../utils/NavigationBar";
import Follow from "../../utils/Follow";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import companyLogo from "../../media/TOMAir-removebg-preview.png";
import CryptoJS from "crypto-js";

import { ref, child, get } from "firebase/database";
import { initializeDatabase } from "../../dbConfig";
const TOMAirDB = initializeDatabase();
const getData = ref(TOMAirDB);

function Login() {
  let user = { user: " ", isConnected: false };
  const [reservationCompleted, setReservationCompleted] = useState(false);
  const key = {
    words: [
      19088743, -1985229329, 19088743, -1985229329, 19088743, -1985229329,
      19088743, -1985229329,
    ],
    sigBytes: 32,
  };
  const iv = {
    words: [268581919, 2823186299, 1780861289, 2013662002],
    sigBytes: 16,
  };

  useEffect(() => {
    fetch("http://localhost:5000/reservation-completed")
      .then((res) => res.json())
      .then((data) => {
        setReservationCompleted(data);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  const [dataSet, setDataSet] = useState([]);
  const [adminDataSet, setAdminDataSet] = useState([]);
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    get(child(getData, "users/")).then((snapshot) => {
      let data = snapshot.val();
      setUsers(Object.keys(data));
      setDataSet(data);
    });
  }, []);

  useEffect(() => {
    get(child(getData, "admins/")).then((snapshot) => {
      let data = snapshot.val();
      setAdmins(Object.keys(data));
      setAdminDataSet(data);
    });
  }, []);

  const handleUsernameBlur = (ev) => {
    if (ev.target.value === "") {
      toast.warning("Please enter a valid username");
      return false;
    }
    if (!users.includes(ev.target.value) && !admins.includes(ev.target.value)) {
      toast.warning("User does not exist! Create an account to continue!");
      return false;
    }
    return true;
  };

  const handleUsernameChange = (ev) => {
    if (handleUsernameBlur) {
      setUsername(ev.target.value);
    }
  };

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const handlePasswordBlur = (ev) => {
    const normalPassword = ev.target.value;
    const encryptedPassword = CryptoJS.AES.encrypt(normalPassword, key, {
      iv: iv,
    }).toString();
    if (!passwordRegex.test(normalPassword)) {
      toast.warning(
        "Invalid password format! Password should contain at least one upper case character, one number and one symbol. It also must be at least 8 characters long!"
      );
      return false;
    }
    if (users.includes(username)) {
      if (encryptedPassword !== dataSet[`${username}`].PASSWORD) {
        toast.warning("Incorrect password!");
        return false;
      }
    }
    if (admins.includes(username)) {
      if (encryptedPassword !== adminDataSet[`${username}`].PASSWORD) {
        toast.warning("Incorrect password!");
        return false;
      }
    }
    return true;
  };

  const handlePasswordChange = (ev) => {
    if (handlePasswordBlur) {
      setPassword(ev.target.value);
    }
  };

  const navigate = useNavigate();

  const onLoginSuccess = async (ev) => {
    ev.preventDefault();

    if (!users.includes(username) && !admins.includes(username)) {
      toast.error("User does not exist! Create an account to continue!");
      return;
    }

    const encryptedPassword = CryptoJS.AES.encrypt(password, key, {
      iv: iv,
    }).toString();

    if (users.includes(username)) {
      if (encryptedPassword !== dataSet[`${username}`].PASSWORD) {
        toast.warning("Incorrect password!");
        return false;
      }
    }
    if (admins.includes(username)) {
      if (encryptedPassword !== adminDataSet[`${username}`].PASSWORD) {
        toast.warning("Incorrect password!");
        return false;
      }
    }

    if (username === "" || password === "" || !passwordRegex.test(password)) {
      toast.error("Please complete all the fields!");
      return;
    } else {
      setUsername("");
      setPassword("");
      toast.success("Successful login!");
      user = { user: username, isConnected: true };
      fetch("http://localhost:5000/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })
        .then((response) => response.json())
        .catch((error) => console.error(error));
      setTimeout(() => {
        if (/^admin.*/.test(username)) {
          navigate(
            "/U2FsdGVkX18a0ssg4sd/Fx06bJgb5Xyu272MEUhxpLpk4uw2F5c89Ny42Nf64/Ro"
          );
        } else {
          if (reservationCompleted.isCompleted === true) {
            navigate("/reservation-details");
          } else {
            navigate("/");
          }
        }
      }, 2000);
    }
  };

  return (
    <div className="root">
      <NavigationBar />
      <div className="login">
        <img
          id="logoHeader"
          src={companyLogo}
          height="200px"
          width="200px"
          alt="company logo"></img>
        <h1 id="welcomeHeader">Welcome back to TOMAir!</h1>
        <div className="formLogin">
          <div className="labelsLogin">
            <label className="labelLogin">Username: </label>
            <br />
            <label className="labelLogin">Password: </label>
          </div>
          <div className="inputsLogin">
            <input
              className="inputLogin"
              type="username"
              value={username}
              onBlur={handleUsernameBlur}
              onChange={handleUsernameChange}></input>
            <br />
            <input
              className="inputLogin"
              type="password"
              value={password}
              onBlur={handlePasswordBlur}
              onChange={handlePasswordChange}></input>
          </div>
          <ToastContainer />
        </div>
        <div className="btnLogin">
          <Button id="btnLogin" onClick={onLoginSuccess}>
            Sign in!
          </Button>
        </div>
        <div className="goToCreate">
          <p id="paragAccount">
            You don't have an account? Click{" "}
            <a href="/#/create-account">here</a> to create one.
          </p>
        </div>
      </div>
      <Follow />
    </div>
  );
}

export default Login;
