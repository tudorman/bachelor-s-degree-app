import { HashRouter, Route, Routes } from "react-router-dom";
import SearchFlight from "../src/components/SearchFlight/SearchFlight";
import Login from "../src/components/Login/Login";
import CreateAccount from "../src/components/CreateAccount/CreateAccount";
import ChooseFlight from "./components/ChooseFlight/ChooseFlight";
import ChooseReturnFlight from "./components/ChooseFlight/ChooseReturnFlight";
import SelectLuggage from "./components/SelectLuggage/SelectLuggage";
import SelectInsurance from "./components/SelectInsurance/SelectInsurance";
import InsertInfo from "./components/InsertInfo/InsertInfo";
import ReservationDescription from "./components/ReservationDescription/ReservationDescription";
import Payment from "./components/Payment/Payment";
import MyAccount from "./components/MyAccount/MyAccount";
import AdminPage from "./components/AdminPage/AdminPage";

const adminRoute =
  "/U2FsdGVkX18a0ssg4sd/Fx06bJgb5Xyu272MEUhxpLpk4uw2F5c89Ny42Nf64/Ro/*";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SearchFlight></SearchFlight>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/create-account" element={<CreateAccount />}></Route>
        <Route path="/choose-flight" element={<ChooseFlight />}></Route>
        <Route path="/return-flight" element={<ChooseReturnFlight />}></Route>
        <Route path="/insert-info" element={<InsertInfo />}></Route>
        <Route path="/select-luggage" element={<SelectLuggage />}></Route>
        <Route path="/select-insurance" element={<SelectInsurance />}></Route>
        <Route
          path="/reservation-details"
          element={<ReservationDescription />}></Route>
        <Route path="/payment" element={<Payment />}></Route>
        <Route path="/my-account" element={<MyAccount />}></Route>
        <Route path={adminRoute} element={<AdminPage />}></Route>
        <Route path="/"></Route>
        <Route path="/"></Route>
        <Route path="/"></Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
