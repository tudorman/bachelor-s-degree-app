import React from "react";
import "./SearchFlight.css";
import { useState } from "react";
import { Button } from "primereact/button";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import airports from "./airports.json";

const SearchForm = () => {
  let departureAirport = "";
  let arrivalAirport = "";
  let departureDate = "";
  let retDate = "";
  let passengers = "";

  const [departureAirportSelected1, setDepartureAirportSelected1] =
    useState("");
  const [departureAirportSelected2, setDepartureAirportSelected2] =
    useState("");
  const [arrivalAirportSelected1, setArrivalAirportSelected1] = useState("");
  const [arrivalAirportSelected2, setArrivalAirportSelected2] = useState("");

  const handleDepartureAirportBlur1 = (ev) => {
    if (ev.target.value === "") {
      toast.warning("Please select a valid airport!");
      return false;
    }
    if (ev.target.value === arrivalAirportSelected1) {
      toast.warning("Departure airport cannot be the same as arrival airport!");
      return false;
    }
  };

  const handleDepartureAirportChange1 = (ev) => {
    if (handleDepartureAirportBlur1) {
      setDepartureAirportSelected1(ev.target.value);
    }
  };

  const handleDepartureAirportBlur2 = (ev) => {
    if (ev.target.value === "") {
      toast.warning("Please select a valid airport!");
      return false;
    }
    if (ev.target.value === arrivalAirportSelected2) {
      toast.warning("Departure airport cannot be the same as arrival airport!");
      return false;
    }
  };

  const handleDepartureAirportChange2 = (ev) => {
    if (handleDepartureAirportBlur2) {
      setDepartureAirportSelected2(ev.target.value);
    }
  };

  const handleReturnAirportBlur1 = (ev) => {
    if (ev.target.value === "") {
      toast.warning("Please select a valid airport!");
      return false;
    }
    if (ev.target.value === departureAirportSelected1) {
      toast.warning("Arrival airport cannot be the same as departure airport!");
      return false;
    }
  };

  const handleReturnAirportChange1 = (ev) => {
    if (handleReturnAirportBlur1) {
      setArrivalAirportSelected1(ev.target.value);
    }
  };

  const handleReturnAirportBlur2 = (ev) => {
    if (ev.target.value === "") {
      toast.warning("Please select a valid airport!");
      return false;
    }
    if (ev.target.value === departureAirportSelected2) {
      toast.warning("Arrival airport cannot be the same as departure airport!");
      return false;
    }
  };

  const handleReturnAirportChange2 = (ev) => {
    if (handleReturnAirportBlur2) {
      setArrivalAirportSelected2(ev.target.value);
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  const [departureDate1, setDepartureDate1] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [departureDate2, setDepartureDate2] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [returnDate, setReturnDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const handleDepartureDateBlur1 = (ev) => {
    if (ev.target.value === "" || ev.target.value < today) {
      toast.warning("Please select a valid departure date!");
      return false;
    }
    return true;
  };

  const handleDepartureDateChange1 = (event) => {
    if (handleDepartureDateBlur1) {
      setDepartureDate1(event.target.value);
    }
  };

  const handleDepartureDateBlur2 = (ev) => {
    if (ev.target.value === "" || ev.target.value < today) {
      toast.warning("Please select a valid departure date!");
      return false;
    }
    return true;
  };

  const handleDepartureDateChange2 = (event) => {
    if (handleDepartureDateBlur2) {
      setDepartureDate2(event.target.value);
    }
  };

  const handleReturnDateBlur = (ev) => {
    if (
      ev.target.value === "" ||
      ev.target.value < today ||
      ev.target.value < departureDate2
    ) {
      toast.warning("Please select a valid return date!");
      return false;
    }
    return true;
  };

  const handleReturnDateChange = (event) => {
    if (handleReturnDateBlur) {
      setReturnDate(event.target.value);
    }
  };

  const [noPassengers1, setNoPassengers1] = useState("");
  const [noPassengers2, setNoPassengers2] = useState("");

  const handleNoPassengersBlur1 = (ev) => {
    if (
      ev.target.value === "" ||
      ev.target.value < 1 ||
      !Number.isInteger(Number(ev.target.value))
    ) {
      toast.warning("Please select a valid number of passengers!");
      return false;
    }
    return true;
  };

  const handleNoPassengersChange1 = (event) => {
    if (handleNoPassengersBlur1) {
      setNoPassengers1(event.target.value);
    }
  };

  const handleNoPassengersBlur2 = (ev) => {
    if (
      ev.target.value === "" ||
      ev.target.value < 1 ||
      !Number.isInteger(Number(ev.target.value))
    ) {
      toast.warning("Please select a valid number of passengers!");
      return false;
    }
    return true;
  };

  const handleNoPassengersChange2 = (event) => {
    if (handleNoPassengersBlur2) {
      setNoPassengers2(event.target.value);
    }
  };

  const navigate = useNavigate();

  const navigateToChooseFlight = () => {
    navigate("/choose-flight");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let isOneWay = document.getElementById("rb_1way").checked;
    if (
      (departureAirportSelected1 === "" || arrivalAirportSelected1 === "") &&
      (departureAirportSelected2 === "" || arrivalAirportSelected2 === "")
    ) {
      toast.error("Please select a valid airport!");
      return;
    }
    if (
      (departureAirportSelected1 === arrivalAirportSelected1 &&
        departureAirportSelected1 !== "" &&
        arrivalAirportSelected1 !== "") ||
      (departureAirportSelected2 === arrivalAirportSelected2 &&
        departureAirportSelected2 !== "" &&
        arrivalAirportSelected2 !== "")
    ) {
      toast.error("Arrival airport cannot be the same as departure airport!");
      return;
    }
    if (!isOneWay) {
      if (
        departureDate2 === "" ||
        returnDate === "" ||
        returnDate < today ||
        departureDate2 < today ||
        returnDate < departureDate2
      ) {
        toast.error("Please select valid departure and return dates!");
        return;
      }
      if (
        noPassengers2 === "" ||
        noPassengers2 <= 0 ||
        !Number.isInteger(Number(noPassengers2))
      ) {
        toast.error("Please insert a valid number of passengers!");
        return;
      }
      departureAirport = departureAirportSelected2;
      arrivalAirport = arrivalAirportSelected2;
      departureDate = departureDate2;
      retDate = returnDate;
      passengers = noPassengers2;
    }
    if (isOneWay) {
      if (departureDate1 === "" || departureDate1 < today) {
        toast.error("Please select a valid departure date!");
        return;
      }
      if (
        noPassengers1 === "" ||
        noPassengers1 <= 0 ||
        !Number.isInteger(Number(noPassengers1))
      ) {
        toast.error("Please insert a valid number of passengers!");
        return;
      }
      departureAirport = departureAirportSelected1;
      arrivalAirport = arrivalAirportSelected1;
      departureDate = departureDate1;
      retDate = "-";
      passengers = noPassengers1;
    }

    let departureDetails = {
      departureAirport: departureAirport,
      arrivalAirport: arrivalAirport,
      departureDate: departureDate,
      retDate: retDate,
      passengers: passengers,
      isOneWay: isOneWay,
    };

    fetch("http://localhost:5000/flight-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(departureDetails),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));

    setDepartureAirportSelected1(false);
    setDepartureAirportSelected2(false);
    setArrivalAirportSelected1(false);
    setArrivalAirportSelected1(false);
    setDepartureDate1("");
    setDepartureDate2("");
    setReturnDate("");
    setNoPassengers1("");
    setNoPassengers2("");
    navigateToChooseFlight();
  };

  const onValueChangeOneWay = () => {
    document.getElementById("inputsOneWay").style.display = "flex";
    document.getElementById("inputsTwoWay").style.display = "none";
  };

  const onValueChangeTwoWay = () => {
    document.getElementById("inputsOneWay").style.display = "none";
    document.getElementById("inputsTwoWay").style.display = "flex";
  };

  return (
    <form className="searchForm">
      <div className="formHeader">Search your flight!</div>
      <div className="radioGroup">
        <input
          id="rb_1way"
          type="radio"
          name="tripType"
          onChange={onValueChangeOneWay}
        />
        <label className="labelRG" htmlFor="rb_1way">
          One-way ticket
        </label>
      </div>
      <div className="radioGroup">
        <input
          id="rb_2way"
          type="radio"
          name="tripType"
          onChange={onValueChangeTwoWay}
        />
        <label className="labelRG" htmlFor="rb_2way">
          Round-trip ticket
        </label>
      </div>
      <div className="inputs" id="inputsTwoWay">
        <label className="labelsFormInputs">Departure place: </label>
        <div>
          <select
            id="airport"
            className="inputSearchAirport"
            value={departureAirportSelected2}
            onBlur={handleDepartureAirportBlur2}
            onChange={handleDepartureAirportChange2}>
            <option value="" disabled>
              Select an airport
            </option>
            {airports.map((airport) => (
              <option key={airport.airportCode} value={airport.airportCode}>
                {airport.airportCode} - {airport.airportName}, {airport.city},
                {airport.country}
              </option>
            ))}
          </select>
        </div>

        <label className="labelsFormInputs">Arrival place: </label>
        <div>
          <select
            id="airport"
            className="inputSearchAirport"
            value={arrivalAirportSelected2}
            onBlur={handleReturnAirportBlur2}
            onChange={handleReturnAirportChange2}>
            <option value="" disabled>
              Select an airport
            </option>
            {airports.map((airport) => (
              <option key={airport.airportCode} value={airport.airportCode}>
                {airport.airportCode} - {airport.airportName}, {airport.city},
                {airport.country}
              </option>
            ))}
          </select>
        </div>

        <label className="labelsFormInputs">Departure date: </label>
        <input
          className="inputSearchDate"
          id="departureDate2"
          type="date"
          value={departureDate2}
          onBlur={handleDepartureDateBlur2}
          onChange={handleDepartureDateChange2}
        />

        <label className="labelsFormInputs">Return date: </label>
        <input
          className="inputSearchDate"
          id="returnDate"
          type="date"
          value={returnDate}
          onBlur={handleReturnDateBlur}
          onChange={handleReturnDateChange}
        />

        <label className="labelsFormInputs">No. of passengers:</label>
        <input
          className="inputSearchNumber"
          id="noPassengers2"
          type="number"
          value={noPassengers2}
          onBlur={handleNoPassengersBlur2}
          onChange={handleNoPassengersChange2}
        />
      </div>
      <div className="inputsOneWay" id="inputsOneWay">
        <label className="labelsFormInputs">Departure place: </label>
        <div>
          <select
            id="airport"
            className="inputSearchAirport"
            value={departureAirportSelected1}
            onBlur={handleDepartureAirportBlur1}
            onChange={handleDepartureAirportChange1}>
            <option value="" disabled>
              Select an airport
            </option>
            {airports.map((airport) => (
              <option key={airport.airportCode} value={airport.airportCode}>
                {airport.airportCode} - {airport.airportName}, {airport.city},
                {airport.country}
              </option>
            ))}
          </select>
        </div>

        <label className="labelsFormInputs">Arrival place: </label>
        <div>
          <select
            id="airport"
            className="inputSearchAirport"
            value={arrivalAirportSelected1}
            onBlur={handleReturnAirportBlur1}
            onChange={handleReturnAirportChange1}>
            <option value="" disabled>
              Select an airport
            </option>
            {airports.map((airport) => (
              <option key={airport.airportCode} value={airport.airportCode}>
                {airport.airportCode} - {airport.airportName}, {airport.city},
                {airport.country}
              </option>
            ))}
          </select>
        </div>

        <label className="labelsFormInputs">Departure date: </label>
        <input
          className="inputSearchDate"
          id="departureDate1"
          type="date"
          value={departureDate1}
          onBlur={handleDepartureDateBlur1}
          onChange={handleDepartureDateChange1}></input>

        <label className="labelsFormInputs">No. of passengers:</label>
        <input
          className="inputSearchNumber"
          id="noPassengers1"
          type="number"
          value={noPassengers1}
          onBlur={handleNoPassengersBlur1}
          onChange={handleNoPassengersChange1}></input>
      </div>
      <div className="searchButton">
        <Button className="btn btn-primary" onClick={handleSearch}>
          Search
        </Button>
      </div>
      <ToastContainer />
    </form>
  );
};

export default SearchForm;
