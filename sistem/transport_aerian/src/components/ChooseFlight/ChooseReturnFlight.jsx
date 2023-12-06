import React, { useState, useEffect } from "react";
import Follow from "../../utils/Follow";
import NavigationBar from "../../utils/NavigationBar";
import { Button } from "primereact/button";
import "./ChooseFlight.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChooseFlight = () => {
  const navigate = useNavigate();

  const [flightsData, setFlightsData] = useState(null);
  const [flights, setFlights] = useState([]);

  const [flightData, setFlightData] = useState({
    departureAirport: "",
    arrivalAirport: "",
    retDate: "",
    passengers: "",
    isOneWay: "",
  });

  const [companies, setCompanies] = useState([]);
  console.log(flightsData);

  useEffect(() => {
    fetch("http://localhost:5000/flight-data")
      .then((res) => res.json())
      .then((data) => {
        setFlightData(data);
        toast.info("Please wait until we're fetching the flights data...");

        const options = {
          method: "GET",
          url: "https://skyscanner50.p.rapidapi.com/api/v1/searchFlights",
          params: {
            origin: `${data.arrivalAirport}`,
            destination: `${data.departureAirport}`,
            date: `${data.retDate}`,
          },
          headers: {
            "X-RapidAPI-Key":
              "475099ae31msh35e973e17595bb7p14243cjsn8494d50c69b7",
            "X-RapidAPI-Host": "skyscanner50.p.rapidapi.com",
          },
        };

        axios
          .request(options)
          .then((response) => {
            const flightsData = response.data;
            setFlightsData(flightsData);

            const fetchedFlights = [];
            const fetchedCompanies = [];
            if (flightsData.length === 0) {
              toast.warning(
                "No flights available for the selected dates. Please, search for another flight!"
              );
            }
            for (let i = 0; i < flightsData.data.length; i++) {
              let flight = {
                flight_no: flightsData.data[i].id,
                company: flightsData.data[i].legs[0].carriers[0].name,
                departure_place: flightsData.data[i].legs[0].origin.name,
                arrival_place: flightsData.data[i].legs[0].destination.name,
                departure_time:
                  flightsData.data[i].legs[0].departure.split("T")[0] +
                  " " +
                  flightsData.data[i].legs[0].departure.split("T")[1],
                arrival_time:
                  flightsData.data[i].legs[0].arrival.split("T")[0] +
                  " " +
                  flightsData.data[i].legs[0].arrival.split("T")[1],
                duration: transformDuration(
                  flightsData.data[i].legs[0].duration
                ),
                price_per_person: flightsData.data[i].price.amount,
                num_of_stops: flightsData.data[i].legs[0].stop_count,
              };
              fetchedFlights.push(flight);
              if (!fetchedCompanies.includes(flight.company)) {
                fetchedCompanies.push(flight.company);
              }
            }
            setFlights(fetchedFlights);
            setCompanies(fetchedCompanies);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((err) => console.error(err));
  }, []);

  const [checkboxes, setCheckboxes] = useState({
    direct: false,
    oneStop: false,
    twoOrMoreStops: false,
    departureTime00_08: false,
    departureTime08_12: false,
    departureTime12_18: false,
    departureTime18_00: false,
    arrivalTime00_08: false,
    arrivalTime08_12: false,
    arrivalTime12_18: false,
    arrivalTime18_00: false,
  });

  const [selectedCompanies, setSelectedCompanies] = useState([]);

  const handleCompanyCheckboxChange = (e, company) => {
    if (e.target.checked) {
      setSelectedCompanies([...selectedCompanies, company]);
    } else {
      setSelectedCompanies(
        selectedCompanies.filter(
          (selectedCompany) => selectedCompany !== company
        )
      );
    }
  };

  const [recommendedSort, setRecommendedSort] = useState(false);
  const [cheapestSort, setCheapestSort] = useState(false);
  const [fastestSort, setFastestSort] = useState(false);

  const transformDuration = (duration) => {
    return Math.floor(duration / 60) + "h " + (duration % 60) + "min";
  };

  function getDurationInMinutes(duration) {
    if (!duration) {
      throw new Error("Duration parameter is undefined.");
    }
    const hours = duration.split("h")[0];
    const minutes = duration.split(" ")[1].split("m")[0];
    return hours * 60 + Number(minutes);
  }

  const sortFlights = (flights) => {
    if (cheapestSort) {
      flights.sort((a, b) => a.price_per_person - b.price_per_person);
    } else if (fastestSort) {
      flights.sort((a, b) => {
        const aDuration = getDurationInMinutes(a.duration);
        const bDuration = getDurationInMinutes(b.duration);
        return aDuration - bDuration;
      });
    } else if (recommendedSort) {
      flights.sort((a, b) => {
        const aPrice = a.price_per_person;
        const bPrice = b.price_per_person;
        if (aPrice === bPrice) {
          const aDuration = getDurationInMinutes(a.duration);
          const bDuration = getDurationInMinutes(b.duration);
          return aDuration - bDuration;
        }
        return aPrice - bPrice;
      });
    }
    return flights;
  };

  const filteredFlights = flights.filter((flight) => {
    const meetsStopsFilter =
      (!checkboxes.direct || flight.num_of_stops === 0) &&
      (!checkboxes.oneStop || flight.num_of_stops === 1) &&
      (!checkboxes.twoOrMoreStops || flight.num_of_stops > 1);

    const departureTime = Number(
      flight.departure_time.split(" ")[1].split(":")[0]
    );
    const meetsDepartureTimeFilter =
      (!checkboxes.departureTime00_08 || departureTime < 8) &&
      (!checkboxes.departureTime08_12 ||
        (departureTime >= 8 && departureTime < 12)) &&
      (!checkboxes.departureTime12_18 ||
        (departureTime >= 12 && departureTime < 18)) &&
      (!checkboxes.departureTime18_00 || departureTime >= 18);

    const arrivalTime = Number(flight.arrival_time.split(" ")[1].split(":")[0]);
    const meetsArrivalTimeFilter =
      (!checkboxes.arrivalTime00_08 || arrivalTime < 8) &&
      (!checkboxes.arrivalTime08_12 ||
        (arrivalTime >= 8 && arrivalTime < 12)) &&
      (!checkboxes.arrivalTime12_18 ||
        (arrivalTime >= 12 && arrivalTime < 18)) &&
      (!checkboxes.arrivalTime18_00 || arrivalTime >= 18);

    const meetsCompanyFilter =
      selectedCompanies.length === 0 ||
      selectedCompanies.includes(flight.company);

    return (
      meetsStopsFilter &&
      meetsDepartureTimeFilter &&
      meetsArrivalTimeFilter &&
      meetsCompanyFilter
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const flightsPerPage = 10;

  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;

  const currentFlights = sortFlights(
    filteredFlights.slice(indexOfFirstFlight, indexOfLastFlight)
  );

  const totalPages = Math.ceil(filteredFlights.length / flightsPerPage);
  const currentPageStart = (currentPage - 1) * flightsPerPage + 1;
  const currentPageEnd =
    currentPage === totalPages
      ? filteredFlights.length
      : currentPage * flightsPerPage;

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="rootChoose">
      <NavigationBar />
      <div className="detailsHeader">
        <h1 id="detailHeader">
          <i>Select your return flight...</i>
        </h1>
        <div className="searchInputs">
          <label>Departure: </label>
          <input
            className="searchInput"
            type="text"
            value={flightData.arrivalAirport}
            readOnly></input>
          <label>Arrival: </label>
          <input
            className="searchInput"
            type="text"
            value={flightData.departureAirport}
            readOnly></input>
          <label>Date: </label>
          <input
            className="searchInput"
            type="text"
            value={flightData.retDate}
            readOnly></input>
          <label>Passengers: </label>
          <input
            id="noPassengers"
            className="searchInput"
            type="text"
            value={flightData.passengers}
            readOnly></input>
        </div>
      </div>

      <div className="workingArea">
        <div className="leftWorkingArea">
          <div className="filtersDiv">
            <h2>Filters</h2>
            <h4>{filteredFlights.length} results</h4>
            <hr />
            <p className="filterParagraph">Stops</p>
            <input
              type="checkbox"
              id="direct"
              checked={checkboxes.direct}
              onChange={(e) =>
                setCheckboxes({
                  ...checkboxes,
                  direct: e.target.checked,
                })
              }
            />
            <label className="filterLabel" htmlFor="direct">
              Direct
            </label>
            <br />
            <input
              type="checkbox"
              id="oneStop"
              checked={checkboxes.oneStop}
              onChange={(e) =>
                setCheckboxes({
                  ...checkboxes,
                  oneStop: e.target.checked,
                })
              }
            />
            <label className="filterLabel" htmlFor="oneStop">
              1 stop
            </label>
            <br />
            <input
              type="checkbox"
              id="twoOrMoreStops"
              checked={checkboxes.twoOrMoreStops}
              onChange={(e) =>
                setCheckboxes({
                  ...checkboxes,
                  twoOrMoreStops: e.target.checked,
                })
              }
            />
            <label className="filterLabel" htmlFor="twoOrMoreStops">
              2 or more stops
            </label>
            <br />
            <hr />
            <p className="filterParagraph">Departure time</p>
            <input
              type="checkbox"
              id="departureTime00_08"
              checked={checkboxes.departureTime00_08}
              onChange={(e) =>
                setCheckboxes({
                  ...checkboxes,
                  departureTime00_08: e.target.checked,
                })
              }
            />
            <label className="filterLabel" htmlFor="departureTime00_08">
              00:00-08:00
            </label>
            <br />
            <input
              type="checkbox"
              id="departureTime08_12"
              checked={checkboxes.departureTime08_12}
              onChange={(e) =>
                setCheckboxes({
                  ...checkboxes,
                  departureTime08_12: e.target.checked,
                })
              }
            />
            <label className="filterLabel" htmlFor="departureTime08_12">
              08:00-12:00
            </label>
            <br />
            <input
              type="checkbox"
              id="departureTime12_18"
              checked={checkboxes.departureTime12_18}
              onChange={(e) =>
                setCheckboxes({
                  ...checkboxes,
                  departureTime12_18: e.target.checked,
                })
              }
            />
            <label className="filterLabel" htmlFor="departureTime12_18">
              12:00-18:00
            </label>
            <br />
            <input
              type="checkbox"
              id="departureTime18_00"
              checked={checkboxes.departureTime18_00}
              onChange={(e) =>
                setCheckboxes({
                  ...checkboxes,
                  departureTime18_00: e.target.checked,
                })
              }
            />
            <label className="filterLabel" htmlFor="departureTime18_00">
              18:00-00:00
            </label>
            <br />
            <hr />
            <p className="filterParagraph">Arrival time</p>
            <input
              type="checkbox"
              id="arrivalTime00_08"
              checked={checkboxes.arrivalTime00_08}
              onChange={(e) =>
                setCheckboxes({
                  ...checkboxes,
                  arrivalTime00_08: e.target.checked,
                })
              }
            />
            <label className="filterLabel" htmlFor="arrivalTime00_08">
              00:00-08:00
            </label>
            <br />
            <input
              type="checkbox"
              id="arrivalTime08_12"
              checked={checkboxes.arrivalTime08_12}
              onChange={(e) =>
                setCheckboxes({
                  ...checkboxes,
                  arrivalTime08_12: e.target.checked,
                })
              }
            />
            <label className="filterLabel" htmlFor="arrivalTime08_12">
              08:00-12:00
            </label>
            <br />
            <input
              type="checkbox"
              id="arrivalTime12_18"
              checked={checkboxes.arrivalTime12_18}
              onChange={(e) =>
                setCheckboxes({
                  ...checkboxes,
                  arrivalTime12_18: e.target.checked,
                })
              }
            />
            <label className="filterLabel" htmlFor="arrivalTime12_18">
              12:00-18:00
            </label>
            <br />
            <input
              type="checkbox"
              id="arrivalTime18_00"
              checked={checkboxes.arrivalTime18_00}
              onChange={(e) =>
                setCheckboxes({
                  ...checkboxes,
                  arrivalTime18_00: e.target.checked,
                })
              }
            />
            <label className="filterLabel" htmlFor="arrivalTime18_00">
              18:00-00:00
            </label>
            <br />
            <hr />
            <p>AIRLINE COMPANIES</p>
            <div>
              {companies.map((company) => (
                <React.Fragment key={company}>
                  <input
                    type="checkbox"
                    id={company}
                    checked={selectedCompanies.includes(company)}
                    onChange={(e) => handleCompanyCheckboxChange(e, company)}
                  />
                  <label className="filterLabel" htmlFor={company}>
                    {company}
                  </label>
                  <br />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="rightWorkingArea">
          <div className="sortButtons">
            <p>Sort flights by:</p>
            <Button
              id="recommendedBtn"
              onClick={() => {
                setRecommendedSort(true);
                setCheapestSort(false);
                setFastestSort(false);
              }}>
              Recommended
            </Button>
            <Button
              id="cheapestBtn"
              onClick={() => {
                setRecommendedSort(false);
                setCheapestSort(true);
                setFastestSort(false);
              }}>
              Cheapest
            </Button>
            <Button
              id="fastestBtn"
              onClick={() => {
                setRecommendedSort(false);
                setCheapestSort(false);
                setFastestSort(true);
              }}>
              Fastest
            </Button>
          </div>
          <div className="selectFlightDiv">
            <div className="rootFlightList">
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Route</th>
                    <th>Departure time</th>
                    <th>Arrival time</th>
                    <th>Duration</th>
                    <th>Price/person</th>
                    <th>Number of stops</th>
                    <th>Select flight</th>
                  </tr>
                </thead>
                <tbody>
                  {currentFlights.map((flight) => (
                    <tr key={flight.flight_no}>
                      <td>{flight.company}</td>
                      <td>{`${flight.departure_place} - ${flight.arrival_place}`}</td>
                      <td>{flight.departure_time}</td>
                      <td>{flight.arrival_time}</td>
                      <td>{flight.duration}</td>
                      <td>{`€${flight.price_per_person}`}</td>
                      <td>{flight.num_of_stops}</td>
                      <td>
                        <Button
                          onClick={() => {
                            let return_flight = {
                              return_id: flight.flight_no,
                              return_company: flight.company,
                              return_departure_place: flight.departure_place,
                              return_arrival_place: flight.arrival_place,
                              return_departure_time: flight.departure_time,
                              return_arrival_time: flight.arrival_time,
                              return_duration: flight.duration,
                              return_price: flight.price_per_person,
                              return_num_of_stops: flight.num_of_stops,
                            };

                            fetch("http://localhost:5000/return-data", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(return_flight),
                            })
                              .then((response) => response.json())
                              .catch((error) => console.error(error));

                            navigate("/insert-info");
                          }}>
                          Select
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="8">
                      Page {currentPage}: {currentPageStart}-{currentPageEnd} of{" "}
                      {filteredFlights.length} results
                    </td>
                  </tr>
                </tfoot>
              </table>
              <div>
                <Button
                  className="choosePageBtn"
                  onClick={handlePrevClick}
                  disabled={currentPage === 1}>
                  Prev
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <Button
                      className="choosePageBtn"
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      disabled={currentPage === pageNum}>
                      {pageNum}
                    </Button>
                  )
                )}
                <Button
                  className="choosePageBtn"
                  onClick={handleNextClick}
                  disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <Follow />
    </div>
  );
};

export default ChooseFlight;
