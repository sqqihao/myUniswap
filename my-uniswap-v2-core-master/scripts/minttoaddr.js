const { ethers } = require('hardhat');
const { MYWETH9TEST,SIMPLEERC20ABI } = require("./ABI.js");
const { privateKey, WETHContractAddr, uniFactoryAddr, uniRouter, erc20Addr,erc20AddrB } = require("./conf.js");
// const { ethers } = require("ethers");

const ALCHEMY_SEPOLIA_URL = "http://localhost:8545";
const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL)
// 本地hardhat私钥
// const privateKey = 'xxxxxxxxxxxxxxxxxxxxxxxx';
const wallet = new ethers.Wallet(privateKey, provider)


async function main() {

	//开始mint TOKENA和TOKENB
	console.log("开始mint TOKENA和TOKENB");
	const erc20ContractWithWallet = new ethers.Contract(erc20Addr, SIMPLEERC20ABI, wallet);

	const mintAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
	let bal = await erc20ContractWithWallet.balanceOf(mintAddress);
	console.log("erc20A余额："+bal);

	let tx = await erc20ContractWithWallet.mint(mintAddress,20000);
	await tx.wait();

	bal = await erc20ContractWithWallet.balanceOf(mintAddress);
	console.log("erc20A余额："+bal);
}

main();
