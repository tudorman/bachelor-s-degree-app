import React, { useEffect, useState } from "react";
import Follow from "../../utils/Follow";
import NavigationBar from "../../utils/NavigationBar";
import { Button } from "primereact/button";
import "./CreateAccount.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CountryCodes from "../../utils/CountryCodes.json";
import Countries from "../../utils/Countries.json";
import logoCompany from "../../media/TOMAir-removebg-preview.png";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";

import { ref, set, child, get } from "firebase/database";
import { initializeDatabase } from "../../dbConfig";

const TOMAirDB = initializeDatabase();
const getData = ref(TOMAirDB);

function CreateAccount() {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [dob, setDob] = useState(new Date().toISOString().slice(0, 10));
  const [countryCodeSelected, setCountryCodeSelected] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countrySelected, setCountrySelected] = useState("");
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    get(child(getData, "bookings/")).then((snapshot) => {
      let data = snapshot.val();
      setUsers(Object.keys(data));
    });
  }, []);

  const handleLastNameBlur = (ev) => {
    const lastName = ev.target.value.trim();
    if (lastName === "") {
      toast.warning("Please enter a valid last name!");
      return false;
    } else if (lastName[0] !== lastName[0].toUpperCase()) {
      toast.warning("Last name must begin with an uppercase letter!");
      return false;
    }
    return true;
  };
  const handleLastNameChange = (ev) => {
    if (handleLastNameBlur) {
      setLastName(ev.target.value);
    }
  };

  const handleFirstNameBlur = (ev) => {
    const firstName = ev.target.value.trim();
    if (firstName === "") {
      toast.warning("Please enter a valid first name!");
      return false;
    } else if (firstName[0] !== firstName[0].toUpperCase()) {
      toast.warning("First name must begin with an uppercase letter!");
      return false;
    }
    return true;
  };
  const handleFirstNameChange = (event) => {
    if (handleFirstNameBlur) {
      setFirstName(event.target.value);
    }
  };

  function checkAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  }

  const handleDobBlur = (event) => {
    const selectedDob = event.target.value;
    if (!checkAge(selectedDob)) {
      toast.warning(
        "Please select a valid date of birth! You must be at least 18 years old!"
      );
      return false;
    }
    return true;
  };

  const handleDobChange = (ev) => {
    if (handleDobBlur) {
      setDob(ev.target.value);
    }
  };

  const handleCountryCodeBlur = (ev) => {
    if (ev.target.value === "") {
      toast.warning("Please select a valid country code!");
      return false;
    }
    return true;
  };

  const handleCountryCodeChange = (ev) => {
    if (handleCountryCodeBlur) {
      setCountryCodeSelected(ev.target.value);
    }
  };

  const handlePhoneNumberBlur = (event) => {
    if (event.target.value.trim() === "" || event.target.value.length < 2) {
      toast.warning("Please enter a valid mobile number!");
      return false;
    }
    return true;
  };

  const handlePhoneNumberChange = (event) => {
    if (handlePhoneNumberBlur) {
      setPhoneNumber(event.target.value);
    }
  };

  const handleUsernameBlur = (ev) => {
    if (ev.target.value === "") {
      toast.warning("Please enter a valid username!");
      return false;
    }
  };

  const handleUsernameChange = (ev) => {
    if (users.includes(ev.target.value)) {
      toast.error("Invalid! Please select another username!");
    }
    if (handleUsernameBlur) {
      setUsername(ev.target.value);
    }
  };

  const handleEmailBlur = (event) => {
    const email = event.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.warning("Please enter a valid email!");
      return false;
    }
    return true;
  };

  const handleEmailChange = (event) => {
    if (handleEmailBlur) {
      setEmail(event.target.value);
    }
  };

  const handlePasswordBlur = (event) => {
    const password = event.target.value;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.warning(
        "Invalid password format! Password should contain at least one upper case character, one number and one symbol. It also must be at least 8 characters long!"
      );
      return false;
    }
    return true;
  };

  const handleConfirmPasswordBlur = (event) => {
    const confirmPassword = event.target.value;
    if (confirmPassword !== password) {
      toast.warning("Passwords do not match!");
      return false;
    }
    return true;
  };

  const handlePasswordChange = (event) => {
    if (handlePasswordBlur) {
      setPassword(event.target.value);
    }
  };

  const handleConfirmPasswordChange = (event) => {
    if (handleConfirmPasswordBlur) {
      setConfirmPassword(event.target.value);
    }
  };

  const handleNationalityBlur = (ev) => {
    if (ev.target.value === "") {
      toast.warning("Please select a valid country!");
      return false;
    }
    return true;
  };

  const handleNationalityChange = (ev) => {
    if (handleNationalityBlur) {
      setCountrySelected(ev.target.value);
    }
  };

  const onCreateSuccess = (e) => {
    e.preventDefault();
    const genderRadios = document.getElementsByName("gender");
    const privacyNoticeCheck = document.getElementById("privacyNoticeCheck");
    const termsAndConditionsCheck = document.getElementById(
      "termsAndConditionsCheck"
    );

    if (!checkAge(dob)) {
      toast.error("You must be at least 18 years old to complete the form!");
    }

    if (
      lastName === "" ||
      firstName === "" ||
      !checkAge(dob) ||
      (!genderRadios[0].checked && !genderRadios[1].checked) ||
      countryCodeSelected === "" ||
      phoneNumber === "" ||
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword !== password ||
      countrySelected === ""
    ) {
      toast.error("Please complete all the fields!");
      return;
    }

    if (users.includes(username)) {
      toast.error("Invalid! Please select another username!");
      return;
    }

    if (!privacyNoticeCheck.checked || !termsAndConditionsCheck.checked) {
      toast.error("Please accept the Privacy Notice and Terms and Conditions.");
      return;
    }

    let selectedRB;
    for (const radioButton of genderRadios) {
      if (radioButton.checked) {
        selectedRB = radioButton.value;
        break;
      }
    }

    let countryCodePhone = "";

    CountryCodes.forEach((country) => {
      if (country.code === countryCodeSelected) {
        countryCodePhone = country.countryPhone;
      }
    });

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

    if (/^admin.*/.test(username)) {
      const reference = ref(TOMAirDB, "admins/" + username);
      set(reference, {
        PASSWORD: encryptedPassword,
      });
    } else {
      const reference = ref(TOMAirDB, "users/" + username);
      set(reference, {
        LAST_NAME: lastName,
        FIRST_NAME: firstName,
        BIRTHDATE: dob,
        GENDER: selectedRB,
        PHONE: `+(${countryCodePhone}) ${phoneNumber}`,
        EMAIL: email,
        PASSWORD: encryptedPassword,
        NATIONALITY: countrySelected,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }

    toast.success("Account created!");
    setLastName("");
    setFirstName("");
    setDob(new Date().toISOString().slice(0, 10));
    genderRadios.forEach((radio) => (radio.checked = false));
    setCountryCodeSelected("");
    setPhoneNumber("");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setCountrySelected("");
    privacyNoticeCheck.checked = false;
    termsAndConditionsCheck.checked = false;
  };

  return (
    <div className="rootCreateAccount">
      <NavigationBar />
      <div className="entireFormCreate">
        <div className="logoHeader">
          <img
            src={logoCompany}
            height="200px"
            width="200px"
            alt="company logo"></img>
        </div>
        <h1 id="welcomeHeaderCreate">Welcome to TOMAir!</h1>
        <h3 id="registerHeader">Register below...</h3>

        <div className="formCreate">
          <div className="divisionDiv">
            <div className="leftDiv">
              <label className="labelFormCreate">Last name:</label>
            </div>
            <div className="rightDiv">
              <input
                className="inputClassCreate"
                type="text"
                value={lastName}
                onBlur={handleLastNameBlur}
                onChange={handleLastNameChange}></input>
            </div>
          </div>

          <div className="divisionDiv">
            <div className="leftDiv">
              <label className="labelFormCreate">First name: </label>
            </div>
            <div className="rightDiv">
              <input
                className="inputClassCreate"
                type="text"
                value={firstName}
                onBlur={handleFirstNameBlur}
                onChange={handleFirstNameChange}></input>
            </div>
          </div>

          <div className="divisionDiv">
            <div className="leftDiv">
              <label className="labelFormCreate">Date of birth:</label>
            </div>
            <div className="rightDiv">
              <input
                className="inputClassDateNumber"
                type="date"
                value={dob}
                onBlur={handleDobBlur}
                onChange={handleDobChange}></input>
            </div>
          </div>

          <div className="divisionDiv">
            <div className="leftDiv">
              <label className="labelFormCreate">Gender:</label>
            </div>
            <div className="rightDiv">
              <input type="radio" id="male" name="gender" value="MALE" />
              <label className="radioLabel" htmlFor="male">
                MALE
              </label>
              <input type="radio" id="female" name="gender" value="FEMALE" />
              <label className="radioLabel" htmlFor="female">
                FEMALE
              </label>
            </div>
          </div>
          <div className="divisionDiv">
            <div className="leftDiv">
              <label className="labelFormCreate">Country code:</label>
            </div>
            <div className="rightDiv">
              <div>
                <select
                  className="inputClassCreate"
                  value={countryCodeSelected}
                  onBlur={handleCountryCodeBlur}
                  onChange={handleCountryCodeChange}>
                  <option value="" disabled>
                    Select a country
                  </option>
                  {CountryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {`${country.countryName}, ${country.code}, (+${country.countryPhone})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="divisionDiv">
            <div className="leftDiv">
              <label className="labelFormCreate">Mobile phone number:</label>
            </div>
            <div className="rightDiv">
              <input
                className="inputClassDateNumber"
                type="number"
                value={phoneNumber}
                onBlur={handlePhoneNumberBlur}
                onChange={handlePhoneNumberChange}></input>
            </div>
          </div>

          <div className="divisionDiv">
            <div className="leftDiv">
              <label className="labelFormCreate">Username:</label>
            </div>
            <div className="rightDiv">
              <input
                className="inputClassCreate"
                type="email"
                value={username}
                onBlur={handleUsernameBlur}
                onChange={handleUsernameChange}></input>
            </div>
          </div>

          <div className="divisionDiv">
            <div className="leftDiv">
              <label className="labelFormCreate">E-mail:</label>
            </div>
            <div className="rightDiv">
              <input
                className="inputClassCreate"
                type="email"
                value={email}
                onBlur={handleEmailBlur}
                onChange={handleEmailChange}></input>
            </div>
          </div>

          <div className="divisionDiv">
            <div className="leftDiv">
              <label className="labelFormCreate">Password:</label>
            </div>
            <div className="rightDiv">
              <input
                className="inputClassCreate"
                type="password"
                value={password}
                onBlur={handlePasswordBlur}
                onChange={handlePasswordChange}></input>
            </div>
          </div>

          <div className="divisionDiv">
            <div className="leftDiv">
              <label className="labelFormCreate">Confirm password:</label>
            </div>
            <div className="rightDiv">
              <input
                className="inputClassCreate"
                type="password"
                value={confirmPassword}
                onBlur={handleConfirmPasswordBlur}
                onChange={handleConfirmPasswordChange}></input>
            </div>
          </div>

          <div className="divisionDiv">
            <div className="leftDiv">
              <label className="labelFormCreate">Nationality:</label>
            </div>
            <div className="rightDiv">
              <div>
                <select
                  className="inputClassCreate"
                  value={countrySelected}
                  onBlur={handleNationalityBlur}
                  onChange={handleNationalityChange}>
                  <option value="" disabled>
                    Select a country
                  </option>
                  {Countries.map((country) => (
                    <option key={country.country} value={country.country}>
                      {country.country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="checkDiv">
            <input type="checkbox" id="subscribeCheck" />
            <label className="labelFormCreate">
              I subscribe to special offers newsletter according to the{" "}
              <a href="https://securiti.ai/what-is-privacy-notice/">
                Privacy Notice
              </a>
            </label>
          </div>

          <div className="checkDiv">
            <input type="checkbox" id="privacyNoticeCheck" />
            <label className="labelFormCreate">
              I accept the{" "}
              <a href="https://securiti.ai/what-is-privacy-notice/">
                Privacy Notice
              </a>
            </label>
          </div>

          <div className="checkDiv">
            <input type="checkbox" id="termsAndConditionsCheck" />
            <label className="labelFormCreate">
              I have read and agree to the{" "}
              <a href="https://www.iubenda.com/en/help/2859-terms-and-conditions-when-are-they-needed">
                TOMAir Account Terms and Conditions
              </a>
            </label>
          </div>
        </div>
        <div className="btnRegister">
          <Button id="btnRegister" onClick={onCreateSuccess}>
            REGISTER!
          </Button>
          <ToastContainer />
        </div>
        <p id="goToLoginParag">
          You already have an account?&nbsp;
          <a href="/#/login">Sign in!</a>
        </p>
      </div>
      <Follow />
    </div>
  );
}
export default CreateAccount;
