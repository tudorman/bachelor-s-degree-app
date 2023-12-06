import React, { useRef, useState, useEffect } from "react";
import Follow from "../../utils/Follow";
import NavigationBar from "../../utils/NavigationBar";
import InfoForm from "./InfoForm";
import "./InsertInfo.css";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const InsertInfo = () => {
  const [passengers, setPassengers] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/flight-data")
      .then((res) => res.json())
      .then((data) => {
        setPassengers(data.passengers);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  const formRefs = useRef([]);

  const navigate = useNavigate();

  let passengersArray = [];

  const navigateToLuggage = (e) => {
    e.preventDefault();
    let isFormValid = true;
    formRefs.current.forEach((formRef) => {
      if (!formRef.valForm()) {
        isFormValid = false;
        passengersArray.length = 0;
        toast.error("Please complete all fields!");
      } else {
        passengersArray.push(formRef.passeng);
      }
    });
    if (isFormValid) {
      fetch("http://localhost:5000/passengers-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passengersArray),
      })
        .then((response) => response.json())
        .catch((error) => console.error(error));
      navigate("/select-luggage");
    }
  };

  return (
    <div className="rootInsertInfo">
      <NavigationBar />
      <div className="insertInfoDiv">
        <h1>
          <i>Please, insert the info for each passenger...</i>
        </h1>
      </div>
      <>
        {Array.from({ length: passengers }, (_, index) => (
          <InfoForm
            key={index}
            index={index}
            ref={(el) => (formRefs.current[index] = el)}
          />
        ))}
      </>
      <div className="btnToSeats">
        <Button id="toSeatsBtn" onClick={navigateToLuggage}>
          Proceed to Selecting your Luggage!
        </Button>
      </div>
      <Follow />
    </div>
  );
};

export default InsertInfo;
