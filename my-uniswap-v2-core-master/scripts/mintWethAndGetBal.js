	// import { ethers } from "ethers";
	// import {WETHABI} from "./ABI.js"
	
	const { ethers } = require("ethers");
	const { MYWETH9TEST } = require("./ABI.js");
	const { privateKey, WETHContractAddr, uniFactoryAddr, uniRouter, erc20Addr } = require("./conf.js");


	const ALCHEMY_SEPOLIA_URL = "http://localhost:8545";

	const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL)

	// const WETHContractAddr = "0xcbEAF3BDe82155F56486Fb5a1072cb8baAf547cc";

	// deploy weth address: 0xcbEAF3BDe82155F56486Fb5a1072cb8baAf547cc
	// deploy uniFactoryAddr address: 0x1429859428C0aBc9C2C47C8Ee9FBaf82cFA0F20f
	// deploy uniRouter address: 0xB0D4afd8879eD9F52b28595d31B441D079B2Ca07
	// erc20 address: 0x162A433068F51e18b7d13932F27e66a3f99E6890

	// 本地hardhat私钥
	// const privateKey = 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
	const wallet = new ethers.Wallet(privateKey, provider)
	
	//NFT的ABI

	//ERC20的ABI
	//const abi = '[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]';

	const wethContractWithWallet = new ethers.Contract(WETHContractAddr, WETHABI, wallet)

	const main = async () => {

		console.log("钱包地址: "+wallet.address);
		let bal = await wethContractWithWallet.balanceOf(wallet.address);
		console.log("总余额："+bal);


		let tx = await wethContractWithWallet.mint(10000000000000*19);
		console.log("-------------");
		console.log(await tx.wait());
		console.log("-------------");

		let bal1 = await wethContractWithWallet.balanceOf(wallet.address);
		console.log("总余额："+bal1);
		
		console.log(await wethContractWithWallet.name());
		console.log(await wethContractWithWallet.symbol());

	}
	main()