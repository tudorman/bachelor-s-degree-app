function PassengerInfo(props) {
  return (
    <div className="infoBlock">
      <div className="infoLabels">
        <label className="detailsLabel">Passenger:</label>
        <br />
        <label className="detailsLabel">Date of birth: </label>
        <br />
        <label className="detailsLabel">Document series and number:</label>
        <br />
        <label className="detailsLabel">Category:</label>
        <br />
        <label className="detailsLabel">Luggage type:</label>
        <br />
        <hr />
      </div>
      <div className="infoInputsReservation">
        <input
          className="infoInputReservation"
          value={props.fullName}
          type="text"
          readOnly></input>
        <br />
        <input
          className="infoInputReservation"
          value={props.birthDate}
          type="text"
          readOnly></input>
        <br />
        <input
          className="infoInputReservation"
          value={props.document}
          type="text"
          readOnly></input>
        <br />
        <input
          className="infoInputReservation"
          value={props.category}
          type="text"
          readOnly></input>
        <br />
        <input
          value={props.luggage}
          className="infoInputReservation"
          type="text"
          readOnly></input>
        <br />
      </div>
    </div>
  );
}

export default PassengerInfo;
