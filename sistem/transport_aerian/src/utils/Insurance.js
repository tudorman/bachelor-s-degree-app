import React from "react";

function Insurance(props) {
  return (
    <div className="rootInsurance">
      <div className="labelsAndInputsBooking">
        <div className="labelsBooking">
          <label className="labelInfo">Insurance items: </label>
          <br />
        </div>
        <div className="inputsBooking">
          <input
            className="infoInput"
            type="text"
            readOnly
            value={props.insurance}></input>
          <br />
        </div>
      </div>
      <hr />
    </div>
  );
}

export default Insurance;
