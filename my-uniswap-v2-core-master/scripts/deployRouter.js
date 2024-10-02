// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require('hardhat');
const {pairAddr} = require("./conf.js");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  console.log('Account balance:', (await ethers.provider.getBalance(deployer.address)).toString());

  const Weth = await ethers.getContractFactory('Router');

  console.log("__________________________________")
  console.log("__________________________________")
  console.log("_________++++++++++++++++_________")
  console.log("_________特别注意部署的地址_________");
  // const pairAddr = "0xEf536b50e07919913064456376718CD945f1B56D";
  console.log("_________"+pairAddr+"_________");
  console.log("__________________________________")
  console.log("__________________________________")
  console.log("__________________________________")
  console.log("__________________________________")

  const weth = await Weth.deploy(pairAddr);
  await weth.waitForDeployment();
  // await weth.deployed();
  console.log('deploy router address:', weth.target);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });