import React from "react";
import "./SearchFlight.css";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import NavigationBar from "../../utils/NavigationBar";
import Follow from "../../utils/Follow";
import SearchForm from "./SearchForm";
import RomeImage from "../../media/Rome.jpg";
import ParisImage from "../../media/Paris.jpg";
import LondonImage from "../../media/London.jpg";
import BarcelonaImage from "../../media/Barcelona.jpg";
import { useEffect } from "react";

function SearchFlight() {
  const reservationCompleted = {
    isCompleted: false,
  };
  const flightData = {
    departureAirport: "",
    arrivalAirport: "",
    departureDate: "",
    retDate: "",
    passengers: "",
    isOneWay: false,
  };
  const departureData = {
    departure_id: "",
    departure_company: "",
    departure_departure_place: "",
    departure_arrival_place: "",
    departure_departure_time: "",
    departure_arrival_time: "",
    departure_duration: "",
    departure_price_per_person: 0,
    departure_num_of_stops: "",
  };
  const returnData = {
    return_flight_no: "-",
    return_company: "-",
    return_departure_place: "-",
    return_arrival_place: "-",
    return_departure_time: "-",
    return_arrival_time: "-",
    return_duration: "-",
    return_price: 0,
    return_num_stops: "-",
  };
  const passengersArray = [];
  const luggageArray = [];
  const insuranceArray = [];
  const prices = {
    departure_price: 0,
    return_price: 0,
    luggage_price: 0,
    insurance_price: 0,
    total_price: 0,
  };

  useEffect(() => {
    fetch("http://localhost:5000/flight-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(flightData),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
    fetch("http://localhost:5000/departure-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(departureData),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
    fetch("http://localhost:5000/return-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(returnData),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
    fetch("http://localhost:5000/passengers-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passengersArray),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
    fetch("http://localhost:5000/luggage-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(luggageArray),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
    fetch("http://localhost:5000/insurance-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(insuranceArray),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
    fetch("http://localhost:5000/prices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prices),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));

    fetch("http://localhost:5000/reservation-completed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservationCompleted),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
  });

  return (
    <div className="mainBody">
      <NavigationBar />
      <SearchForm />
      <div className="discoverPlaces">
        <p>Discover new places...</p>
        <div className="pictures">
          <div className="left">
            <div className="picture">
              <img
                src={RomeImage}
                width="250px"
                height="250px"
                alt="Rome"
                title="Check the best flights to Rome!"></img>
            </div>
            <div className="description">
              <p>
                <i>Rome</i>
              </p>
              <p>
                Rome is a fabulous mix of history, archeology, art, religion and
                religious culture and delicious food; and it certainly is the
                most popular place to visit in Italy. Truth is, Rome is a city
                that hardly leaves you indifferent. It's the kind of place you
                either love or hate – and most inevitably love it.
              </p>
              <a href="https://en.wikipedia.org/wiki/Rome">
                Learn more about Rome!
              </a>
            </div>
          </div>
          <div className="right">
            <div className="picture">
              <img
                src={ParisImage}
                width="250px"
                height="250px"
                alt="Paris"
                title="Check the best flights to Paris!"></img>
            </div>
            <div className="description">
              <p>
                <i>Paris</i>
              </p>
              <p>
                With a abundance of landmarks, museums and cathedrals to visit,
                from the iconic Eiffel Tower, to the gothic Notre Dame to the
                Louvre and gardens galore, few places do landmarks quite so well
                as the city of love.
              </p>
              <a href="https://en.wikipedia.org/wiki/Paris">
                Learn more about Paris!
              </a>
            </div>
          </div>
        </div>
        <div className="pictures">
          <div className="left">
            <div className="picture">
              <img
                src={LondonImage}
                width="250px"
                height="250px"
                alt="London"
                title="Check the best flights to London!"></img>
            </div>
            <div className="description">
              <p>
                <i>London</i>
              </p>
              <p>
                Big Ben, the Tower of London, Buckingham Palace, the London Eye,
                the list goes on and on. There's nothing quite like the
                experience of hopping on a red double-decker bus and seeing some
                of the most recognisable sights in the world from its top deck.
              </p>
              <a href="https://en.wikipedia.org/wiki/London">
                Learn more about London!
              </a>
            </div>
          </div>
          <div className="right">
            <div className="picture">
              <img
                src={BarcelonaImage}
                width="250px"
                height="250px"
                alt="Barcelona"
                title="Check the best flights to Barcelona!"></img>
            </div>
            <div className="description">
              <p>
                <i>Barcelona</i>
              </p>
              <p>
                Barcelona is one of the most incredible cities in the world.
                From the Gothic maze that is the historic old town, to Gaudi's
                famous architecture and some of the best food you'll ever eat,
                there are so many reasons to visit Barcelona that it's hard to
                know where to start!
              </p>
              <a href="https://en.wikipedia.org/wiki/Barcelona">
                Learn more about Barcelona!
              </a>
            </div>
          </div>
        </div>
      </div>
      <Follow />
    </div>
  );
}

export default SearchFlight;
