import React from "react";

function Traveler(props) {
  return (
    <div className="rootTraveler">
      <div className="labelsAndInputsBooking">
        <div className="labelsBooking">
          <label className="labelInfo">Full name: </label>
          <br />
          <label className="labelInfo">Date of birth: </label>
          <br />
          <label className="labelInfo">Luggage: </label>
          <br />
        </div>
        <div className="inputsBooking">
          <input
            className="infoInput"
            type="text"
            readOnly
            value={props.fullName}></input>
          <br />
          <input
            className="infoInput"
            type="text"
            readOnly
            value={props.dob}></input>
          <br />
          <input
            className="infoInput"
            type="text"
            readOnly
            value={props.luggage}></input>
          <br />
        </div>
      </div>
      <hr />
    </div>
  );
}

export default Traveler;
