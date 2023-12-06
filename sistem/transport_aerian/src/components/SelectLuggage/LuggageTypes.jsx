import React, { forwardRef, useImperativeHandle, useState } from "react";
import smallLuggage from "../../media/smallLuggage.PNG";
import mediumLuggage from "../../media/mediumLuggage.PNG";
import bigLuggage from "../../media/bigLuggage.PNG";

const LuggageTypes = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => {
    return {
      luggages: passengerLuggageSummary,
    };
  });

  const [borderStyleSmall] = useState("3px solid #7CFC00");
  const [borderStyleMedium, setBorderStyleMedium] = useState("2px solid black");
  const [isClickedMedium, setIsClickedMedium] = useState(false);
  const [borderStyleBig, setBorderStyleBig] = useState("2px solid black");
  const [isClickedBig, setIsClickedBig] = useState(false);

  const [luggageList, setLuggageList] = useState(["Small luggage"]);
  const [luggagePrice, setLuggagePrice] = useState(0);

  const changeColorMedium = () => {
    setIsClickedMedium(!isClickedMedium);
    setBorderStyleMedium(
      isClickedMedium ? "2px solid black" : "3px solid #7CFC00"
    );
    if (!isClickedMedium) {
      setLuggageList([...luggageList, " Medium luggage"]);
      setLuggagePrice(luggagePrice + 40);
    } else {
      setLuggageList(
        luggageList.filter((luggage) => luggage !== " Medium luggage")
      );
      setLuggagePrice(luggagePrice - 40);
    }
  };

  const changeColorBig = () => {
    setIsClickedBig(!isClickedBig);
    setBorderStyleBig(isClickedBig ? "2px solid black" : "3px solid #7CFC00");
    if (!isClickedBig) {
      setLuggageList([...luggageList, " Big luggage"]);
      setLuggagePrice(luggagePrice + 80);
    } else {
      setLuggageList(
        luggageList.filter((luggage) => luggage !== " Big luggage")
      );
      setLuggagePrice(luggagePrice - 80);
    }
  };

  let passengerLuggageSummary = {
    luggage: luggageList,
    price: luggagePrice,
  };

  return (
    <div className="rootLuggageTypes">
      <h1 id="passenger">Passenger: {props.passengerFullDescription}</h1>
      <div
        id="smallLuggage"
        className="luggageType"
        style={{ border: borderStyleSmall }}>
        <div className="luggageImage">
          <img
            src={smallLuggage}
            height="75px"
            width="75px"
            alt="small luggage icon"></img>
        </div>
        <div className="dimensions">
          <h2>Dimensions: 40 x 30 x 20 cm</h2>
        </div>
        <div className="additionalFee">
          <h2 id="included">Included</h2>
        </div>
      </div>
      <div
        className="luggageType"
        style={{ border: borderStyleMedium }}
        onClick={changeColorMedium}>
        <div className="luggageImage">
          <img
            src={mediumLuggage}
            height="75px"
            width="75px"
            alt="medium luggage icon"></img>
        </div>
        <div className="dimensions">
          <h2>Dimensions: 55 x 40 x 23 cm</h2>
        </div>
        <div className="additionalFee">
          <h2>Additional 40€</h2>
        </div>
      </div>
      <div
        className="luggageType"
        style={{ border: borderStyleBig }}
        onClick={changeColorBig}>
        <div className="luggageImage">
          <img
            src={bigLuggage}
            height="75px"
            width="75px"
            alt="big luggage icon"></img>
        </div>
        <div className="dimensions">
          <h2>Dimensions: 100 x 80 x 30 cm</h2>
        </div>
        <div className="additionalFee">
          <h2>Additional 80€</h2>
        </div>
        <hr />
      </div>
      <div className="confirmSelection">
        <div className="passengerSelection">
          <label className="labelSelection">Passenger selection: </label>
          <input
            id="inputLuggageList"
            type="text"
            value={luggageList}
            className="inputSelection"
            readOnly></input>
          <label className="labelSelection">Price: </label>
          <input
            value={luggagePrice}
            readOnly
            type="text"
            className="inputSelection"></input>
          <hr />
        </div>
      </div>
    </div>
  );
});

export default LuggageTypes;
