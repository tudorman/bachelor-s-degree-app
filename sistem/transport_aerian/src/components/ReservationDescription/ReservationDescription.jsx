import NavigationBar from "../../utils/NavigationBar";
import Follow from "../../utils/Follow";
import "./ReservationDescription.css";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import PassengerInfo from "./PassengerInfo";
import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ReservationDescription() {
  const navigate = useNavigate();

  const [returnDisplay, setReturnDisplay] = useState("flex");

  const [user, setUser] = useState([]);
  const [flightDetails, setFlightDetails] = useState([]);
  const [departureDetails, setDepartureDetails] = useState([]);
  const [returnDetails, setReturnDetails] = useState([]);
  const [passengersArray, setPassengersArray] = useState([]);
  const [luggageArray, setLuggageArray] = useState([]);
  const [insuranceArray, setInsuranceArray] = useState([]);

  const returnPriceRef = useRef(0);
  const returnTotalPriceRef = useRef(0);

  let passenger = "";
  let passengersFullName = [];
  let passengersDobs = [];
  let passengersDocuments = [];
  let passengersCategory = [];
  let passengersLuggage = [];
  let passengersLuggagePrice = [];

  useEffect(() => {
    fetch("http://localhost:5000/user")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error(error);
      });
    fetch("http://localhost:5000/flight-data")
      .then((res) => res.json())
      .then((data) => {
        setFlightDetails(data);
      })
      .catch((error) => {
        console.error(error);
      });
    fetch("http://localhost:5000/departure-data")
      .then((res) => res.json())
      .then((data) => {
        setDepartureDetails(data);
      })
      .catch((error) => {
        console.error(error);
      });
    fetch("http://localhost:5000/return-data")
      .then((res) => res.json())
      .then((data) => {
        setReturnDetails(data);
      })
      .catch((error) => {
        console.error(error);
      });
    fetch("http://localhost:5000/passengers-list")
      .then((res) => res.json())
      .then((data) => {
        setPassengersArray(data);
      })
      .catch((error) => {
        console.error(error);
      });
    fetch("http://localhost:5000/luggage-list")
      .then((res) => res.json())
      .then((data) => {
        setLuggageArray(data);
      })
      .catch((error) => {
        console.error(error);
      });
    fetch("http://localhost:5000/insurance-list")
      .then((res) => res.json())
      .then((data) => {
        setInsuranceArray(data);
      })
      .catch((error) => {
        console.error(error);
      });

    if (flightDetails.isOneWay === true) {
      setReturnDisplay("none");
      returnPriceRef.current = 0;
      returnTotalPriceRef.current = 0;
    }
    if (flightDetails.isOneWay === false) {
      setReturnDisplay("flex");
    }
  }, [flightDetails.isOneWay]);

  const departure_total_price =
    departureDetails.departure_price_per_person * flightDetails.passengers;
  let return_total_price =
    returnDetails.return_price * flightDetails.passengers;

  let mediumLuggagePrice = 0;
  let bigLuggagePrice = 0;

  const flight_price = departure_total_price + return_total_price;
  const total_price =
    flight_price +
    mediumLuggagePrice +
    bigLuggagePrice +
    Number(insuranceArray.price);

  let hasProcessedPassengers = false;

  if (
    !hasProcessedPassengers &&
    flightDetails.length !== 0 &&
    departureDetails.length !== 0 &&
    returnDetails.length !== 0 &&
    passengersArray.length !== 0 &&
    luggageArray.length !== 0 &&
    insuranceArray.length !== 0
  ) {
    for (let i = 0; i < flightDetails.passengers; i++) {
      passenger = passengersArray[i];
      let passengerDescription = `${passenger._title} ${passenger.last_name} ${passenger.first_name}`;
      passengersFullName.push(passengerDescription);
      passengersDobs.push(passenger.dob);
      let passDocument = `${passenger.doc_type}: ${passenger.docum}`;
      passengersDocuments.push(passDocument);
      passengersCategory.push(passenger.categ);

      let luggage = luggageArray[i];
      passengersLuggage.push(luggage.luggage);
      passengersLuggagePrice.push(luggage.price);

      if (luggage.luggage.includes(" Medium luggage")) {
        mediumLuggagePrice += 40;
      }
      if (luggage.luggage.includes(" Big luggage")) {
        bigLuggagePrice += 80;
      }
    }
    hasProcessedPassengers = true;
  }

  const navigateToPayment = async () => {
    let luggage_total_price = mediumLuggagePrice + bigLuggagePrice;
    const reservationCompleted = {
      isCompleted: true,
    };
    fetch("http://localhost:5000/reservation-completed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservationCompleted),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
    if (
      user.isConnected === true &&
      user.user !== "" &&
      user.user !== "My account"
    ) {
      toast.info("We're almost there...");
      setTimeout(() => {
        navigate("/payment");
      }, 2000);
    } else {
      const prices = {
        departure_price: departure_total_price,
        return_price: return_total_price,
        luggage_price: luggage_total_price,
        insurance_price: insuranceArray.price,
        total_price: total_price,
      };
      fetch("http://localhost:5000/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prices),
      })
        .then((response) => response.json())
        .catch((error) => console.error(error));

      toast.warning("Please sign in before proceeding to payment!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <div className="rootReservationDescription">
      <NavigationBar />
      <div className="reservationDetailsDiv">
        <h1>
          <i>Your reservation details...</i>
        </h1>
      </div>
      <div className="reservationDetailsArea">
        <div className="reservationLeftArea">
          <div className="reservationHeader">
            <h3>Details</h3>
          </div>
          <div className="properDetails">
            <h5>Flight info</h5>
            <div className="infoBlock">
              <div className="infoLabels">
                <label className="detailsLabel">Departure route:</label>
                <br />
                <label className="detailsLabel">Departure date and time:</label>
                <br />
                <label className="detailsLabel">Arrival date and time:</label>
                <br />
                <label className="detailsLabel">Duration:</label>
                <br />
                <label className="detailsLabel">Company:</label>
                <br />
                <label className="detailsLabel">No. of stops:</label>
                <br />
                <label className="detailsLabel">Price per person:</label>
                <br />
                <hr />
              </div>
              <div className="infoInputsReservation">
                <input
                  value={`${departureDetails.departure_departure_place} (${flightDetails.departureAirport}) - ${departureDetails.departure_arrival_place} (${flightDetails.arrivalAirport})`}
                  className="infoInputReservation"
                  type="text"
                  readOnly></input>
                <br />
                <input
                  value={`${departureDetails.departure_departure_time}`}
                  className="infoInputReservation"
                  type="text"
                  readOnly></input>
                <br />
                <input
                  value={`${departureDetails.departure_arrival_time}`}
                  className="infoInputReservation"
                  type="text"
                  readOnly></input>
                <br />
                <input
                  value={`${departureDetails.departure_duration}`}
                  className="infoInputReservation"
                  type="text"
                  readOnly></input>
                <br />
                <input
                  value={`${departureDetails.departure_company}`}
                  className="infoInputReservation"
                  type="text"
                  readOnly></input>
                <br />
                <input
                  value={`${departureDetails.departure_num_of_stops}`}
                  className="infoInputReservation"
                  type="text"
                  readOnly></input>
                <br />
                <input
                  value={`${departureDetails.departure_price_per_person}`}
                  className="infoInputReservation"
                  type="text"
                  readOnly></input>
                <br />
              </div>
            </div>
            <div className="infoBlock" style={{ display: returnDisplay }}>
              <div className="infoLabels">
                <label className="detailsLabel">Return route:</label>
                <br />
                <label className="detailsLabel">Departure date and time:</label>
                <br />
                <label className="detailsLabel">Arrival date and time: </label>
                <br />
                <label className="detailsLabel">Duration:</label>
                <br />
                <label className="detailsLabel">Company:</label>
                <br />
                <label className="detailsLabel">No. of stops:</label>
                <br />
                <label className="detailsLabel">Price per person:</label>
                <br />
                <hr />
              </div>
              <div className="infoInputsReservation">
                <input
                  id="returnInput"
                  value={`${returnDetails.return_departure_place} (${flightDetails.arrivalAirport}) - ${returnDetails.return_arrival_place} (${flightDetails.departureAirport})`}
                  className="infoInputReservation"
                  type="text"
                  readOnly></input>
                <br />
                <input
                  value={`${returnDetails.return_departure_time}`}
                  className="infoInputReservation"
                  type="text"
                  readOnly></input>
                <br />
                <input
                  value={`${returnDetails.return_arrival_time}`}
                  className="infoInputReservation"
                  type="text"
                  readOnly></input>
                <br />
                <input
                  value={`${returnDetails.return_duration}`}
                  className="infoInputReservation"
                  type="text"
                  readOnly></input>
                <br />
                <input
                  value={`${returnDetails.return_company}`}
                  className="infoInputReservation"
                  type="text"
                  readOnly></input>
                <br />
                <input
                  value={`${returnDetails.return_num_of_stops}`}
                  className="infoInputReservation"
                  type="text"
                  readOnly></input>
                <br />
                <input
                  value={`${returnDetails.return_price}`}
                  className="infoInputReservation"
                  type="text"
                  readOnly></input>
                <br />
              </div>
            </div>
            <h5>Passengers info</h5>
            {Array.from({ length: flightDetails.passengers }, (_, index) => (
              <PassengerInfo
                key={index}
                index={index}
                fullName={passengersFullName[index]}
                birthDate={passengersDobs[index]}
                document={passengersDocuments[index]}
                category={passengersCategory[index]}
                luggage={passengersLuggage[index]}
                price={passengersLuggagePrice[index]}
              />
            ))}
            <h5>Insurance info</h5>
            <div className="infoBlock">
              <div className="infoLabels">
                <label className="detailsLabel">Insurance:</label>
                <br />
                <label className="detailsLabel">Insurance total price: </label>
                <br />
                <hr />
              </div>
              <div className="infoInputsReservation">
                <input
                  value={`${insuranceArray.list}`}
                  className="infoInputReservation"
                  type="text"
                  readOnly></input>
                <br />
                <input
                  value={`${insuranceArray.price}`}
                  className="infoInputReservation"
                  type="text"
                  readOnly></input>
                <br />
              </div>
            </div>
          </div>
        </div>
        <div className="reservationRightArea">
          <div className="reservationHeader">
            <h3>Services prices</h3>
          </div>
          <div className="flightTicketPrices">
            <h5>Flight tickets prices</h5>
            <div className="pricesInfo">
              <div className="pricesLabels">
                <label className="detailsLabel">
                  Departure ticket total price:
                </label>
                <br />
                <label className="detailsLabel">
                  Return ticket total price:
                </label>
                <br />
                <label className="detailsLabel">Total tickets price: </label>
                <br />
                <hr />
              </div>
              <div className="pricesInputs">
                <input
                  value={`${departure_total_price}`}
                  className="pricesInfoReservation"
                  type="text"
                  readOnly></input>
                <br />
                <input
                  value={`${return_total_price}`}
                  className="pricesInfoReservation"
                  type="text"
                  readOnly></input>
                <br />
                <input
                  value={`${Number(flight_price).toFixed(2)}`}
                  className="pricesInfoReservation"
                  type="text"
                  readOnly></input>
                <br />
              </div>
            </div>
            <h5>Luggage prices</h5>
            <div className="pricesInfo">
              <div className="pricesLabels">
                <label className="detailsLabel">Small luggages:</label>
                <br />
                <label className="detailsLabel">Medium luggages:</label>
                <br />
                <label className="detailsLabel">Big luggages:</label>
                <br />
                <hr />
              </div>
              <div className="pricesInputs">
                <input
                  value={"0"}
                  className="pricesInfoReservation"
                  type="text"
                  readOnly></input>
                <br />
                <input
                  className="pricesInfoReservation"
                  value={`${mediumLuggagePrice}`}
                  type="text"
                  readOnly></input>
                <br />
                <input
                  className="pricesInfoReservation"
                  value={`${bigLuggagePrice}`}
                  type="text"
                  readOnly></input>
                <br />
              </div>
            </div>
            <h5>Insurance price</h5>
            <div className="pricesInfo">
              <div className="pricesLabels">
                <label className="detailsLabel">Total insurance price:</label>
                <br />
                <hr />
              </div>
              <div className="pricesInputs">
                <input
                  value={`${insuranceArray.price}`}
                  className="pricesInfoReservation"
                  type="text"
                  readOnly></input>
                <br />
              </div>
            </div>
            <h3>Total reservation price</h3>
            <input
              value={`${total_price.toFixed(2)}`}
              className="totalPriceInput"
              type="text"
              readOnly></input>{" "}
            €
            <br />
          </div>
          <hr />
          <div className="btnToPayment">
            <Button onClick={navigateToPayment}>Proceed to payment!</Button>
          </div>
        </div>
        <ToastContainer />
      </div>
      <Follow />
    </div>
  );
}

export default ReservationDescription;
