pragma solidity =0.5.16;

import "./WETH9.sol";

/**
 * The contractName contract does this and that...
 */
contract MYWETH9 is WETH9{
  constructor() public {
    
  }
  function mint(uint _num) external{

	    balanceOf[msg.sender] += _num;
  }
  
  function bal() external view returns(uint){

    return 112321312;
  }

}
