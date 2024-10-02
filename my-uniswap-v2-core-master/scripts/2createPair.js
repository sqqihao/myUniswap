

const { ethers } = require("ethers");
const { FactoryABI } = require("./ABI.js");
const { privateKey, WETHContractAddr, uniFactoryAddr, uniRouter, erc20Addr,erc20AddrB } = require("./conf.js");


const ALCHEMY_SEPOLIA_URL = "http://localhost:8545";

const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL)


const FactoryContractAddr = uniFactoryAddr;

// 本地hardhat私钥
// const privateKey = 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const wallet = new ethers.Wallet(privateKey, provider)


// deploy weth address: 0xcbEAF3BDe82155F56486Fb5a1072cb8baAf547cc
// deploy uniFactory address: 0x1429859428C0aBc9C2C47C8Ee9FBaf82cFA0F20f
// deploy uniRouter address: 0xB0D4afd8879eD9F52b28595d31B441D079B2Ca07
// erc20 address: 0x162A433068F51e18b7d13932F27e66a3f99E6890
const TokenA = erc20Addr;
const TokenB = erc20AddrB;
//NFT的ABI

//ERC20的ABI
//const abi = '[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]';

const FactoryhContractWithWallet = new ethers.Contract(FactoryContractAddr, FactoryABI, wallet)

async function main(){

	console.log("新建pair对")
	//调用 uniswapfactory 的 createPair 函数来创造流动池
	const tx1 = await FactoryhContractWithWallet.createPair(TokenA, TokenB);
	await tx1.wait();
	console.log("新建pair对成功")



	// 获取pair地址
	const pairAddress = await FactoryhContractWithWallet.getPair(TokenA, TokenB);
	//0x52e78d8B299d898dCcddb9cb2a4CaFEC0359678D
	//0x5bA342cadCdfbb25015D3b65c910E0F6460d330E
	console.log(`pair 部署在 ${pairAddress}`);

	//从链上获取pair合约
	// const pair = await ethers.getContractAt("UniswapV2Pair", pairAddress);

}
main();