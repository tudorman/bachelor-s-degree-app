import React from "react";
import "./Follow.css";

function Follow() {
  return (
    <div className="follow">
      <div className="followText"> FOLLOW US!👀</div>
      <div className="followIcons">
        <a href="https://www.facebook.com/profile.php?id=100090621670054">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/768px-Facebook_Logo_%282019%29.png"
            alt="Facebook"
            height="25px"
            width="25px"></img>
        </a>
        &nbsp;&nbsp;
        <a href="https://www.instagram.com/tomair2022/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/2048px-Instagram_logo_2016.svg.png"
            alt="Instagram"
            height="25px"
            width="25px"></img>
        </a>
        &nbsp;&nbsp;
        <a href="https://twitter.com/TomairLtd">
          <img
            src="https://png.pngtree.com/png-vector/20221018/ourmid/pngtree-twitter-social-media-round-icon-png-image_6315985.png"
            alt="Twitter"
            height="25px"
            width="25px"></img>
        </a>
        &nbsp;&nbsp;
        <a href="https://youtube.com">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png"
            alt="YouTube"
            height="25px"
            width="30px"></img>
        </a>
      </div>
      <div className="rightsReserved">
        <p>TOMAir Ltd. All rights reserved. @2023 TOMAir</p>
      </div>
    </div>
  );
}

export default Follow;
