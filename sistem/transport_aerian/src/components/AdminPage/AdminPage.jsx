import "./AdminPage.css";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { useState } from "react";
import { ref, set, child, get } from "firebase/database";
import { initializeDatabase } from "../../dbConfig";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const TOMAirDB = initializeDatabase();
const getData = ref(TOMAirDB);

function AdminPage() {
  const [mainUser, setMainUser] = useState({ user: "", isConnected: false });
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/user")
      .then((res) => res.json())
      .then((data) => {
        setMainUser(data);
      })
      .catch((err) => console.error(err));
    toast.info("Hello, " + username);
  }, [username]);

  useEffect(() => {
    setUsername(mainUser.user);
  }, [mainUser.user]);

  const [locationsDataSet, setLocationsDataSet] = useState([]);
  const [departmentsDataSet, setDepartmentsDataSet] = useState([]);
  const [employeesDataSet] = useState([]);
  const [accountsDataSet, setAccountsDataSet] = useState([]);
  const [bookingsDataSet, setBookingsDataSet] = useState([]);

  const [employeesDBShow, setEmployeesDBShow] = useState(false);
  const [departmentsDBShow, setDepartmentsDBShow] = useState(false);
  const [locationsDBShow, setLocationsDBShow] = useState(false);
  const [accountsDBShow, setAccountsDBShow] = useState(false);
  const [bookingsDBShow, setBookingsDBShow] = useState(false);
  const [plotShow, setPlotShow] = useState(false);

  const locationsKeys = Object.keys(locationsDataSet);
  const locationsData = Object.values(locationsDataSet);
  let locationHighestKey = locationsKeys[locationsKeys.length - 1];

  const [locationAddress, setLocationAddress] = useState("");
  const [locationZipCode, setLocationZipCode] = useState("");
  const [locationCity, setLocationCity] = useState("");
  const [locationCountry, setLocationCountry] = useState("");

  const departmentsKeys = Object.keys(departmentsDataSet);
  const departmentsData = Object.values(departmentsDataSet);
  let departmentHighestKey = departmentsKeys[departmentsKeys.length - 1];

  const [departmentAddress, setDepartmentAddress] = useState("");
  const [departmentManager, setDepartmentManager] = useState("");
  const [departmentName, setDepartmentName] = useState("");

  const employeesKeys = Object.keys(employeesDataSet);
  let employeesHighestKey = employeesKeys[employeesKeys.length - 1];

  const [employeeLastName, setEmployeeLastName] = useState("");
  const [employeeFirstName, setEmployeeFirstName] = useState("");
  const [employeeEmploymentDate, setEmployeeEmploymentDate] = useState("");
  const [employeeSalary, setEmployeeSalary] = useState("");
  const [employeePhoneNumber, setEmployeePhoneNumber] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeDepartment, setEmployeeDepartment] = useState("");
  const [employeeFunction, setEmployeeFuntion] = useState("");

  const [employeesDisplay, setEmployeesDisplay] = useState("none");
  const [departmentsDisplay, setDepartmentsDisplay] = useState("none");
  const [locationsDisplay, setLocationsDisplay] = useState("none");

  const [selectedPlot, setSelectedPlot] = useState("");

  const users = Object.keys(accountsDataSet);
  let childrenNum = 0;
  let teenagersNum = 0;
  let adultsNum = 0;
  let seniorsNum = 0;

  let yearlyIncomeDataSet = {
    2022: 0,
    2023: 0,
    2024: 0,
    2025: 0,
    2026: 0,
  };

  const [selectedYear, setSelectedYear] = useState("");

  let monthlyIncomeDataSet = {
    "01": 0,
    "02": 0,
    "03": 0,
    "04": 0,
    "05": 0,
    "06": 0,
    "07": 0,
    "08": 0,
    "09": 0,
    10: 0,
    11: 0,
    12: 0,
  };

  useEffect(() => {
    get(child(getData, "locations/")).then((snapshot) => {
      let data = snapshot.val();
      setLocationsDataSet(data);
    });
  }, []);

  useEffect(() => {
    get(child(getData, "departments/")).then((snapshot) => {
      let data = snapshot.val();
      setDepartmentsDataSet(data);
    });
  }, []);

  useEffect(() => {
    get(child(getData, "users/")).then((snapshot) => {
      let data = snapshot.val();
      setAccountsDataSet(data);
    });
  }, []);

  useEffect(() => {
    get(child(getData, "bookings/")).then((snapshot) => {
      let data = snapshot.val();
      setBookingsDataSet(data);
    });
  }, []);

  for (let user of users) {
    if (bookingsDataSet[`${user}`]) {
      let booking = Object.values(bookingsDataSet[`${user}`]);
      for (let i = 0; i < booking.length; i++) {
        for (let j = 0; j < Object.values(booking[i].passengers).length; j++) {
          let category = Object.values(booking[i].passengers)[j].CATEGORY;
          switch (category) {
            case "Child":
              childrenNum++;
              break;
            case "Teenager":
              teenagersNum++;
              break;
            case "Adult":
              adultsNum++;
              break;
            case "Senior":
              seniorsNum++;
              break;
            default:
              break;
          }
        }
        var bookingYear = booking[i].departure.DEPARTURE_DATE.split("-")[0];
        if (Object.keys(yearlyIncomeDataSet).includes(bookingYear)) {
          yearlyIncomeDataSet[`${bookingYear}`] += Number(
            booking[i].price.TOTAL_PRICE
          );
        }
        if (
          booking[i].departure.DEPARTURE_DATE.split("-")[0] === selectedYear
        ) {
          var bookingMonth = booking[i].departure.DEPARTURE_DATE.split("-")[1];
          if (Object.keys(monthlyIncomeDataSet).includes(bookingMonth)) {
            monthlyIncomeDataSet[`${bookingMonth}`] += Number(
              booking[i].price.TOTAL_PRICE
            );
          }
        }
      }
    }
  }

  const employeesClicksHandler = () => {
    if (employeesDisplay === "none") {
      document.getElementById("employeesInputs").style.display = "block";
      document.getElementById("btnAddEmployees").innerHTML = "Hide form!";
      setEmployeesDisplay("block");
    } else {
      document.getElementById("employeesInputs").style.display = "none";
      document.getElementById("btnAddEmployees").innerHTML = "Add employee+";
      setEmployeesDisplay("none");
    }
  };

  const departmentsClicksHandler = () => {
    if (departmentsDisplay === "none") {
      document.getElementById("departmentsInputs").style.display = "block";
      document.getElementById("btnAddDepartment").innerHTML = "Hide form!";
      setDepartmentsDisplay("block");
    } else {
      document.getElementById("departmentsInputs").style.display = "none";
      document.getElementById("btnAddDepartment").innerHTML = "Add department+";
      setDepartmentsDisplay("none");
    }
  };

  const locationsClicksHandler = () => {
    if (locationsDisplay === "none") {
      document.getElementById("locationsInputs").style.display = "block";
      document.getElementById("btnAddLocation").innerHTML = "Hide form!";
      setLocationsDisplay("block");
    } else {
      document.getElementById("locationsInputs").style.display = "none";
      document.getElementById("btnAddLocation").innerHTML = "Add location+";
      setLocationsDisplay("none");
    }
  };

  const handleLocationAddressChange = (ev) => {
    setLocationAddress(ev.target.value);
  };

  const handleLocationZipCodeChange = (ev) => {
    setLocationZipCode(ev.target.value);
  };

  const handleLocationCityChange = (ev) => {
    setLocationCity(ev.target.value);
  };

  const handleLocationCountryChange = (ev) => {
    setLocationCountry(ev.target.value);
  };

  const handleDepartmentNameChange = (ev) => {
    setDepartmentName(ev.target.value);
  };

  const handleDepartmentManagerChange = (ev) => {
    setDepartmentManager(ev.target.value);
  };

  const handleDepartmentAddressChange = (ev) => {
    setDepartmentAddress(ev.target.value);
  };

  const navigate = useNavigate();

  const displayEmployeesDB = () => {
    setEmployeesDBShow(true);
    setDepartmentsDBShow(false);
    setLocationsDBShow(false);
    setAccountsDBShow(false);
    setBookingsDBShow(false);
    setPlotShow(false);
  };

  const displayDepartmentsDB = () => {
    setEmployeesDBShow(false);
    setDepartmentsDBShow(true);
    setLocationsDBShow(false);
    setAccountsDBShow(false);
    setBookingsDBShow(false);
    setPlotShow(false);
  };

  const displayLocationsDB = () => {
    setEmployeesDBShow(false);
    setDepartmentsDBShow(false);
    setLocationsDBShow(true);
    setAccountsDBShow(false);
    setBookingsDBShow(false);
    setPlotShow(false);
  };

  const displayAccountsDB = () => {
    setEmployeesDBShow(false);
    setDepartmentsDBShow(false);
    setLocationsDBShow(false);
    setAccountsDBShow(true);
    setBookingsDBShow(false);
    setPlotShow(false);
  };

  const displayBookingsDB = () => {
    setEmployeesDBShow(false);
    setDepartmentsDBShow(false);
    setLocationsDBShow(false);
    setAccountsDBShow(false);
    setBookingsDBShow(true);
    setPlotShow(false);
  };

  const displayPlot = () => {
    setEmployeesDBShow(false);
    setDepartmentsDBShow(false);
    setLocationsDBShow(false);
    setAccountsDBShow(false);
    setBookingsDBShow(false);
    setPlotShow(true);
  };

  const logOut = () => {
    let refreshedUser = { user: "", isConnected: false };
    fetch("http://localhost:5000/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(refreshedUser),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
    toast.info("Logging out...");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const pieData = [
    { name: "Children", value: childrenNum },
    { name: "Teenagers", value: teenagersNum },
    { name: "Adults", value: adultsNum },
    { name: "Seniors", value: seniorsNum },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const yearlyIncomeChartData = [
    { name: "2023", value: yearlyIncomeDataSet["2023"] },
    { name: "2024", value: yearlyIncomeDataSet["2024"] },
    { name: "2025", value: yearlyIncomeDataSet["2025"] },
    { name: "2026", value: yearlyIncomeDataSet["2026"] },
  ];

  const monthlyIncomeChartData = [
    { name: "January", value: monthlyIncomeDataSet["01"] },
    { name: "February", value: monthlyIncomeDataSet["02"] },
    { name: "March", value: monthlyIncomeDataSet["03"] },
    { name: "April", value: monthlyIncomeDataSet["04"] },
    { name: "May", value: monthlyIncomeDataSet["05"] },
    { name: "June", value: monthlyIncomeDataSet["06"] },
    { name: "July", value: monthlyIncomeDataSet["07"] },
    { name: "August", value: monthlyIncomeDataSet["08"] },
    { name: "September", value: monthlyIncomeDataSet["09"] },
    { name: "October", value: monthlyIncomeDataSet["10"] },
    { name: "November", value: monthlyIncomeDataSet["11"] },
    { name: "December", value: monthlyIncomeDataSet["12"] },
  ];

  let clientsExpenditureData = [];
  let companiesShareData = [];
  let companies = [];

  for (let user of users) {
    let clientExependitureData = {
      name: `${user}`,
      value: 0,
    };
    if (bookingsDataSet[`${user}`]) {
      let bookings = Object.values(bookingsDataSet[`${user}`]);
      let price = 0;

      for (var i = 0; i < bookings.length; i++) {
        price += Number(bookings[i].price.TOTAL_PRICE);
        let companyD = bookings[i].departure.COMPANY;
        if (!companies.includes(companyD)) {
          companies.push(companyD);
        }
        if (bookings[i].return) {
          let companyR = bookings[i].return.COMPANY;
          if (!companies.includes(companyR)) {
            companies.push(companyR);
          }
        }
      }
      clientExependitureData.value = price.toFixed(2);
      clientsExpenditureData.push(clientExependitureData);
    }
  }

  for (let company of companies) {
    let companyData = {
      name: "",
      value: 0,
    };
    var counter = 0;
    for (var user of users) {
      if (bookingsDataSet[`${user}`]) {
        var bookings = Object.values(bookingsDataSet[`${user}`]);
        for (i = 0; i < bookings.length; i++) {
          if (bookings[i].departure.COMPANY === company) {
            counter++;
          }
          if (bookings[i].return) {
            if (bookings[i].return.COMPANY === company) {
              counter++;
            }
          }
        }
      }
    }
    companyData.name = company;
    companyData.value = counter;
    companiesShareData.push(companyData);
  }

  const handlePlot = (ev) => {
    setSelectedPlot(ev.target.value);
    if (ev.target.value === "category") {
      document.getElementById("passengerCategoryName").style.display = "block";
      document.getElementById("yearlyIncomePlot").style.display = "none";
      document.getElementById("monthlyIncomePlot").style.display = "none";
      document.getElementById("clientExpenditurePlot").style.display = "none";
      document.getElementById("companyName").style.display = "none";
    } else if (ev.target.value === "yearlyIncome") {
      document.getElementById("passengerCategoryName").style.display = "none";
      document.getElementById("yearlyIncomePlot").style.display = "block";
      document.getElementById("monthlyIncomePlot").style.display = "none";
      document.getElementById("clientExpenditurePlot").style.display = "none";
      document.getElementById("companyName").style.display = "none";
    } else if (ev.target.value === "monthlyIncome") {
      toast.info("Please select a year!");
      document.getElementById("passengerCategoryName").style.display = "none";
      document.getElementById("yearlyIncomePlot").style.display = "none";
      document.getElementById("monthlyIncomePlot").style.display = "block";
      document.getElementById("clientExpenditurePlot").style.display = "none";
      document.getElementById("companyName").style.display = "none";
    } else if (ev.target.value === "company") {
      document.getElementById("passengerCategoryName").style.display = "none";
      document.getElementById("yearlyIncomePlot").style.display = "none";
      document.getElementById("monthlyIncomePlot").style.display = "none";
      document.getElementById("clientExpenditurePlot").style.display = "none";
      document.getElementById("companyName").style.display = "block";
    } else if (ev.target.value === "client") {
      document.getElementById("passengerCategoryName").style.display = "none";
      document.getElementById("yearlyIncomePlot").style.display = "none";
      document.getElementById("monthlyIncomePlot").style.display = "none";
      document.getElementById("clientExpenditurePlot").style.display = "block";
      document.getElementById("companyName").style.display = "none";
    } else {
      document.getElementById("passengerCategoryName").style.display = "none";
      document.getElementById("yearlyIncomePlot").style.display = "none";
      document.getElementById("monthlyIncomePlot").style.display = "none";
      document.getElementById("clientExpenditurePlot").style.display = "none";
      document.getElementById("companyName").style.display = "none";
    }
  };

  return (
    <div className="adminPageRoot">
      {mainUser.user && /^admin.*/.test(mainUser.user) ? (
        <div>
          <div className="adminHeader">
            <h1>Administration</h1>
          </div>
          <div className="adminWorkingArea">
            <div className="adminLeftWA">
              <div className="adminItem" onClick={displayEmployeesDB}>
                <h5>Employees Database</h5>
              </div>
              <div className="adminItem" onClick={displayDepartmentsDB}>
                <h5>Departments Database</h5>
              </div>
              <div className="adminItem" onClick={displayLocationsDB}>
                <h5>Locations Database</h5>
              </div>
              <div className="adminItem" onClick={displayAccountsDB}>
                <h5>Accounts Database</h5>
              </div>
              <div className="adminItem" onClick={displayBookingsDB}>
                <h5>Bookings Database</h5>
              </div>
              <div className="adminItem" onClick={displayPlot}>
                <h5>Display plot</h5>
              </div>
              <div className="adminItem" onClick={logOut}>
                <h5>Sign out</h5>
              </div>
            </div>
            <div className="adminRightWA">
              {locationsDBShow && (
                <div id="locationsDB" className="dbShow">
                  <div className="locationAddition">
                    <Button
                      id="btnAddLocation"
                      onClick={locationsClicksHandler}>
                      Add location+
                    </Button>
                    <br />
                    <div id="locationsInputs" className="locationsInputs">
                      <label className="locationLabel">Address: </label>
                      <input
                        className="locationInput"
                        type="text"
                        value={locationAddress}
                        onChange={handleLocationAddressChange}></input>
                      <br />
                      <label className="locationLabel">Zip code:</label>
                      <input
                        className="locationInput"
                        type="text"
                        value={locationZipCode}
                        onChange={handleLocationZipCodeChange}></input>
                      <br />
                      <label className="locationLabel">City:</label>
                      <input
                        className="locationInput"
                        type="text"
                        value={locationCity}
                        onChange={handleLocationCityChange}></input>
                      <br />
                      <label className="locationLabel">Country:</label>
                      <input
                        className="locationInput"
                        type="text"
                        value={locationCountry}
                        onChange={handleLocationCountryChange}></input>
                      <br />
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={() => {
                          if (
                            locationAddress === "" ||
                            locationZipCode === "" ||
                            locationCity === "" ||
                            locationCountry === ""
                          ) {
                            toast.error("Please insert valid values!");
                          } else {
                            locationHighestKey++;
                            const locationsReference = ref(
                              TOMAirDB,
                              "/locations/" + locationHighestKey
                            );
                            set(locationsReference, {
                              ADDRESS: locationAddress,
                              ZIP_CODE: locationZipCode,
                              CITY: locationCity,
                              COUNTRY: locationCountry,
                            });
                            setLocationAddress("");
                            setLocationZipCode("");
                            setLocationCity("");
                            setLocationCountry("");
                            document.getElementById(
                              "locationsInputs"
                            ).style.display = "none";
                          }
                        }}>
                        Submit
                      </button>
                    </div>
                    <br />
                    <h5>
                      Check the Locations DataBase{" "}
                      <a href="https://console.firebase.google.com/u/0/project/tomairdb/database/tomairdb-default-rtdb/data/~2Flocations">
                        here
                      </a>
                      !
                    </h5>
                  </div>
                </div>
              )}
              {departmentsDBShow && (
                <div id="departmentsDB" className="dbShow">
                  <div className="locationAddition">
                    <Button
                      id="btnAddDepartment"
                      onClick={departmentsClicksHandler}>
                      Add department+
                    </Button>
                    <br />
                    <div id="departmentsInputs" className="locationsInputs">
                      <label className="locationLabel">Department name:</label>
                      <input
                        type="text"
                        className="locationInput"
                        value={departmentName}
                        onChange={handleDepartmentNameChange}></input>
                      <br />
                      <label className="locationLabel">Manager:</label>
                      <input
                        type="text"
                        className="locationInput"
                        value={departmentManager}
                        onChange={handleDepartmentManagerChange}></input>
                      <br />
                      <label className="locationLabel">Location:</label>
                      <select
                        className="locationInput"
                        value={departmentAddress}
                        onChange={handleDepartmentAddressChange}>
                        <option value="" disabled>
                          Select a location
                        </option>
                        {locationsData.map((location) => (
                          <option
                            key={location.ADDRESS}
                            value={location.ADDRESS}>
                            {location.ADDRESS}
                          </option>
                        ))}
                      </select>
                      <br />
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={() => {
                          if (
                            departmentName === "" ||
                            departmentManager === "" ||
                            departmentAddress === ""
                          ) {
                            toast.error("Please insert valid values!");
                          } else {
                            departmentHighestKey += 10;
                            const departmentReference = ref(
                              TOMAirDB,
                              "/departments/" + departmentHighestKey
                            );
                            set(departmentReference, {
                              NAME: departmentName,
                              MANAGER: departmentManager,
                              LOCATION: departmentAddress,
                            });
                            setDepartmentName("");
                            setDepartmentManager("");
                            setDepartmentAddress("");
                            document.getElementById(
                              "departmentsInputs"
                            ).style.display = "none";
                          }
                        }}>
                        Submit
                      </button>
                    </div>
                    <br />
                    <h5>
                      Check the Departments DataBase{" "}
                      <a href="https://console.firebase.google.com/u/0/project/tomairdb/database/tomairdb-default-rtdb/data/~2Fdepartments">
                        here
                      </a>
                      !
                    </h5>
                  </div>
                </div>
              )}
              {employeesDBShow && (
                <div id="employeesDB" className="dbShow">
                  <div className="locationAddition">
                    <Button
                      id="btnAddEmployees"
                      onClick={employeesClicksHandler}>
                      Add employee+
                    </Button>
                    <br />
                    <div id="employeesInputs" className="locationsInputs">
                      <label className="locationLabel">Last name: </label>
                      <input className="locationInput" type="text"></input>
                      <br />
                      <label className="locationLabel">First name:</label>
                      <input className="locationInput" type="text"></input>
                      <br />
                      <label className="locationLabel">Employment date:</label>
                      <input
                        className="locationInput"
                        type="date"
                        placeholder="yyyy/MM/dd"></input>
                      <br />
                      <label className="locationLabel">Salary:</label>
                      <input className="locationInput" type="text"></input>
                      <br />
                      <label className="locationLabel">Phone number:</label>
                      <input className="locationInput" type="text"></input>
                      <br />
                      <label className="locationLabel">E-mail:</label>
                      <input className="locationInput" type="text"></input>
                      <br />
                      <label className="locationLabel">Department:</label>
                      <select className="locationInput" value="" readOnly>
                        <option value="" disabled>
                          Select a department
                        </option>
                        {departmentsData.map((dep) => (
                          <option key={dep.NAME} value={dep.NAME}>
                            {dep.NAME}
                          </option>
                        ))}
                      </select>
                      <br />
                      <label className="locationLabel">Function:</label>
                      <input className="locationInput" type="text"></input>
                      <br />
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={() => {
                          if (
                            employeeLastName === "" ||
                            employeeFirstName === "" ||
                            employeeEmploymentDate === "" ||
                            employeeSalary === "" ||
                            employeeEmail === "" ||
                            employeePhoneNumber === "" ||
                            employeeDepartment === "" ||
                            employeeFunction === ""
                          ) {
                            toast.error("Please insert valid values!");
                          } else {
                            employeesHighestKey++;
                            const employeeReference = ref(
                              TOMAirDB,
                              "/employees/" + employeesHighestKey
                            );
                            set(employeeReference, {
                              LAST_NAME: employeeLastName,
                              FIRST_NAME: employeeFirstName,
                              EMPLOYMENT_DATE: employeeEmploymentDate,
                              SALARY: employeeSalary,
                              PHONE_NUMBER: employeePhoneNumber,
                              EMAIL: employeeEmail,
                              DEPARTMENT: employeeDepartment,
                              FUNCTION: employeeFunction,
                            });
                            setEmployeeLastName("");
                            setEmployeeFirstName("");
                            setEmployeeEmploymentDate("");
                            setEmployeeSalary("");
                            setEmployeePhoneNumber("");
                            setEmployeeEmail("");
                            setEmployeeDepartment("");
                            setEmployeeFuntion("");
                            document.getElementById(
                              "employeesInputs"
                            ).style.display = "none";
                          }
                        }}>
                        Submit
                      </button>
                    </div>
                    <br />
                    <h5>
                      Check the Employees DataBase{" "}
                      <a href="https://console.firebase.google.com/u/0/project/tomairdb/database/tomairdb-default-rtdb/data/~2Femployees">
                        here
                      </a>
                      !
                    </h5>
                  </div>
                </div>
              )}
              {accountsDBShow && (
                <div id="accountsDB" className="dbShow">
                  <br />
                  <h5>
                    Check the accounts DataBase{" "}
                    <a href="https://console.firebase.google.com/u/0/project/tomairdb/database/tomairdb-default-rtdb/data/~2Fusers">
                      here
                    </a>
                    !
                  </h5>
                </div>
              )}
              {bookingsDBShow && (
                <div id="bookingsDB" className="dbShow">
                  <br />
                  <h5>
                    Check the bookings DataBase{" "}
                    <a href="https://console.firebase.google.com/u/0/project/tomairdb/database/tomairdb-default-rtdb/data/~2Fbookings">
                      here
                    </a>
                    !
                  </h5>
                </div>
              )}
              {plotShow && (
                <div
                  id="plotDiv"
                  className="dbShow"
                  style={{ display: displayPlot }}>
                  <label className="locationLabel">Plot: </label>
                  <select
                    className="locationInput"
                    onChange={handlePlot}
                    value={selectedPlot}>
                    <option value="" disabled>
                      Choose plot
                    </option>
                    <option value="category">
                      Passenger category pie chart
                    </option>
                    <option value="yearlyIncome">Yearly income</option>
                    <option value="monthlyIncome">Monthly income</option>
                    <option value="company">Company pie chart</option>
                    <option value="client">Client expenditures</option>
                  </select>
                  <br />
                  <div id="passengerCategoryName" className="plotDiv">
                    <br />
                    <PieChart width={600} height={600}>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={200}
                        fill="#8884d8">
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </div>
                  <div id="yearlyIncomePlot" className="plotDiv">
                    <br />
                    <BarChart
                      width={1200}
                      height={600}
                      data={yearlyIncomeChartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </div>
                  <div id="monthlyIncomePlot" className="plotDiv">
                    <select
                      className="locationInput"
                      value={selectedYear}
                      onChange={(ev) => {
                        setSelectedYear(ev.target.value);
                      }}>
                      <option value="">Choose year...</option>
                      <option value="2022">2022</option>
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                    </select>
                    <br />
                    <br />
                    <BarChart
                      width={1200}
                      height={600}
                      data={monthlyIncomeChartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </div>
                  <div id="companyName" className="plotDiv">
                    <br />
                    <PieChart width={600} height={600}>
                      <Pie
                        data={companiesShareData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={200}
                        fill="#8884d8">
                        {companiesShareData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </div>
                  <div id="clientExpenditurePlot" className="plotDiv">
                    <br />
                    <BarChart
                      width={1200}
                      height={600}
                      data={clientsExpenditureData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </div>
                </div>
              )}
            </div>
          </div>
          <ToastContainer />
        </div>
      ) : (
        <p>Access denied!</p>
      )}
    </div>
  );
}

export default AdminPage;
