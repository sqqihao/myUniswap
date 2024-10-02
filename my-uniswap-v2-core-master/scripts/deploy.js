// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  console.log('Account balance:', (await ethers.provider.getBalance(deployer.address)).toString());


  // const SimpleERC20 = await ethers.getContractFactory('SimpleERC20');
  
  // const simpleERC20 = await SimpleERC20.deploy();
  // await simpleERC20.waitForDeployment();
  // // await weth.deployed();
  // console.log('simpleERC20 weth address:', simpleERC20.target);
  

  const Weth = await ethers.getContractFactory('WETH9');
  const weth = await Weth.deploy();
  await weth.waitForDeployment();
  // await weth.deployed();
  console.log('deploy weth address:', weth.target);


  const UniFactory = await ethers.getContractFactory('UniswapV2Factory');
                                            //收税开关权限控制
  const uniFactory = await UniFactory.deploy("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  await uniFactory.waitForDeployment();
  console.log('deploy uniFactory address:', uniFactory.target);


  const UniRouter = await ethers.getContractFactory('UniswapV2Router01');
  const uniRouter = await UniRouter.deploy(uniFactory.target, weth.target);
  await uniRouter.waitForDeployment();
  console.log('deploy uniRouter address:', uniRouter.target);


  const TokenA = await ethers.getContractFactory("ERC20token");
  const tokenA = await TokenA.deploy("ACoin","ACoin");
  await tokenA.waitForDeployment();
  console.log("erc20 tokenA address:", tokenA.target);

  const TokenB = await ethers.getContractFactory("ERC20token");
  const tokenB = await TokenB.deploy("BCoin","BCoin");
  await tokenB.waitForDeployment();
  console.log("erc20 tokenB address:", tokenB.target);

 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });