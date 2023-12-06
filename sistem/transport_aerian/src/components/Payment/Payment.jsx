import React, { useEffect, useState } from "react";
import Stripe from "stripe";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "primereact/button";
import "./Payment.css";
import { useNavigate } from "react-router-dom";
import { ref, set } from "firebase/database";
import { initializeDatabase } from "../../dbConfig";

const TOMAirDB = initializeDatabase();

const PaymentForm = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState([]);
  const [flightDetails, setFlightDetails] = useState([]);
  const [departureDetails, setDepartureDetails] = useState([]);
  const [returnDetails, setReturnDetails] = useState([]);
  const [passengersArray, setPassengersArray] = useState([]);
  const [luggageArray, setLuggageArray] = useState([]);
  const [insuranceArray, setInsuranceArray] = useState([]);
  const [prices, setPrices] = useState([]);

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
    fetch("http://localhost:5000/prices")
      .then((res) => res.json())
      .then((data) => {
        setPrices(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const [cardNumber, setCardNumber] = useState("");
  const [expirationMonth, setExpirationMonth] = useState("");
  const [expirationYear, setExpirationYear] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [cvv, setCvv] = useState("");

  const date = new Date();
  const currentMonth = Number(date.getMonth() + 1);
  const currentYear = Number(date.getFullYear());

  const navigateHome = () => {
    navigate("/");
  };

  const currentDate = new Date().toString();
  const dateRef =
    currentDate.split(":")[0] + " " + currentDate.split(":")[1].split(":")[0];
  const usernameDate = "/bookings/" + user.user + "/" + dateRef;

  const departureReference = ref(TOMAirDB, usernameDate + "/departure/");
  const returnReference = ref(TOMAirDB, usernameDate + "/return/");
  const insuranceReference = ref(TOMAirDB, usernameDate + "/insurance/");
  const priceReference = ref(TOMAirDB, usernameDate + "/price/");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const termsAndConditionsCheck = document.getElementById(
      "termsAndConditionsCheckPay"
    );

    if (
      cardNumber === "" ||
      cardNumber.length !== 16 ||
      expirationMonth === "" ||
      expirationYear === "" ||
      cardHolderName === "" ||
      cardHolderName !== cardHolderName.toUpperCase() ||
      cvv === "" ||
      cvv.length !== 3
    ) {
      toast.error("Please complete all the fields!");
      return;
    }
    if (!termsAndConditionsCheck.checked) {
      toast.error("Please accept the Terms and Conditions!");
      return;
    }
    const stripe = Stripe("sk_test_v0rQRqenSs7uso5uewLvjI7b00A9HmbCmN");

    const { error } = await stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month: expirationMonth,
        exp_year: expirationYear,
        cvc: cvv,
      },
    });

    if (error) {
      toast.error("Incorrect card details!");
    }
    set(departureReference, {
      DEPARTURE:
        departureDetails.departure_departure_place +
        "(" +
        flightDetails.departureAirport +
        ")",
      ARRIVAL:
        departureDetails.departure_arrival_place +
        "(" +
        flightDetails.arrivalAirport +
        ")",
      DEPARTURE_DATE: departureDetails.departure_departure_time,
      ARRIVAL_DATE: departureDetails.departure_arrival_time,
      DURATION: departureDetails.departure_duration,
      COMPANY: departureDetails.departure_company,
      NUM_OF_STOPS: departureDetails.departure_num_of_stops,
    });

    if (flightDetails.isOneWay === false) {
      set(returnReference, {
        DEPARTURE:
          returnDetails.return_departure_place +
          "(" +
          flightDetails.arrivalAirport +
          ")",
        ARRIVAL:
          returnDetails.return_arrival_place +
          "(" +
          flightDetails.departureAirport +
          ")",
        DEPARTURE_DATE: returnDetails.return_departure_time,
        ARRIVAL_DATE: returnDetails.return_arrival_time,
        DURATION: returnDetails.return_duration,
        COMPANY: returnDetails.return_company,
        NUM_OF_STOPS: returnDetails.return_num_of_stops,
      });
    }

    for (let i = 0; i < flightDetails.passengers; i++) {
      let passenger = passengersArray[i];
      let passengerDescription = `${passenger.last_name} ${passenger.first_name}`;
      const passengersReference = ref(
        TOMAirDB,
        usernameDate + "/passengers/" + passengerDescription
      );
      set(passengersReference, {
        DATE_OF_BIRTH: passenger.dob,
        DOCUMENT: `${passenger.doc_type}: ${passenger.docum}`,
        CATEGORY: passenger.categ,
        LUGGAGE: luggageArray[i],
      });
    }

    set(insuranceReference, {
      INSURANCE: insuranceArray.list,
    });

    set(priceReference, {
      DEPARTURE_PRICE: prices.departure_price,
      RETURN_PRICE: prices.return_price,
      LUGGAGES_PRICE: prices.luggage_price,
      INSURANCE_PRICE: prices.insurance_price,
      TOTAL_PRICE: prices.total_price,
    });

    toast.success("Order finalized!");
    setCardNumber("");
    setExpirationMonth("");
    setExpirationYear("");
    setCardHolderName("");
    setCvv("");
    termsAndConditionsCheck.checked = false;
    setTimeout(navigateHome, 5000);
  };

  const handleCardNumberBlur = (event) => {
    if (event.target.value === "" || event.target.value.length !== 16) {
      toast.warning("Please enter a valid card number!");
      return false;
    }
    return true;
  };

  const handleCardNumberChange = (event) => {
    if (handleCardNumberBlur) {
      setCardNumber(event.target.value);
    }
  };

  const handleExpirationMonthBlur = (event) => {
    if (event.target.value === "") {
      toast.warning("Please select the expiration month!");
      return false;
    }
    if (expirationYear === currentYear && event.target.value < currentMonth) {
      toast.warning("Please select a valid expiration date!");
    }
    return true;
  };

  const handleExpirationMonthChange = (event) => {
    if (handleExpirationMonthBlur) {
      setExpirationMonth(event.target.value);
    }
  };

  const handleExpirationYearBlur = (event) => {
    if (event.target.value === "") {
      toast.warning("Please select the expiration year!");
      return false;
    }
    if (expirationYear === currentYear && event.target.value < currentMonth) {
      toast.warning("Please select a valid expiration date!");
    }
    return true;
  };

  const handleExpirationYearChange = (event) => {
    if (handleExpirationYearBlur) {
      setExpirationYear(event.target.value);
    }
  };

  const handleCardHolderNameBlur = (event) => {
    const cardHolderNameRegex = /^[A-Z\s]+$/;
    if (!cardHolderNameRegex.test(event.target.value.trim())) {
      toast.warning("Card holder name must be in upper case letters only!");
      return false;
    }
    return true;
  };

  const handleCardHolderNameChange = (event) => {
    if (handleCardHolderNameBlur) {
      setCardHolderName(event.target.value);
    }
  };

  const handleCvvBlur = (event) => {
    const cvvRegex = /^\d{3}$/;
    if (!cvvRegex.test(event.target.value.trim())) {
      toast.warning("CVV/CVC must contain exactly 3 digits!");
      return false;
    }
    return true;
  };

  const handleCvvChange = (event) => {
    if (handleCvvBlur) {
      setCvv(event.target.value);
    }
  };

  return (
    <div className="rootPayment">
      <div className="payNowDiv">
        <h1>
          <i>Pay to confirm your reservation...</i>
        </h1>
      </div>

      <div className="divCardContents">
        <div className="divCardLabel">
          <h1>Card number</h1>
        </div>
        <div className="divCardInput">
          <input
            className="inputCard"
            type="text"
            placeholder="XXXXXXXXXXXXXXXX(16 characters)"
            onBlur={handleCardNumberBlur}
            onChange={handleCardNumberChange}
          />
        </div>

        <div className="divCardLabel">
          <h1>Expiration date</h1>
        </div>
        <div className="expiryDateDiv">
          <div className="expiryMonthDiv">
            <select
              className="selectCard"
              onBlur={handleExpirationMonthBlur}
              onChange={handleExpirationMonthChange}>
              <option value="">Select the month...</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          <div className="expiryYearDiv">
            <select
              className="selectCard"
              onBlur={handleExpirationYearBlur}
              onChange={handleExpirationYearChange}>
              <option value="">Select the year...</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
              <option value="2029">2029</option>
              <option value="2030">2030</option>
              <option value="2031">2031</option>
              <option value="2032">2032</option>
            </select>
          </div>
        </div>

        <div className="divCardLabel">
          <h1>Card holder name</h1>
        </div>
        <div className="divCardInput">
          <input
            className="inputCard"
            type="text"
            onBlur={handleCardHolderNameBlur}
            onChange={handleCardHolderNameChange}
          />
        </div>

        <div className="divCardLabel">
          <h1>CVV/CVC</h1>
        </div>
        <div className="divCardInput">
          <input
            className="inputCard"
            type="number"
            onBlur={handleCvvBlur}
            onChange={handleCvvChange}
          />
        </div>
        <br />
        <div className="termsAndConditionsDiv">
          <input id="termsAndConditionsCheckPay" type="checkbox" />
          <label className="payLabel">I agree to Terms & Conditions</label>
          <br />
        </div>
        <Button id="payBtn" onClick={handleSubmit}>
          PAY NOW!
        </Button>
        <ToastContainer />
      </div>
    </div>
  );
};
export default PaymentForm;
