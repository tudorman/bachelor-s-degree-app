import React, { useState, useEffect } from "react";
import Insurance from "./Insurance";
import Traveler from "./Traveler";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode.react";
import { initializeDatabase } from "../dbConfig";
import { ref, remove } from "firebase/database";
import { ToastContainer, toast } from "react-toastify";

const TOMAirDB = initializeDatabase();

function Trip(props) {
  const [returnDisplay, setReturnDisplay] = useState("block");
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [qrClicked, setQrClicked] = useState(false);

  const [username, setUsername] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/user")
      .then((res) => res.json())
      .then((data) => {
        setUsername(data);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  let tripRef = ref(TOMAirDB, `bookings/`);

  if (username.user !== "") {
    tripRef = ref(TOMAirDB, `bookings/${username.user}/${props.identificator}`);
  }

  useEffect(() => {
    if (props.return === "-") {
      setReturnDisplay("none");
    }
  }, [props.return]);

  const handleQrClosed = async () => {
    setQrClicked(false);
    setQrCodeValue("");
  };

  const generateBtnHandle = () => {
    let ticket = {
      ROUTE: `${props.departure.DEPARTURE} - ${props.departure.ARRIVAL}`,
      DATE: `${props.departure.DEPARTURE_DATE}`,
      PASSENGERS: "",
    };

    if (props.return !== "-") {
      ticket.DATE += `\n${props.return.DEPARTURE_DATE}`;
    }

    let qrCodePassengers = "PASSENGERS:\n";
    for (let i = 0; i < Object.values(props.passengersList).length; i++) {
      qrCodePassengers +=
        Object.keys(props.passengersList)[i].toUpperCase() +
        ": " +
        Object.values(props.passengersList)[i].DOCUMENT +
        ";\n";
    }
    ticket.PASSENGERS = qrCodePassengers;
    console.log(ticket.PASSENGERS);

    const qrCodeValue = `${ticket.ROUTE}\n${ticket.DATE}\n${ticket.PASSENGERS}`;

    setQrCodeValue(qrCodeValue);
    setQrClicked(true);
  };

  const navigate = useNavigate();

  const deleteTripBtn = () => {
    remove(tripRef)
      .then(() => {
        toast.info("Trip deleted successfully...");
      })
      .catch((error) => {
        console.error("Error removing data: " + error);
      });
    setTimeout(() => {
      navigate("/my-account");
    }, 2000);
  };

  return (
    <div className="rootTrip">
      <ToastContainer />
      <h3>Flight details: </h3>
      <div className="labelsAndInputsBooking">
        <div className="labelsBooking">
          <label className="labelInfo">Route: </label>
          <br />
          <label className="labelInfo">Time and date: </label>
          <br />
          <label className="labelInfo">Duration: </label>
          <br />
          <label className="labelInfo">Company: </label>
          <br />
          <label className="labelInfo">Stops: </label>
          <br />
          <br />
          <div style={{ display: returnDisplay }}>
            <label className="labelInfo">Route: </label>
            <br />
            <label className="labelInfo">Time and date: </label>
            <br />
            <label className="labelInfo">Duration: </label>
            <br />
            <label className="labelInfo">Company: </label>
            <br />
            <label className="labelInfo">Stops: </label>
            <br />
          </div>
        </div>
        <div className="inputsBooking">
          <input
            className="infoInput"
            type="text"
            readOnly
            value={`${props.departure.DEPARTURE} - ${props.departure.ARRIVAL}`}></input>
          <br />
          <input
            className="infoInput"
            type="text"
            readOnly
            value={props.departure.DEPARTURE_DATE}></input>
          <br />
          <input
            className="infoInput"
            type="text"
            readOnly
            value={props.departure.DURATION}></input>
          <br />
          <input
            className="infoInput"
            type="text"
            readOnly
            value={props.departure.COMPANY}></input>
          <br />
          <input
            className="infoInput"
            type="text"
            readOnly
            value={props.departure.NUM_OF_STOPS}></input>
          <br /> <br />
          <div style={{ display: returnDisplay }}>
            <input
              className="infoInput"
              type="text"
              readOnly
              value={`${props.return.DEPARTURE} - ${props.return.ARRIVAL}`}></input>
            <br />
            <input
              className="infoInput"
              type="text"
              readOnly
              value={props.return.DEPARTURE_DATE}></input>
            <br />
            <input
              className="infoInput"
              type="text"
              readOnly
              value={props.return.DURATION}></input>
            <br />
            <input
              className="infoInput"
              type="text"
              readOnly
              value={props.return.COMPANY}></input>
            <br />
            <input
              className="infoInput"
              type="text"
              readOnly
              value={props.return.NUM_OF_STOPS}></input>
            <br />
          </div>
        </div>
      </div>
      <hr />
      <div className="bookingTravelers">
        <h3>Travelers:</h3>
        {Array.from(
          { length: Object.values(props.passengersList).length },
          (_, index) => (
            <Traveler
              key={index}
              index={index}
              fullName={Object.keys(props.passengersList)[index]}
              dob={Object.values(props.passengersList)[index].DATE_OF_BIRTH}
              luggage={
                Object.values(props.passengersList)[index].LUGGAGE.luggage
              }
            />
          )
        )}
        <h3>Insurance details:</h3>
        <Insurance insurance={props.insuranceList.INSURANCE} />
      </div>
      <div className="tripBtns">
        <div className="generateTicketDiv">
          <Button onClick={generateBtnHandle}>Generate QR Code</Button>
        </div>
        <div className="deleteTripDiv">
          <Button id="delTripBtn" onClick={deleteTripBtn}>
            Delete trip
          </Button>
        </div>
      </div>
      <br />
      {qrClicked && (
        <div className="QRDiv">
          <QRCode size={256} value={qrCodeValue} level="H" />
          <br />
          <br />
          <Button onClick={handleQrClosed}>Close</Button>
        </div>
      )}
    </div>
  );
}

export default Trip;
