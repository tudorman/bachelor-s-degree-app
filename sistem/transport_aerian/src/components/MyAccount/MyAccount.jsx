import React, { useState, useEffect } from "react";
import Follow from "../../utils/Follow";
import NavigationBar from "../../utils/NavigationBar";
import Booking from "../../utils/Booking";
import "./MyAccount.css";
import Trip from "../../utils/Trip";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { ref, child, get, set, remove } from "firebase/database";
import { initializeDatabase } from "../../dbConfig";
import companyLogo from "../../media/TOMAir-removebg-preview.png";
import infoLogo from "../../media/infoIcon.png";
import bookingsLogo from "../../media/bookingsIcon.png";
import upcomingLogo from "../../media/upcomingIcon.png";
import logoutLogo from "../../media/logoutIcon.png";
import deleteLogo from "../../media/deleteAccount.png";
import { ToastContainer, toast } from "react-toastify";

const TOMAirDB = initializeDatabase();
const getData = ref(TOMAirDB);

function MyAccount() {
  const [user, setUser] = useState({ user: "", isConnected: false });
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/user")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    setUsername(user.user);
  }, [user.user]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const today = new Date();
  const currentYear = Number(today.getFullYear());
  const currentMonth = Number(today.getMonth()) + 1;
  const currentDay = Number(today.getDate());
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const [dataSet, setDataSet] = useState([]);
  const [bookingsDataSet, setBookingsDataSet] = useState([]);

  const userRef = ref(TOMAirDB, `users/${username}`);

  useEffect(() => {
    get(child(getData, "users/" + username)).then((snapshot) => {
      let data = snapshot.val();
      setDataSet(data);
    });
  }, [username]);

  useEffect(() => {
    setFirstName(dataSet.FIRST_NAME);
    setLastName(dataSet.LAST_NAME);
    setEmail(dataSet.EMAIL);
    setPhoneNumber(dataSet.PHONE);
    setPassword(dataSet.PASSWORD);
  }, [dataSet]);

  const handlePasswordBlur = (ev) => {
    if (!passwordRegex.test(ev.target.value) || ev.target.value === "") {
      toast.error(
        "Please insert a valid password! The password should contain at least one upper case character, one number and one special character!"
      );
      return false;
    }
    return true;
  };

  const handlePasswordChange = (ev) => {
    if (handlePasswordBlur) {
      setPassword(ev.target.value);
    }
  };

  useEffect(() => {
    get(child(getData, "bookings/" + username)).then((snapshot) => {
      let data = snapshot.val();
      setBookingsDataSet(data);
    });
  }, [username]);

  let noOfBookings = 0;
  let noOfHistoryBookings = 0;
  let noOfPlannedTrips = 0;
  let departureDetails = [];
  let returnDetails = [];
  let passengersDetails = [];
  let insuranceDetails = [];
  let departureTrips = [];
  let returnTrips = [];
  let passengersTrips = [];
  let insuranceTrips = [];

  if (bookingsDataSet) {
    let booking = Object.values(bookingsDataSet);
    noOfBookings += booking.length;
    for (let i = 0; i < noOfBookings; i++) {
      if (booking[i].departure && booking[i].departure.DEPARTURE_DATE) {
        const departureYear = Number(
          booking[i].departure.DEPARTURE_DATE.split("-")[0]
        );
        const departureMonth = Number(
          booking[i].departure.DEPARTURE_DATE.split("-")[1].split("-")[0][1]
        );
        const departureDay = Number(
          booking[i].departure.DEPARTURE_DATE.split("-")[2].split(" ")[0]
        );
        if (
          departureYear < currentYear ||
          (departureYear === currentYear && departureMonth < currentMonth) ||
          (departureYear === currentYear &&
            departureMonth === currentMonth &&
            departureDay < currentDay)
        ) {
          noOfHistoryBookings++;
          departureDetails.push(booking[i].departure);
          if (!booking[i].return) {
            booking[i].return = "-";
          } else {
            returnDetails.push(booking[i].return);
          }
          passengersDetails.push(booking[i].passengers);
          insuranceDetails.push(booking[i].insurance);
        } else {
          noOfPlannedTrips++;
          departureTrips.push(booking[i].departure);
          if (!booking[i].return) {
            booking[i].return = "-";
          } else {
            returnTrips.push(booking[i].return);
          }
          passengersTrips.push(booking[i].passengers);
          insuranceTrips.push(booking[i].insurance);
        }
      }
    }
  }
  const displayInfo = async () => {
    document.getElementById("bookingsHistory").style.display = "none";
    document.getElementById("upcomingTrips").style.display = "none";
    document.getElementById("myInfoDiv").style.display = "block";
  };

  const displayHistory = async () => {
    document.getElementById("myInfoDiv").style.display = "none";
    document.getElementById("upcomingTrips").style.display = "none";
    document.getElementById("bookingsHistory").style.display = "block";
  };

  const displayTrips = async () => {
    document.getElementById("myInfoDiv").style.display = "none";
    document.getElementById("bookingsHistory").style.display = "none";
    document.getElementById("upcomingTrips").style.display = "block";
  };

  const navigate = useNavigate();

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
  const encryptedPassword = CryptoJS.AES.encrypt(password, key, {
    iv: iv,
  }).toString();

  const btnSaveChanges = async () => {
    const reference = ref(TOMAirDB, "users/" + username);
    set(reference, {
      LAST_NAME: lastName,
      FIRST_NAME: firstName,
      BIRTHDATE: dataSet.BIRTHDATE,
      GENDER: dataSet.GENDER,
      PHONE: phoneNumber,
      EMAIL: email,
      PASSWORD: encryptedPassword,
      NATIONALITY: dataSet.NATIONALITY,
    });
    toast.success("Changes saved!");
  };

  const refreshUser = async () => {
    let refreshedUser = { user: "", isConnected: false };
    fetch("http://localhost:5000/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(refreshedUser),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
  };

  const logOut = async () => {
    refreshUser();
    toast.info("Logging out...");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const deleteAccount = async () => {
    remove(userRef).catch((error) => {
      console.error("Error removing data: ", error);
    });
    toast.info("Deleting account...");
    refreshUser();
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  if (username === "") {
    return <h1>Loading...</h1>;
  } else {
    return (
      <div className="rootMyAccount">
        <NavigationBar />
        <div className="userMenuHeader">
          <div className="logoDiv">
            <img
              src={companyLogo}
              alt="CompanyLogo"
              height="100px"
              width="100px"></img>
          </div>
          <div className="welcomeTextDiv">
            <h1>Welcome back, {username}!</h1>
          </div>
        </div>
        <div className="actualMenuDiv">
          <div className="menuInstructionsDiv">
            <div
              className="menuInstruction"
              onClick={displayInfo}
              id="myInfoInstruction">
              <img
                src={infoLogo}
                alt="info icon"
                height="50px"
                width="50px"></img>
              <p>My info</p>
            </div>
            <div className="menuInstruction" onClick={displayHistory}>
              <img
                src={bookingsLogo}
                alt="bookings icon"
                height="50px"
                width="50px"></img>
              <p>Bookings history</p>
            </div>
            <div className="menuInstruction" onClick={displayTrips}>
              <img
                src={upcomingLogo}
                alt="upcoming icon"
                height="50px"
                width="50px"></img>
              <p>Upcoming trips</p>
            </div>
            <div className="menuInstruction" onClick={logOut}>
              <img
                src={logoutLogo}
                alt="log out icon"
                height="50px"
                width="50px"></img>
              <p>Sign out</p>
            </div>
            <div className="menuInstruction" onClick={deleteAccount}>
              <img
                src={deleteLogo}
                alt="delete account icon"
                height="50px"
                width="50px"></img>
              <p>Delete account</p>
            </div>
          </div>
          <div className="userInfoDiv">
            <div className="myInfoDiv" id="myInfoDiv">
              <div className="myInfoLabels">
                <label className="labelInfo">First name:</label>
                <br />
                <br />
                <label className="labelInfo">Last name:</label>
                <br />
                <br />
                <label className="labelInfo">E-mail:</label>
                <br />
                <br />
                <label className="labelInfo">Date of birth:</label>
                <br />
                <br />
                <label className="labelInfo">Gender:</label>
                <br />
                <br />
                <label className="labelInfo">Phone number:</label>
                <br />
                <br />
                <label className="labelInfo">Nationality:</label>
                <br />
                <br />
                <label className="labelInfo">Username:</label>
                <br />
                <br />
                <label className="labelInfo">Password:</label>
                <br />
                <br />
              </div>
              <div className="myInfoInputs">
                <input
                  className="infoInput"
                  type="text"
                  value={firstName || ""}
                  onChange={(ev) => {
                    if (ev.target.value !== "") {
                      setFirstName(ev.target.value);
                    } else {
                      toast.error("Please insert a valid first name!");
                    }
                  }}></input>
                <br />
                <br />
                <input
                  className="infoInput"
                  type="text"
                  value={lastName || ""}
                  onChange={(ev) => {
                    if (ev.target.value !== "") {
                      setLastName(ev.target.value);
                    } else {
                      toast.error("Please insert a valid last name!");
                    }
                  }}></input>
                <br />
                <br />
                <input
                  className="infoInput"
                  type="email"
                  value={email || ""}
                  onChange={(ev) => {
                    if (!emailRegex.test(ev.target.value)) {
                      toast.error("Please insert a valid email address!");
                    } else {
                      setEmail(ev.target.value);
                    }
                  }}></input>
                <br />
                <br />
                <input
                  className="infoInput"
                  type="text"
                  value={dataSet.BIRTHDATE || ""}
                  readOnly></input>
                <br />
                <br />
                <input
                  className="infoInput"
                  type="text"
                  value={dataSet.GENDER || ""}
                  readOnly></input>
                <br />
                <br />
                <input
                  className="infoInput"
                  type="text"
                  value={phoneNumber || ""}
                  onChange={(ev) => {
                    if (ev.target.value !== "") {
                      setPhoneNumber(ev.target.value);
                    } else {
                      toast.error("Please insert a valid phone number!");
                    }
                  }}></input>
                <br />
                <br />
                <input
                  className="infoInput"
                  type="text"
                  value={dataSet.NATIONALITY || ""}
                  readOnly></input>
                <br />
                <br />
                <input
                  className="infoInput"
                  type="text"
                  value={username}
                  readOnly></input>
                <br />
                <br />
                <input
                  className="infoInput"
                  type="password"
                  value={password || ""}
                  onBlur={handlePasswordBlur}
                  onChange={handlePasswordChange}></input>
                <br />
                <br />
                <Button onClick={btnSaveChanges}>Save changes!</Button>
              </div>
            </div>
            <div id="bookingsHistory" className="informationDiv">
              {noOfHistoryBookings === 0 ? (
                <p>You have no finalized bookings!</p>
              ) : (
                Array.from({ length: noOfHistoryBookings }, (_, index) => (
                  <Booking
                    key={index}
                    index={index}
                    departure={departureDetails[index]}
                    return={returnDetails[index]}
                    passengersList={passengersDetails[index]}
                    insuranceList={insuranceDetails[index]}
                  />
                ))
              )}
            </div>
            <div id="upcomingTrips" className="informationDiv">
              {noOfPlannedTrips === 0 ? (
                <p>You have no upcoming trips!</p>
              ) : (
                Array.from({ length: noOfPlannedTrips }, (_, index) => (
                  <Trip
                    key={index}
                    index={index}
                    identificator={Object.keys(bookingsDataSet)[index]}
                    departure={departureTrips[index]}
                    return={returnTrips[index]}
                    passengersList={passengersTrips[index]}
                    insuranceList={insuranceTrips[index]}
                    email={dataSet.EMAIL}
                  />
                ))
              )}
            </div>
          </div>
          <ToastContainer />
        </div>
        <Follow />
      </div>
    );
  }
}

export default MyAccount;
