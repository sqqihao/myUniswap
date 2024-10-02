const { ethers } = require("ethers");
const {UNIV2ROUTERABI,ERC20ABI,PAIRABI} = require("./ABI.js");
const { privateKey, WETHContractAddr, uniFactoryAddr, uniRouter, erc20Addr,erc20AddrB ,pairAddr, smallRouter} = require("./conf.js");


const ALCHEMY_SEPOLIA_URL = "http://localhost:8545";

const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL)

const wallet = new ethers.Wallet(privateKey, provider);

const pairContract = new ethers.Contract(pairAddr, PAIRABI, wallet);

const uniRouterContractWithWallet = new ethers.Contract(uniRouter, UNIV2ROUTERABI, wallet);

async function addLiquidity() {

    const tokenAAddress = erc20Addr;
    const tokenBAddress = erc20AddrB;


    let lpTokenBalance = await pairContract.balanceOf(wallet.address);
    let reserves = await pairContract.getReserves();
    console.log(`wallet LP 代币数量: ${lpTokenBalance.toString()};`);
    console.log(`pairContract 储备量: ${reserves[0].toString()}, ${reserves[1].toString()}`);
    console.log("wallet.address:" +wallet.address)

    const token0Amount = ethers.parseEther("100");
    const token1Amount = ethers.parseEther("50");
    const deadline = Math.floor(Date.now() / 1000) + 10 * 60; //当前时间+10分钟的时间戳

    // console.log(uniRouterContractWithWallet.swapExactTokensForTokens)
    // console.log(uniRouterContractWithWallet.addLiquidity)

/*

    const addLiquidityTx = await uniRouterContractWithWallet.addLiquidity(
        tokenAAddress,
        tokenBAddress,
        token0Amount,
        token1Amount,
        0,
        0,
        wallet.address,
        deadline
    );
    await addLiquidityTx.wait();


*/

//卧槽了，怎么地址不一样
//0x52e78d8B299d898dCcddb9cb2a4CaFEC0359678D
//0x5bA342cadCdfbb25015D3b65c910E0F6460d330E


    let txPair = await uniRouterContractWithWallet.getPairTest(tokenAAddress,tokenBAddress);
    console.log("链上Pair地址为："+txPair)


    //查询 LP 流动币数量和 pair 交易对的储备量
    lpTokenBalance = await pairContract.balanceOf(wallet.address);
    reserves = await pairContract.getReserves();
    console.log(`owner LP 代币数量: ${lpTokenBalance.toString()}`);
    console.log(`pairContract 储备量: ${reserves[0].toString()}, ${reserves[1].toString()}`);


}

addLiquidity();