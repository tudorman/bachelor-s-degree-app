import React, { useState } from "react";
import Follow from "../../utils/Follow";
import NavigationBar from "../../utils/NavigationBar";
import "./SelectInsurance.css";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import travelInsuranceLogo from "../../media/travelInsuranceImage.png";
import medicalInsuranceLogo from "../../media/medicalInsuranceImage.png";
import tripCancellationLogo from "../../media/tripCancellationImage.png";
import baggageLossLogo from "../../media/baggagelossImage.png";
import evacuationLogo from "../../media/evacuationImage.png";
import lifeLogo from "../../media/lifeImage.png";

function SelectInsurance() {
  const [borderStyleTravel, setBorderStyleTravel] = useState("2px solid black");
  const [isClickedTravel, setIsClickedTravel] = useState(false);
  const [borderStyleMedical, setBorderStyleMedical] =
    useState("2px solid black");
  const [isClickedMedical, setIsClickedMedical] = useState(false);
  const [borderStyleTrip, setBorderStyleTrip] = useState("2px solid black");
  const [isClickedTrip, setIsClickedTrip] = useState(false);
  const [borderStyleBaggage, setBorderStyleBaggage] =
    useState("2px solid black");
  const [isClickedBaggage, setIsClickedBaggage] = useState(false);
  const [borderStyleEvacuation, setBorderStyleEvacuation] =
    useState("2px solid black");
  const [isClickedEvacuation, setIsClickedEvacuation] = useState(false);
  const [borderStyleLife, setBorderStyleLife] = useState("2px solid black");
  const [isClickedLife, setIsClickedLife] = useState(false);

  const insuranceInput = document.getElementById("insurancesListInput");
  const [insurancesList, setInsurancesList] = useState([]);
  const [insurancesPrice, setInsurancesPrice] = useState(0);

  const changeColorTravel = () => {
    setIsClickedTravel(!isClickedTravel);
    setBorderStyleTravel(
      isClickedTravel ? "2px solid black" : "3px solid #7CFC00"
    );
    if (!isClickedTravel) {
      setInsurancesList([...insurancesList, " Travel Insurance"]);
      setInsurancesPrice(insurancesPrice + 65);
    } else {
      setInsurancesList(
        insurancesList.filter((insurance) => insurance !== " Travel Insurance")
      );
      setInsurancesPrice(insurancesPrice - 65);
    }
  };

  const changeColorMedical = () => {
    setIsClickedMedical(!isClickedMedical);
    setBorderStyleMedical(
      isClickedMedical ? "2px solid black" : "3px solid #7CFC00"
    );
    if (!isClickedMedical) {
      setInsurancesList([...insurancesList, " Medical Insurance"]);
      setInsurancesPrice(insurancesPrice + 30);
    } else {
      setInsurancesList(
        insurancesList.filter((insurance) => insurance !== " Medical Insurance")
      );
      setInsurancesPrice(insurancesPrice - 30);
    }
  };

  const changeColorTrip = () => {
    setIsClickedTrip(!isClickedTrip);
    setBorderStyleTrip(isClickedTrip ? "2px solid black" : "3px solid #7CFC00");
    if (!isClickedTrip) {
      setInsurancesList([
        ...insurancesList,
        " Trip Cancellation or Interruption Insurance",
      ]);
      setInsurancesPrice(insurancesPrice + 35);
    } else {
      setInsurancesList(
        insurancesList.filter(
          (insurance) =>
            insurance !== " Trip Cancellation or Interruption Insurance"
        )
      );
      setInsurancesPrice(insurancesPrice - 35);
    }
  };

  const changeColorBaggage = () => {
    setIsClickedBaggage(!isClickedBaggage);
    setBorderStyleBaggage(
      isClickedBaggage ? "2px solid black" : "3px solid #7CFC00"
    );
    if (!isClickedBaggage) {
      setInsurancesList([
        ...insurancesList,
        " Baggage or Personal Items Loss Insurance",
      ]);
      setInsurancesPrice(insurancesPrice + 25);
    } else {
      setInsurancesList(
        insurancesList.filter(
          (insurance) =>
            insurance !== " Baggage or Personal Items Loss Insurance"
        )
      );
      setInsurancesPrice(insurancesPrice - 25);
    }
  };

  const changeColorEvacuation = () => {
    setIsClickedEvacuation(!isClickedEvacuation);
    setBorderStyleEvacuation(
      isClickedEvacuation ? "2px solid black" : "3px solid #7CFC00"
    );
    if (!isClickedEvacuation) {
      setInsurancesList([...insurancesList, " Evacuation Insurance"]);
      setInsurancesPrice(insurancesPrice + 30);
    } else {
      setInsurancesList(
        insurancesList.filter(
          (insurance) => insurance !== " Evacuation Insurance"
        )
      );
      setInsurancesPrice(insurancesPrice - 30);
    }
  };

  const changeColorLife = () => {
    setIsClickedLife(!isClickedLife);
    setBorderStyleLife(isClickedLife ? "2px solid black" : "3px solid #7CFC00");
    if (!isClickedLife) {
      setInsurancesList([...insurancesList, " Life Insurance"]);
      setInsurancesPrice(insurancesPrice + 200);
    } else {
      setInsurancesList(
        insurancesList.filter((insurance) => insurance !== " Life Insurance")
      );
      setInsurancesPrice(insurancesPrice - 200);
    }
  };

  const navigate = useNavigate();

  const navigateSelectedToDetails = (e) => {
    e.preventDefault();
    if (insuranceInput.value.trim() === "" || insurancesPrice === 0) {
      toast.warning("Please select at least one type of insurance!");
      return;
    }
    const insurance = {
      list: insurancesList,
      price: insurancesPrice,
    };
    fetch("http://localhost:5000/insurance-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(insurance),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
    navigate("/reservation-details");
  };

  const navigateToDetails = () => {
    const insurance = {
      list: insurancesList,
      price: insurancesPrice,
    };
    fetch("http://localhost:5000/insurance-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(insurance),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
    navigate("/reservation-details");
  };

  return (
    <div className="rootSelectInsurance">
      <NavigationBar />
      <div className="selectInsuranceDiv">
        <h1>
          <i>Select your travel insurance...</i>
        </h1>
      </div>
      <div className="rootInsuranceList">
        <div
          id="travelInsurance"
          className="insuranceType"
          style={{ border: borderStyleTravel }}
          onClick={changeColorTravel}>
          <div className="insuranceImage">
            <img
              src={travelInsuranceLogo}
              width="120px"
              height="120px"
              alt="travel insurance icon"></img>
          </div>
          <div className="insuranceExplanation">
            <h3>Travel Insurance</h3>
          </div>
          <div className="insuranceFee">
            <h1>Additional 65€</h1>
          </div>
        </div>

        <div
          id="medicalInsurance"
          className="insuranceType"
          style={{ border: borderStyleMedical }}
          onClick={changeColorMedical}>
          <div className="insuranceImage">
            <img
              src={medicalInsuranceLogo}
              width="120px"
              height="120px"
              alt="medical insurance icon"></img>
          </div>
          <div className="insuranceExplanation">
            <h3>Medical Insurance</h3>
          </div>
          <div className="insuranceFee">
            <h1>Additional 30€</h1>
          </div>
        </div>

        <div
          id="tripCancellationInsurance"
          className="insuranceType"
          style={{ border: borderStyleTrip }}
          onClick={changeColorTrip}>
          <div className="insuranceImage">
            <img
              src={tripCancellationLogo}
              width="120px"
              height="120px"
              alt="trip cancellation icon"></img>
          </div>
          <div className="insuranceExplanation">
            <h3>Trip Cancellation or Interruption Insurance</h3>
          </div>
          <div className="insuranceFee">
            <h1>Additional 35€</h1>
          </div>
        </div>

        <div
          id="baggageLossInsurance"
          className="insuranceType"
          style={{ border: borderStyleBaggage }}
          onClick={changeColorBaggage}>
          <div className="insuranceImage">
            <img
              src={baggageLossLogo}
              width="120px"
              height="120px"
              alt="baggage loss icon"></img>
          </div>
          <div className="insuranceExplanation">
            <h3>Baggage or Personal Items Loss Insurance</h3>
          </div>
          <div className="insuranceFee">
            <h1>Additional 25€</h1>
          </div>
        </div>

        <div
          id="evacuationInsurance"
          className="insuranceType"
          style={{ border: borderStyleEvacuation }}
          onClick={changeColorEvacuation}>
          <div className="insuranceImage">
            <img
              src={evacuationLogo}
              width="120px"
              height="120px"
              alt="evacuation icon"></img>
          </div>
          <div className="insuranceExplanation">
            <h3>Evacuation Insurance</h3>
          </div>
          <div className="insuranceFee">
            <h1>Additional 30€</h1>
          </div>
        </div>

        <div
          id="lifeInsurance"
          className="insuranceType"
          style={{ border: borderStyleLife }}
          onClick={changeColorLife}>
          <div className="insuranceImage">
            <img
              src={lifeLogo}
              width="120px"
              height="120px"
              alt="life icon"></img>
          </div>
          <div className="insuranceExplanation">
            <h3>Life Insurance</h3>
          </div>
          <div className="insuranceFee">
            <h1>Additional 200€</h1>
          </div>
        </div>
      </div>
      <div className="insurancesChoices">
        <label className="labelInsuranceChoice">Insurances selected: </label>
        <input
          id="insurancesListInput"
          className="inputInsuranceChoice"
          type="text"
          value={insurancesList}
          readOnly></input>
        <label className="labelInsuranceChoice">Insurances price:</label>
        <input
          className="inputInsuranceChoice"
          type="text"
          value={insurancesPrice}
          readOnly></input>
      </div>
      <div className="insuranceOptionDiv">
        <div className="continueWithoutInsuranceDiv">
          <Button onClick={navigateToDetails}>
            Continue without insurance!
          </Button>
        </div>
        <div className="proceedToPayment">
          <Button onClick={navigateSelectedToDetails}>
            Proceed to finalize the reservation!
          </Button>
        </div>
      </div>
      <ToastContainer />
      <Follow />
    </div>
  );
}

export default SelectInsurance;
