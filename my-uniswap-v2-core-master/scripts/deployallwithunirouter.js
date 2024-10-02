// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require('hardhat');
const { MYWETH9TEST,SIMPLEERC20ABI ,UNIV2ROUTERABI} = require("./ABI.js");
const { privateKey, WETHContractAddr } = require("./conf.js");
// const { ethers } = require("ethers");

const ALCHEMY_SEPOLIA_URL = "http://localhost:8545";
const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL)
// 本地hardhat私钥
// const privateKey = 'xxxxxxxxxxxxxxxxxxxxxxxx';
const wallet = new ethers.Wallet(privateKey, provider)


async function main() {
	const [deployer] = await ethers.getSigners();
	console.log('Deploying contracts with the account:', deployer.address);
	console.log('Account balance:', (await ethers.provider.getBalance(deployer.address)).toString());


	// const SimpleERC20 = await ethers.getContractFactory('SimpleERC20');

	// const simpleERC20 = await SimpleERC20.deploy();
	// await simpleERC20.waitForDeployment();
	// // await weth.deployed();
	// console.log('simpleERC20 weth address:', simpleERC20.target);

	console.log("")
	console.log("______________________________________________________")
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

	const UniRouter = await ethers.getContractFactory('UniswapV2Router02');
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
	console.log("______________________________________________________")
	console.log("")


	//开始mint TOKENA和TOKENB
	console.log("开始mint TOKENA和TOKENB");
	const erc20ContractWithWallet = new ethers.Contract(tokenA.target, SIMPLEERC20ABI, wallet);
	const erc20ContractWithWalletB = new ethers.Contract(tokenB.target, SIMPLEERC20ABI, wallet);

	let bal = await erc20ContractWithWallet.balanceOf(wallet.address);
	console.log("erc20A余额："+bal);

	let tx = await erc20ContractWithWallet.mint(wallet.address,20000);
	await tx.wait();
	let txB = await erc20ContractWithWalletB.mint(wallet.address,30000);
	await txB.wait();
	console.log("mint成功");

	let bal1 = await erc20ContractWithWallet.balanceOf(wallet.address);
	console.log("erc20A余额："+bal1);
	let bal2 = await erc20ContractWithWalletB.balanceOf(wallet.address);
	console.log("erc20B余额："+bal2);


	console.log("")
	console.log("______________________________________________________")
	console.log("新建pair对")
	//调用 uniswapfactory 的 createPair 函数来创造流动池

	const Pair = await uniFactory.createPair(tokenA.target, tokenB.target);
	const pair = await Pair.wait();
	console.log("新建pair对成功")
	console.log("______________________________________________________")
	console.log("")

	// 获取pair地址
	const pairAddress = await uniFactory.getPair(tokenA.target, tokenB.target);
	console.log(`pair 部署在 ${pairAddress}`);


	/*
	console.log("")
	//部署smallRouter合约
	console.log("部署smallRouter合约");
	console.log("______________________________________________________")
	const SmallRouter = await ethers.getContractFactory('Router');
	const smallRouter = await SmallRouter.deploy(pairAddress);
	await smallRouter.waitForDeployment();
	// await weth.deployed();
	console.log('deploy router address:', smallRouter.target);
	console.log("______________________________________________________")
	console.log("")
	*/
	


    //approve钱包对于router的访问
    console.log("开始授权钱包给路由合约地址");
    console.log("A Approving tokens...");
    const txA = await erc20ContractWithWallet.approve(uniRouter.target, ethers.parseEther("1000"));
    // 等待交易被确认
    await txA.wait();
    console.log("A Tokens approved!");

    console.log("B Approving tokens...");
   	txB = await erc20ContractWithWalletB.approve(uniRouter.target, ethers.parseEther("1000"));
    // 等待交易被确认
    await txB.wait();
    console.log("B Tokens approved!");
    console.log("授权 1000 个A Token和 1000 个B Token给router");


    console.log("开始addLiquity添加流动性");
    const pairContract = new ethers.Contract(pairAddress, PAIRABI, wallet);
    let lpTokenBalance = await pairContract.balanceOf(wallet.address);
    let reserves = await pairContract.getReserves();
    console.log(`wallet LP 代币数量: ${lpTokenBalance.toString()};`);
    console.log(`pairContract 储备量: ${reserves[0].toString()}, ${reserves[1].toString()}`);
    console.log("wallet.address : " +wallet.address)

    const token0Amount = ethers.parseEther("5");
    const token1Amount = ethers.parseEther("1");
    const deadline = Math.floor(Date.now() / 1000) + 10 * 60; //当前时间+10分钟的时间戳

    const BigRouterContract = new ethers.Contract(uniRouter.target, UNIV2ROUTERABI, wallet);

    let txPair = await BigRouterContract.getPairTest(tokenA.target, tokenB.target);
    console.log("链上Pair地址为："+txPair)


    const addLiquidityTx = await BigRouterContract.addLiquidity(
        tokenA.target,
        tokenB.target,
        token0Amount,
        token1Amount,
        0,
        0,
        wallet.address,
        deadline
    );
    await addLiquidityTx.wait();

    //查询 LP 流动币数量和 pair 交易对的储备量
    lpTokenBalance = await pairContract.balanceOf(wallet.address);
    reserves = await pairContract.getReserves();
    console.log(`owner LP 代币数量: ${lpTokenBalance.toString()}`);
    console.log(`pairContract 储备量: ${reserves[0].toString()}, ${reserves[1].toString()}`);
 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
