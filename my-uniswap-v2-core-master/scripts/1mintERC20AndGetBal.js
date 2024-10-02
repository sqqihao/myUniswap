	// import { ethers } from "ethers";
	// import {WETHABI} from "./ABI.js"
	
	const { ethers } = require("ethers");
	const { MYWETH9TEST,SIMPLEERC20ABI } = require("./ABI.js");
	const { privateKey, WETHContractAddr, uniFactoryAddr, uniRouter, erc20Addr,erc20AddrB } = require("./conf.js");

	const ALCHEMY_SEPOLIA_URL = "http://localhost:8545";

	const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL)

	// const WETHContractAddr = "0x162A433068F51e18b7d13932F27e66a3f99E6890";

	// 本地hardhat私钥
	// const privateKey = 'xxxxxxxxxxxxxxxxxxxxxxxx';
	const wallet = new ethers.Wallet(privateKey, provider)
	
	//NFT的ABI

	//ERC20的ABI
	//const abi = '[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]';

	const erc20ContractWithWallet = new ethers.Contract(erc20Addr, SIMPLEERC20ABI, wallet)
	const erc20ContractWithWalletB = new ethers.Contract(erc20AddrB, SIMPLEERC20ABI, wallet)

	const main = async () => {

		// let total = await wethContractWithWallet.totalSupply();
		// console.log("总供应："+await total.wait());
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
		
		console.log(await erc20ContractWithWallet.name());
		console.log(await erc20ContractWithWallet.symbol());
		console.log(await erc20ContractWithWallet.totalSupply());
		

		// let total = await wethContractWithWallet.deposit();
		// console.log("deposit"+await total.wait());

		// console.log("my wallet address is :"+wallet.address)
		// let tx1 = await wethContractWithWallet.bal();
		// let bal = await tx1.wait();
		// console.log("钱包余额"+bal)


		// console.log("开始mint")
		// let tx = await wethContractWithWallet.mint("6000000");
		// await tx.wait();
		// console.log("mint成功")

		
		// let balanceDone = await wethContractWithWallet.balanceOf()
		// console.log("钱包余额"+balanceDone)

	}
	main()
