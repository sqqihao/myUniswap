const { ethers } = require("ethers");
const {UNIV2ROUTERABI,ERC20ABI,PAIRABI,SMALLROUTERABI} = require("./ABI.js");
const { privateKey, WETHContractAddr, uniFactoryAddr, uniRouter, erc20Addr,erc20AddrB ,pairAddr, smallRouter} = require("./conf.js");


const ALCHEMY_SEPOLIA_URL = "http://localhost:8545";

const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL)

const wallet = new ethers.Wallet(privateKey, provider);

const pairContract = new ethers.Contract(pairAddr, PAIRABI, wallet);
const smallRouterContract = new ethers.Contract(smallRouter, SMALLROUTERABI, wallet);

async function addLiquidity() {

    const tokenAAddress = erc20Addr;
    const tokenBAddress = erc20AddrB;
    console.log("router address : "+smallRouter);

    let lpTokenBalance = await pairContract.balanceOf(wallet.address);
    let reserves = await pairContract.getReserves();
    console.log(`wallet LP 代币数量: ${lpTokenBalance.toString()};`);
    console.log(`pairContract 储备量: ${reserves[0].toString()}, ${reserves[1].toString()}`);
    console.log("wallet.address : " +wallet.address)

    const token0Amount = ethers.parseEther("1");
    const token1Amount = ethers.parseEther("50200000000000000000000");
    const deadline = Math.floor(Date.now() / 1000) + 10 * 60; //当前时间+10分钟的时间戳

    const addLiquidityTx = await smallRouterContract.addLiquidity(
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

    //查询 LP 流动币数量和 pair 交易对的储备量
    lpTokenBalance = await pairContract.balanceOf(wallet.address);
    reserves = await pairContract.getReserves();
    console.log(`owner LP 代币数量: ${lpTokenBalance.toString()}`);
    console.log(`pairContract 储备量: ${reserves[0].toString()}, ${reserves[1].toString()}`);


    
/*

    const amountA =ethers.parseEther("10");; // 例如 1 个代币
    const amountB = ethers.parseEther("2");; // 例如 1 个代币
    const minAmountA = ethers.parseEther("0.1"); // 最小接受数量
    const minAmountB = ethers.parseEther("0.1"); // 最小接受数量
    const to = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20分钟后过期
    console.log("___")



    //approve钱包对于router的访问
    const tokenContract = new ethers.Contract(tokenAAddress, ERC20ABI, wallet);
    const txA = await tokenContract.approve(smallRouter, amountA);
    console.log("A Approving tokens...");
    // 等待交易被确认
    await txA.wait();
    console.log("A Tokens approved!");


    const tokenContractB = new ethers.Contract(tokenBAddress, ERC20ABI, wallet);
    const txB = await tokenContractB.approve(smallRouter, amountB);
    console.log("B Approving tokens...");
    // 等待交易被确认
    await txB.wait();
    console.log("B Tokens approved!");


    console.log("______");

    // 转移代币到合约
    const tokenA = new ethers.Contract(tokenAAddress, ERC20ABI, wallet);
    const tokenB = new ethers.Contract(tokenBAddress, ERC20ABI, wallet);
    console.log( await tokenA.balanceOf(wallet) )
    console.log( await tokenB.balanceOf(wallet) )
    
    let tx = await tokenA.transfer(smallRouter, ethers.parseEther("1"));
    await tx.wait();
    tx = await tokenB.transfer( smallRouter, ethers.parseEther("1"));
    await tx.wait();
    console.log("________________________");

    console.log("____________smallRouter余额____________");
    console.log(await tokenContract.balanceOf(smallRouter))
    console.log("____________pairAddr余额____________");
    console.log(await tokenContract.balanceOf(pairAddr))


    const instanceRouter = new ethers.Contract(smallRouter, SMALLROUTERABI, wallet);

    // 添加流动性
    // console.log(
    //     tokenAAddress,
    //     tokenBAddress,
    //     amountA,
    //     amountB,
    //     minAmountA,
    //     minAmountB,
    //     to,
    //     deadline);
    tx = await instanceRouter.addLiquidity(
        tokenAAddress,
        tokenBAddress,
        amountA,
        amountB,
        minAmountA,
        minAmountB,
        to,
        deadline
    );

    await tx.wait();
    console.log("Liquidity added!");


    let lpTokenBalance = await pairContract.balanceOf(wallet.address);
    let reserves = await pairContract.getReserves();
    console.log(`wallet LP 代币数量: ${lpTokenBalance.toString()};`);
    console.log(`pairContract 储备量: ${reserves[0].toString()}, ${reserves[1].toString()}`);
    console.log("wallet.address : " +wallet.address)
    
    console.log( await tokenA.balanceOf(wallet) )
    console.log( await tokenB.balanceOf(wallet) )
*/
}

addLiquidity();