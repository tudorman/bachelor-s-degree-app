import React, { useRef, useState, useEffect } from "react";
import NavigationBar from "../../utils/NavigationBar";
import Follow from "../../utils/Follow";
import "./SelectLuggage.css";
import LuggageTypes from "./LuggageTypes";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

function SelectLuggage() {
  const [passengers, setPassengers] = useState(0);
  const [passengersArray, setPassengersArray] = useState([]);

  let passengersDescription = [];

  useEffect(() => {
    fetch("http://localhost:5000/flight-data")
      .then((res) => res.json())
      .then((data) => {
        setPassengers(data.passengers);
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
  }, []);

  if (passengersArray.length !== 0) {
    for (let i = 0; i < passengersArray.length; i++) {
      let passengerDescription = `${passengersArray[i]._title} ${passengersArray[i].last_name} ${passengersArray[i].first_name}`;
      passengersDescription.push(passengerDescription);
    }
  }

  const formRefs = useRef([]);

  const navigate = useNavigate();

  let luggageList = [];

  const navigateToInsurance = (e) => {
    e.preventDefault();
    formRefs.current.forEach((formRef) => {
      luggageList.push(formRef.luggages);
    });
    fetch("http://localhost:5000/luggage-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(luggageList),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
    navigate("/select-insurance");
  };

  return (
    <div className="rootLuggage">
      <NavigationBar />
      <div className="selectLuggageDiv">
        <h1>
          <i>Select the type of your luggage...</i>
        </h1>
      </div>
      {Array.from({ length: passengers }, (_, index) => (
        <LuggageTypes
          key={index}
          passengerFullDescription={passengersDescription[index]}
          ref={(el) => (formRefs.current[index] = el)}
        />
      ))}
      <div className="proceedInsuranceBtn">
        <Button id="toInsuranceBtn" onClick={navigateToInsurance}>
          Proceed to Insurance!
        </Button>
      </div>
      <Follow />
    </div>
  );
}

export default SelectLuggage;
