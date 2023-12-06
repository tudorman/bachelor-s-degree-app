import React, { useEffect, useState } from "react";
import Insurance from "./Insurance";
import Traveler from "./Traveler";

function Booking(props) {
  const [returnDisplay, setReturnDisplay] = useState("block");

  useEffect(() => {
    if (props.return === "-") {
      setReturnDisplay("none");
    }
  }, [props.return]);

  return (
    <div className="rootBooking">
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
          <br />
          <div style={{ display: returnDisplay }}>
            <br />
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
        <hr />
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
      <br />
    </div>
  );
}

export default Booking;
