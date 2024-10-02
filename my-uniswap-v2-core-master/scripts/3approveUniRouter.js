const { ethers } = require("ethers");
const {UNIV2ROUTERABI,ERC20ABI} = require("./ABI.js");
const { privateKey, WETHContractAddr, uniFactoryAddr, uniRouter, erc20Addr,erc20AddrB ,pairAddr, smallRouter} = require("./conf.js");


const ALCHEMY_SEPOLIA_URL = "http://localhost:8545";

const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL)

// const privateKey = 'xxxxxxxxxxxxxxxxxxxxxxxx';

const wallet = new ethers.Wallet(privateKey, provider);
const walletB = new ethers.Wallet(privateKey, provider);

// const signer = wallet.connect(provider);

// const tokenContractA = new ethers.Contract(erc20Addr, ERC20ABI, wallet);
// const tokenContractB = new ethers.Contract(erc20AddrB, ERC20ABI, walletB);
const tokenContractWithWallet = new ethers.Contract(erc20Addr, ERC20ABI, wallet);
const tokenContractBWithWallet = new ethers.Contract(erc20AddrB, ERC20ABI, wallet);

async function addLiquidity() {    

    //approve钱包对于router的访问
    console.log("A Approving tokens...");
    const txA = await tokenContractWithWallet.approve(uniRouter, ethers.parseEther("1000"));
    // 等待交易被确认
    await txA.wait();
    console.log("A Tokens approved!");


    console.log("B Approving tokens...");
    const txB = await tokenContractBWithWallet.approve(uniRouter, ethers.parseEther("1000"));
    // 等待交易被确认
    await txB.wait();
    console.log("B Tokens approved!");
    console.log("授权 1000 个A Token和 1000 个B Token给uniRouter");


}

addLiquidity();
