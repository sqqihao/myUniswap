import React from "react";
import Logo from "../moralis-logo.svg";
import Eth from "../eth.svg";
import { Link } from "react-router-dom";
import { ConnectButton } from '@rainbow-me/rainbowkit';


function Header(props) {

  const {address, isConnected, connect} = props;
  console.log(connect)
  return (
    <header>
      <div className="leftH">
        <img src={Logo} alt="logo" className="logo" />
        <Link to="/" className="link">
          <div className="headerItem">Swap</div>
        </Link>
        <Link to="/tokens" className="link">
          <div className="headerItem">Tokens</div>
        </Link>
      </div>
      <div className="rightH">
        <div >
          <ConnectButton  
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
