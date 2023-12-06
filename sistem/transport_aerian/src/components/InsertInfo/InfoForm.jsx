import React, { useState, forwardRef, useImperativeHandle } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CountryList from "../../utils/Countries.json";

const InfoForm = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => {
    return {
      valForm: validateForm,
      passeng: passenger,
    };
  });

  const [inputValue, setInputValue] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [doc, setDoc] = useState("");
  const [expirationDay, setExpirationDay] = useState("");
  const [expirationMonth, setExpirationMonth] = useState("");
  const [expirationYear, setExpirationYear] = useState("");
  const [nationality, setNationality] = useState("");
  const [category, setCategory] = useState("");

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();

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

  const handleBirthYearBlur = (event) => {
    const year = event.target.value.trim();
    if (
      year === "" ||
      year > currentYear ||
      (dobDay > currentDay && dobMonth === currentMonth && year === currentYear)
    ) {
      toast.warning("Please select a valid year!");
      return false;
    }
    return true;
  };

  const handleBirthYearChange = (ev) => {
    if (handleBirthYearBlur) {
      setDobYear(ev.target.value);
    }
  };

  const handleBirthMonthBlur = (ev) => {
    const month = ev.target.value.trim();
    if (month === "" || (month > currentMonth && dobYear >= currentYear)) {
      toast.warning("Please select a valid month!");
      return false;
    }
    return true;
  };

  const handleBirthMonthChange = (ev) => {
    if (handleBirthMonthBlur) {
      setDobMonth(ev.target.value);
    }
  };

  const handleBirthDayBlur = (ev) => {
    const day = ev.target.value.trim();
    if (
      day === "" ||
      (day > currentDay && dobMonth >= currentMonth && dobYear >= currentYear)
    ) {
      toast.warning("Please select a valid day!");
      return false;
    }
    return true;
  };

  const handleBirthDayChange = (ev) => {
    if (handleBirthDayBlur) {
      setDobDay(ev.target.value);
    }
  };

  const handleTitleBlur = (ev) => {
    if (ev.target.value === "") {
      toast.warning("Please select a valid title!");
      return false;
    }
    return true;
  };

  const handleTitleChange = (ev) => {
    if (handleTitleBlur) {
      setTitle(ev.target.value);
    }
  };

  const handleTypeBlur = (ev) => {
    if (ev.target.value === "") {
      toast.warning("Please select a valid type!");
      return false;
    }
    return true;
  };

  const handleTypeChange = (ev) => {
    if (handleTypeBlur) {
      setType(ev.target.value);
    }
  };

  const handleDocumentBlur = (ev) => {
    if (ev.target.value === "" || !/^[A-Z]{2}\d{6,8}$/.test(ev.target.value)) {
      toast.warning("Please enter a valid document!");
      return false;
    }
    return true;
  };

  const handleDocumentChange = (ev) => {
    if (handleDocumentBlur) {
      setDoc(ev.target.value);
    }
  };

  const handleExpirationYearBlur = (ev) => {
    const year = ev.target.value.trim();
    if (year === "" || year < currentYear) {
      toast.warning("Please select a valid year!");
      return false;
    }
    return true;
  };

  const handleExpirationYearChange = (ev) => {
    if (handleExpirationYearBlur) {
      setExpirationYear(ev.target.value);
    }
  };

  const handleExpirationMonthBlur = (ev) => {
    const month = ev.target.value.trim();
    if (
      month === "" ||
      (month < currentMonth && expirationYear === currentYear)
    ) {
      toast.warning("Please select a valid expiration month!");
      return false;
    }
    return true;
  };

  const handleExpirationMonthChange = (ev) => {
    if (handleExpirationYearBlur) {
      setExpirationMonth(ev.target.value);
    }
  };

  const handleExpirationDayBlur = (ev) => {
    const day = ev.target.value.trim();
    if (
      day === "" ||
      (day < currentDay &&
        expirationMonth === currentMonth &&
        expirationYear === currentYear)
    ) {
      toast.warning("Please select a valid expiration day!");
      return false;
    }
    return true;
  };

  const handleExpirationDayChange = (ev) => {
    if (handleExpirationDayBlur) {
      setExpirationDay(ev.target.value);
    }
  };

  const handleNationalityBlur = (ev) => {
    if (ev.target.value === "") {
      toast.warning("Please select a valid country!");
      return false;
    }
    return true;
  };

  const handleNationalityChange = (event) => {
    if (handleNationalityBlur) {
      const country = event.target.value;
      setNationality(country);
      setInputValue("");
    }
  };

  const handleCategoryBlur = (ev) => {
    if (ev.target.value === "") {
      toast.warning("Please select a valid category");
      return false;
    }
    return true;
  };

  const handleCategoryChange = (ev) => {
    if (handleCategoryBlur) {
      setCategory(ev.target.value);
    }
  };

  const validateForm = () => {
    if (lastName === "" || lastName[0] !== lastName[0].toUpperCase()) {
      toast.error("Invalid last name!");
      return false;
    }
    if (firstName === "" || firstName[0] !== firstName[0].toUpperCase()) {
      toast.error("Invalid first name!");
      return false;
    }
    if (
      dobDay === "" ||
      dobMonth === "" ||
      dobYear === "" ||
      (dobDay > currentDay &&
        dobMonth >= currentMonth &&
        dobYear >= currentYear) ||
      (dobMonth >= currentMonth && dobYear >= currentYear) ||
      dobYear > currentYear
    ) {
      toast.error("Invalid date of birth!");
      return false;
    }
    if (title === "") {
      toast.error("Invalid title!");
      return false;
    }
    if (type === "" || doc === "" || !/^[A-Z]{2}\d{6,8}$/.test(doc)) {
      toast.error("Invalid document!");
      return false;
    }
    if (
      expirationDay === "" ||
      expirationMonth === "" ||
      expirationYear === "" ||
      (expirationDay < currentDay &&
        expirationMonth <= currentMonth &&
        expirationYear <= currentYear) ||
      (expirationMonth < currentMonth && expirationYear <= currentYear) ||
      expirationYear < currentYear
    ) {
      toast.error("Invalid expiration date!");
      return false;
    }
    if (nationality === "") {
      toast.error("Invalid nationality!");
      return false;
    }
    if (category === "") {
      toast.error("Invalid category!");
      return false;
    }
    return true;
  };

  const passenger = {
    last_name: lastName,
    first_name: firstName,
    dob: `${dobDay}/${dobMonth}/${dobYear}`,
    _title: title,
    doc_type: type,
    docum: doc,
    document_expiration: `${expirationDay}/${expirationMonth}/${expirationYear}`,
    nation: nationality,
    categ: category,
  };

  const filteredCountries = CountryList.filter((country) =>
    country.country.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="rootInfoForm">
      <h6 id="adultHeader">Passenger:</h6>
      <div className="formLabelDiv">
        <label className="labelFormInfo">Last name:</label>
        <br />
        <label className="labelFormInfo">First name:</label>
        <br />
        <label className="labelFormInfo">Date of birth:</label>
        <br />
        <label className="labelFormInfo">Title:</label>
        <br />
        <label className="labelFormInfo">Type of document:</label>
        <br />
        <label className="labelFormInfo">Series and number of document:</label>
        <br />
        <label className="labelFormInfo">Date of expiration:</label>
        <br />
        <label className="labelFormInfo">Nationality:</label>
        <br />
        <label className="labelFormInfo">Category:</label>
        <br />
        <hr />
      </div>
      <div className="formInputDiv">
        <input
          id="lastNameInput"
          className="inputFieldInfo"
          type="text"
          value={lastName}
          onBlur={handleLastNameBlur}
          onChange={handleLastNameChange}></input>
        <br />
        <input
          id="firstnameInput"
          className="inputFieldInfo"
          type="text"
          value={firstName}
          onBlur={handleFirstNameBlur}
          onChange={handleFirstNameChange}></input>
        <br />

        <select
          id="birthDateDay"
          className="inputFieldInfo"
          value={dobDay}
          onBlur={handleBirthDayBlur}
          onChange={handleBirthDayChange}>
          <option value="" disabled>
            Day
          </option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
          <option value="17">17</option>
          <option value="18">18</option>
          <option value="19">19</option>
          <option value="20">20</option>
          <option value="21">21</option>
          <option value="22">22</option>
          <option value="23">23</option>
          <option value="24">24</option>
          <option value="25">25</option>
          <option value="26">26</option>
          <option value="27">27</option>
          <option value="28">28</option>
          <option value="29">29</option>
          <option value="30">30</option>
          <option value="31">31</option>
        </select>
        <select
          id="birthDateMonth"
          className="inputFieldInfo"
          value={dobMonth}
          onBlur={handleBirthMonthBlur}
          onChange={handleBirthMonthChange}>
          <option value="" disabled>
            Month
          </option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
        <input
          id="birthDateYear"
          className="inputFieldInfo"
          type="number"
          placeholder="Insert year"
          value={dobYear}
          onBlur={handleBirthYearBlur}
          onChange={handleBirthYearChange}></input>
        <br />
        <select
          id="titleSelect"
          className="inputFieldInfo"
          value={title}
          onBlur={handleTitleBlur}
          onChange={handleTitleChange}>
          <option value="" disabled>
            -
          </option>
          <option value="Mr.">Mr.</option>
          <option value="Mrs.">Mrs.</option>
          <option value="Ms.">Ms.</option>
        </select>
        <br />
        <select
          id="documentSelect"
          className="inputFieldInfo"
          value={type}
          onBlur={handleTypeBlur}
          onChange={handleTypeChange}>
          <option value="" disabled>
            -
          </option>
          <option value="Identity card">Identity card</option>
          <option value="Passport">Passport</option>
        </select>
        <br />
        <input
          id="documentInput"
          className="inputFieldInfo"
          type="text"
          value={doc}
          onBlur={handleDocumentBlur}
          onChange={handleDocumentChange}
          pattern="[A-Za-z]{2}[0-9]{6,8}"
          required></input>
        <br />
        <select
          id="expiryDateDay"
          className="inputFieldInfo"
          value={expirationDay}
          onBlur={handleExpirationDayBlur}
          onChange={handleExpirationDayChange}>
          <option value="" disabled>
            Day
          </option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
          <option value="17">17</option>
          <option value="18">18</option>
          <option value="19">19</option>
          <option value="20">20</option>
          <option value="21">21</option>
          <option value="22">22</option>
          <option value="23">23</option>
          <option value="24">24</option>
          <option value="25">25</option>
          <option value="26">26</option>
          <option value="27">27</option>
          <option value="28">28</option>
          <option value="29">29</option>
          <option value="30">30</option>
          <option value="31">31</option>
        </select>
        <select
          id="expiryDateMonth"
          className="inputFieldInfo"
          value={expirationMonth}
          onBlur={handleExpirationMonthBlur}
          onChange={handleExpirationMonthChange}>
          <option value="" disabled>
            Month
          </option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
        <input
          id="expiryDateYear"
          className="inputFieldInfo"
          type="text"
          placeholder="Insert year"
          value={expirationYear}
          onBlur={handleExpirationYearBlur}
          onChange={handleExpirationYearChange}></input>
        <br />
        <select
          id="nationalitySelect"
          className="inputFieldInfo"
          value={nationality}
          onBlur={handleNationalityBlur}
          onChange={handleNationalityChange}>
          <option value="" disabled>
            Nationality
          </option>
          {filteredCountries.map((country) => (
            <option key={country.country} value={country.country}>
              {country.country}
            </option>
          ))}
        </select>
        <br />
        <select
          id="categorySelect"
          className="inputFieldInfo"
          value={category}
          onBlur={handleCategoryBlur}
          onChange={handleCategoryChange}>
          <option value="" disabled>
            Category
          </option>
          <option value="Child">Child (12 years or younger)</option>
          <option value="Teenager">Teenager (between 12 and 18 years)</option>
          <option value="Adult">Adult (above 18 years)</option>
          <option value="Senior">Senior (above 65 years)</option>
        </select>
        <br />
        <ToastContainer />
      </div>
    </div>
  );
});

export default InfoForm;
