const { ethers } = require("ethers");
const {SMALLROUTERABI,ERC20ABI,PAIRABI} = require("./ABI.js");
const { privateKey, WETHContractAddr, uniFactoryAddr, uniRouter, erc20Addr,erc20AddrB ,pairAddr, smallRouter} = require("./conf.js");


const ALCHEMY_SEPOLIA_URL = "http://localhost:8545";

const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL)

// const privateKey = 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

const wallet = new ethers.Wallet(privateKey, provider);
const walletB = new ethers.Wallet(privateKey, provider);

// const signer = wallet.connect(provider);
// const tokenContractA = new ethers.Contract(erc20Addr, ERC20ABI, wallet);
// const tokenContractB = new ethers.Contract(erc20AddrB, ERC20ABI, walletB);

const tokenContractWithWallet = new ethers.Contract(erc20Addr, ERC20ABI, wallet);
const tokenContractBWithWallet = new ethers.Contract(erc20AddrB, ERC20ABI, wallet);

const RouterContractWithWallet = new ethers.Contract(smallRouter, SMALLROUTERABI, wallet);
const pairContract = new ethers.Contract(pairAddr, PAIRABI, wallet);

// console.log(tokenContractB)
async function swap() {    

	console.log("__________________________________________________________________")
    let bal = await tokenContractWithWallet.balanceOf(wallet.address);
    console.log( "A balance is " + bal);
    bal = await tokenContractBWithWallet.balanceOf(wallet.address);
    console.log( "B balance is " + bal);


	reserves = await pairContract.getReserves();
	console.log(
	`swap前 pair的储备量: ${reserves[0].toString()}, ${reserves[1].toString()}`
	);

	console.log("__________________________________________________________________")

	const amountIn = ethers.parseEther("10");
	const amountOutMin = ethers.parseEther("0");
	const path = [erc20Addr, erc20AddrB]; 
	const to = wallet.address;
	const deadline = Math.floor(Date.now() / 1000) + 10 * 60; //当前时间+10分钟的时间戳

    let tx = await RouterContractWithWallet.swapExactTokensForTokens(
    		amountIn,amountOutMin,path,to,deadline
    );
    console.log(amountIn,amountOutMin,path,to,deadline)
    await tx.wait();

    bal = await tokenContractWithWallet.balanceOf(wallet.address);
    console.log( "A balance is " + bal);
    bal = await tokenContractBWithWallet.balanceOf(wallet.address);
    console.log( "B balance is " + bal);



	reserves = await pairContract.getReserves();
	console.log(
	`swap后 pair的储备量: ${reserves[0].toString()}, ${reserves[1].toString()}`
	);
	console.log("__________________________________________________________________")


}

swap();