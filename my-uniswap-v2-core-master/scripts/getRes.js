const { ethers } = require("ethers");
const {UNIV2ROUTERABI,ERC20ABI,PAIRABI,SMALLROUTERABI} = require("./ABI.js");
const { privateKey, WETHContractAddr, uniFactoryAddr, uniRouter, erc20Addr,erc20AddrB ,pairAddr, smallRouter} = require("./conf.js");


const ALCHEMY_SEPOLIA_URL = "http://localhost:8545";

const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL)

const wallet = new ethers.Wallet(privateKey, provider);

const pairContract = new ethers.Contract(pairAddr, PAIRABI, wallet);
const smallRouterContract = new ethers.Contract(smallRouter, SMALLROUTERABI, wallet);

async function getRes() {

    const tokenAAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6"//erc20Addr;
    const tokenBAddress = "0xdac17f958d2ee523a22062069945911111111111"//erc20AddrB;
    console.log("router address : "+smallRouter);

    // let lpTokenBalance = await pairContract.balanceOf(wallet.address);
    // let reserves = await pairContract.getReserves();
    // console.log(`wallet LP 代币数量: ${lpTokenBalance.toString()};`);
    // console.log(`pairContract 储备量: ${reserves[0].toString()}, ${reserves[1].toString()}`);
    // console.log("wallet.address : " +wallet.address)

    // const token0Amount = ethers.parseEther("10");
    // const token1Amount = ethers.parseEther("2");
    // const deadline = Math.floor(Date.now() / 1000) + 10 * 60; //当前时间+10分钟的时间戳
    console.log([tokenAAddress,tokenBAddress])
    const getReser = await smallRouterContract.getRes(
        tokenAAddress,
        tokenBAddress
    );
    // const res = await getReser.wait();
    console.log(getReser);
    //查询 LP 流动币数量和 pair 交易对的储备量
    // lpTokenBalance = await pairContract.balanceOf(wallet.address);
    // reserves = await pairContract.getReserves();
    // console.log(`owner LP 代币数量: ${lpTokenBalance.toString()}`);
    // console.log(`pairContract 储备量: ${reserves[0].toString()}, ${reserves[1].toString()}`);
}

getRes();