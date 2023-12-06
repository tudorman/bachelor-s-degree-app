const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.listen(5000, () => {
  console.log("Server started on port 5000");
});

let flightData = {
  departureAirport: "",
  arrivalAirport: "",
  departureDate: "",
  retDate: "",
  passengers: "",
  isOneWay: false,
};

app.post("/flight-data", (req, res) => {
  const data = req.body;
  flightData = data;
  res.json(data);
});

app.get("/flight-data", (req, res) => {
  res.json(flightData);
});

let departureData = {
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

app.post("/departure-data", (req, res) => {
  const data = req.body;
  departureData = data;
  res.json(data);
});

app.get("/departure-data", (req, res) => {
  res.json(departureData);
});

let returnData = {
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

app.post("/return-data", (req, res) => {
  const data = req.body;
  returnData = data;
  res.json(data);
});

app.get("/return-data", (req, res) => {
  res.json(returnData);
});

let passengersArray = [];

app.post("/passengers-list", (req, res) => {
  const data = req.body;
  passengersArray = data;
  res.json(data);
});

app.get("/passengers-list", (req, res) => {
  res.json(passengersArray);
});

let luggageArray = [];

app.post("/luggage-list", (req, res) => {
  const data = req.body;
  luggageArray = data;
  res.json(data);
});

app.get("/luggage-list", (req, res) => {
  res.json(luggageArray);
});

let insuranceArray = [];

app.post("/insurance-list", (req, res) => {
  const data = req.body;
  insuranceArray = data;
  res.json(data);
});

app.get("/insurance-list", (req, res) => {
  res.json(insuranceArray);
});

let user = { user: " ", isConnected: false };

app.post("/user", (req, res) => {
  const data = req.body;
  user = data;
  res.json(data);
});

app.get("/user", (req, res) => {
  res.json(user);
});

let reservationCompleted = {
  isCompleted: false,
};

app.post("/reservation-completed", (req, res) => {
  const data = req.body;
  reservationCompleted = data;
  res.json(data);
});

app.get("/reservation-completed", (req, res) => {
  res.json(reservationCompleted);
});

let prices = {
  departure_price: 0,
  return_price: 0,
  luggage_price: 0,
  insurance_price: 0,
  total_price: 0,
};

app.post("/prices", (req, res) => {
  const data = req.body;
  prices = data;
  res.json(data);
});

app.get("/prices", (req, res) => {
  res.json(prices);
});
