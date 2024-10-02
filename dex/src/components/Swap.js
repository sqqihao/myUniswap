import React, { useState, useEffect } from "react";
//页面组件
//https://ant-design.antgroup.com/components/overview-cn
import { Input, Popover, Radio, Modal, message } from "antd";
import { ethers } from "ethers";
import ABI from "../ABI"
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import tokenList from "../tokenList.json";
import { ChainId, Token, WETH9, CurrencyAmount ,TradeType,Percent} from '@uniswap/sdk-core'
import { Pair } from '@uniswap/v2-sdk'
import {Trade, Route} from '@uniswap/v2-sdk'
import {config} from "../wagmiconf.js";

// import { useSendTransaction, useWaitForTransaction } from "wagmi";
import { useAccount,useWriteContract } from 'wagmi'
import { readContract,writeContract ,simulateContract,getAccount} from '@wagmi/core'
import providerList from "../providers-list";
import {ethLinkConAddr,UniswapRouterConAddr} from "../conf";
// import { useConfig } from 'wagmi' 
// import { getAccount } from '@wagmi/core'
// import {publicClient} from "./swapfake"
// import { useConnectorClient } from 'wagmi'




const formatTokenAmount = (amount, decimals) => {
  // 将数字拆分成整数部分和小数部分
  const [integerPart, decimalPart = ""] = amount.split(".");

  // 组合整数和小数部分
  let combined = integerPart + decimalPart;

  // 计算需要填充的零的数量
  const paddingLength = decimals - decimalPart.length;

  // 如果需要填充零，则填充
  if (paddingLength > 0) {
    combined = combined.padEnd(combined.length + paddingLength, "0");
  } else if (paddingLength < 0) {
    // 如果小数部分长度超出，需要截取
    combined = combined.slice(0, paddingLength);
  }

  combined = combined.replace(/^0+/, "");

  console.log("amount: " + amount + ", result: " + combined);

  return combined;
};

// console.log(ChainId)
// debugger;
function Swap(props) {
  const [messageApi, contextHolder] = message.useMessage();
  const [slippage, setSlippage] = useState(2.5);
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  const [isOpen, setIsOpen] = useState(false);
  const [changeToken, setChangeToken] = useState(1);
  const [prices, setPrices] = useState(null);

  const { address } = getAccount(config)
  // const [account, setAccount] = useState(null);
  const [txDetails, setTxDetails] = useState({
    to:null,
    data: null,
    value: null,
  }); 
  // const { writeContract } = useWriteContract();
  // const { readContract } = useReadContract();

  // const account = address; //getAccount(config).address;
  

  const {data, sendTransaction} = {};
  // useSendTransaction({
  //   request: {
  //     from: address,
  //     to: String(txDetails.to),
  //     data: String(txDetails.data),
  //     value: String(txDetails.value),
  //   }
  // })

  const { isLoading, isSuccess } = {};
  // useWaitForTransaction({
  //   hash: data?.hash,
  // })

  function handleSlippageChange(e) {
    setSlippage(e.target.value);
  }

  function changeAmount(e) {
    setTokenOneAmount(e.target.value);
    if(e.target.value && prices){
      setTokenTwoAmount((e.target.value * prices.ratio).toFixed(2))
    }else{
      setTokenTwoAmount(null);
    }
  }

  function switchTokens() {
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    const one = tokenOne;
    const two = tokenTwo;
    setTokenOne(two);
    setTokenTwo(one);
    fetchPrices(two, one);
  }

  function openModal(asset) {
    setChangeToken(asset);
    setIsOpen(true);
  }

  function modifyToken(i){
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    if (changeToken === 1) {
      setTokenOne(tokenList[i]);
      fetchPrices(tokenList[i], tokenTwo)
    } else {
      setTokenTwo(tokenList[i]);
      fetchPrices(tokenOne, tokenList[i])
    }
    setIsOpen(false);
  }

  async function createPair(one, two){
    const pairAddress = Pair.getAddress(one, two);

    // Setup provider, import necessary ABI ...
    const provider = new ethers.providers.JsonRpcProvider(providerList.LOCAL);
    // debugger;
    const pairContract = new ethers.Contract(pairAddress, ABI.uniswapV2poolABI, provider);

    // console.log(pairContract)
    
    const reserves = await pairContract["getReserves"]()
    const [reserve0, reserve1] = reserves;
    // console.log(reserves)

    const tokens = [one, two];
    const [token0, token1] = tokens[0].sortsBefore(tokens[1]) ? tokens : [tokens[1], tokens[0]]

    const pair = new Pair(CurrencyAmount.fromRawAmount(token0, reserve0), CurrencyAmount.fromRawAmount(token1, reserve1))
    // console.log(pair);
    return pair
  }

  async function fetchPrices(one, two){
    // debugger;
    // if(fetchPrices.isLoading==true)return;
      // debugger;
      // debugger;
      /*
      const tokenOneToken = new Token(ChainId.MAINNET, one.address, one.decimals);
      const tokenTwoToken = new Token(ChainId.MAINNET, two.address, two.decimals)
      const pair = await createPair(tokenOneToken,tokenTwoToken);
      // debugger;
      const route = new Route([pair], tokenOneToken, tokenTwoToken);

      console.log(route.midPrice.toSignificant(6)) // 1901.08
      console.log(route.midPrice.invert().toSignificant(6)) // 0.000526017

      const tokenOnePriceScale = route.midPrice.toSignificant(6);
      const tokenTwoPriceScale = route.midPrice.invert().toSignificant(6);
      // const res = await axios.get(`http://localhost:3001/tokenPrice`, {
      //   params: {addressOne: one, addressTwo: two}
      // })

      // {
      //   tokenOne:111,
      //   tokenTwo:222,
      //   ratio:0.5
      // }
      */
      // console.log([one.address, two.address])
      // console.log(config)
      // debugger;
      const result = await readContract(config,{
        abi:ABI.UniswapV2Router02ABI,
        //Uniswap V2: Router 2
        address: UniswapRouterConAddr,//"0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",//'0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        functionName: 'getRes',
        args: [
          one.address,
          two.address
        ]
      });

      console.log(result)

      const tokenOnePriceScale = (1/parseFloat(result))

      // const tokenOnePriceScale = 2;
      const res = {
        tokenOne:0,//tokenOnePriceScale,//不传也行
        tokenTwo:0,//tokenTwoPriceScale,//不传也行
        ratio:tokenOnePriceScale//只需要一个ratio scale即可
      }

      
      setPrices(res)
      // fetchPrices.isLoading=false;
  }

  async function approveToken(tokenAddress, amount) {
    console.log(
      "approve token called, token: " + tokenAddress + " with amount: " + amount
    );
    const tokenABI = [
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "value", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];
    return writeContract(config,
      {
        address: tokenAddress,
        abi: tokenABI,
        functionName: "approve",
        args: [UniswapRouterConAddr, amount],
      },
      {
        onSuccess: (tx) => {
          messageApi.info("Transaction is successful!" + tx.hash);
          setTxDetails({
            to: tx.to,
            data: tx.data,
            value: tx.value,
          });
        },
        onError: (error) => {
          console.log("🚀 ~ fetchDexSwap ~ error:", error.message);
          messageApi.error(error.shortMessage);
        },
      }
    );
  }

  async function fetchDexSwap(ABI,one,two, tokenOneAmount,slippage){
    // const userAddress = String(account);
    //
    // debugger;
    /*
  */
  /*
    const tokenOneToken = new Token(ChainId.MAINNET, one.address, one.decimals);
    const tokenTwoToken = new Token(ChainId.MAINNET, two.address, two.decimals)

    // See the Fetching Data guide to learn how to get Pair data
    // const pair = await createPair(tokenOneToken, tokenTwoToken)


    const pair = new Pair(
      CurrencyAmount.fromRawAmount(
        tokenOneToken,
        formatTokenAmount(tokenOneAmount, one.decimals)
      ),
      CurrencyAmount.fromRawAmount(
        tokenTwoToken,
        formatTokenAmount(tokenTwoAmount, two.decimals)
      )
    );

    const route = new Route([pair],tokenOneToken, tokenTwoToken)

    const amountIn = formatTokenAmount(tokenOneAmount, tokenOne.decimals); // 1 WETH

    const trade = new Trade(
      route, 
      CurrencyAmount.fromRawAmount(tokenOneToken, amountIn),
      TradeType.EXACT_INPUT
    );
    //设置滑点
    // const slippageTolerance = new Percent(, '10000') // 50 bips, or 0.50%
    const slippageTolerance = new Percent(slippage*100, '10000') // 50 bips, or 0.50%
    // const amountOutMin = trade.minimumAmountOut(slippageTolerance).toExact() ;// needs to be converted to e.g. decimal string
    const amountOutMin = "1";
    const tokenTwoOut = (
      (Number(tokenTwoAmount) * (100 - slippage)) / 100
    ).toString();
*/
    //formatTokenAmount(tokenTwoOut, tokenTwo.decimals);

    const path = [one.address, two.address];
    // const to = '' // should be a checksummed recipient address
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
    // const value = trade.inputAmount.toExact(); // // needs to be converted to e.g. decimal string

    // await approveToken(tokenOneToken.address, amountIn);

    // debugger;
    // console.log(publicClient)
    const sendData = [
        tokenOneAmount, 
        //不计算滑，直接换
        1,
        path,
        address,
        deadline
      ];
    console.log(sendData);


    writeContract(config,{
      abi:ABI.UniswapV2Router02ABI,
      address: UniswapRouterConAddr,//"0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",//'0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      functionName: 'swapExactTokensForTokens',
      args: sendData
    },
    {
      onSuccess: (tx) => {
        messageApi.info("Transaction is successful!" + tx);
      },
      onError: (error) => {
        console.log("🚀 ~ fetchDexSwap ~ error:", error.message);
        messageApi.error(error.shortMessage);
      },
    });
    /*
    const hash = writeContract({
      abi:ABI.UniswapV2Router02ABI,
      address: UniswapRouterConAddr,//"0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",//'0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      functionName: 'swapExactTokensForTokens',
      args: sendData,
      // nonce:35
    });
    */
    // const hash = await writeContract(config, request);

    // console.log(hash);

    return ;


    // const allowance = await axios.get(`https://api.1inch.io/v5.0/1/approve/allowance?tokenAddress=${tokenOne.address}&walletAddress=${address}`)
  
    // if(allowance.data.allowance === "0"){

    //   const approve = await axios.get(`https://api.1inch.io/v5.0/1/approve/transaction?tokenAddress=${tokenOne.address}`)

    //   setTxDetails(approve.data);
    //   console.log("not approved")
    //   return

    // }

    // const tx = await axios.get(
    //   `https://api.1inch.io/v5.0/1/swap?fromTokenAddress=${tokenOne.address}&toTokenAddress=${tokenTwo.address}&amount=${tokenOneAmount.padEnd(tokenOne.decimals+tokenOneAmount.length, '0')}&fromAddress=${address}&slippage=${slippage}`
    // )

    // let decimals = Number(`1E${tokenTwo.decimals}`)
    // setTokenTwoAmount((Number(tx.data.toTokenAmount)/decimals).toFixed(2));

    // setTxDetails(tx.data.tx);
  
  }


  useEffect(()=>{

    fetchPrices(tokenList[0], tokenList[1])

  }, [])

  useEffect(()=>{

      if(txDetails.to){
        sendTransaction();
      }
  }, [txDetails])

  useEffect(()=>{

    messageApi.destroy();

    if(isLoading){
      messageApi.open({
        type: 'loading',
        content: 'Transaction is Pending...',
        duration: 0,
      })
    }    

  },[isLoading])

  useEffect(()=>{
    messageApi.destroy();
    if(isSuccess){
      messageApi.open({
        type: 'success',
        content: 'Transaction Successful',
        duration: 1.5,
      })
    }else if(txDetails.to){
      messageApi.open({
        type: 'error',
        content: 'Transaction Failed',
        duration: 1.50,
      })
    }


  },[isSuccess])


  const settings = (
    <>
      <div>Slippage Tolerance</div>
      <div>
        <Radio.Group value={slippage} onChange={handleSlippageChange}>
          <Radio.Button value={0.5}>0.5%</Radio.Button>
          <Radio.Button value={2.5}>2.5%</Radio.Button>
          <Radio.Button value={5}>5.0%</Radio.Button>
        </Radio.Group>
      </div>
    </>
  );

  return (
    <>
      {contextHolder}
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a token"
      >
        <div className="modalContent">
          {tokenList?.map((e, i) => {
            return (
              <div
                className="tokenChoice"
                key={i}
                onClick={() => modifyToken(i)}
              >
                <img src={e.img} alt={e.ticker} className="tokenLogo" />
                <div className="tokenChoiceNames">
                  <div className="tokenName">{e.name}</div>
                  <div className="tokenTicker">{e.ticker}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
      <div className="tradeBox">
        <div className="tradeBoxHeader">
          <h4>Swap</h4>
          <Popover
            content={settings}
            title="Settings"
            trigger="click"
            placement="bottomRight"
          >
            <SettingOutlined className="cog" />
          </Popover>
        </div>
        <div className="inputs">
          <Input
            placeholder="0"
            value={tokenOneAmount}
            onChange={changeAmount}
            disabled={!prices}
          />
          <Input placeholder="0" value={tokenTwoAmount} disabled={true} />
          <div className="switchButton" onClick={switchTokens}>
            <ArrowDownOutlined className="switchArrow" />
          </div>
          <div className="assetOne" onClick={() => openModal(1)}>
            <img src={tokenOne.img} alt="assetOneLogo" className="assetLogo" />
            {tokenOne.ticker}
            <DownOutlined />
          </div>
          <div className="assetTwo" onClick={() => openModal(2)}>
            <img src={tokenTwo.img} alt="assetOneLogo" className="assetLogo" />
            {tokenTwo.ticker}
            <DownOutlined />
          </div>
        </div>
        <div className="swapButton" disabled={!tokenOneAmount} onClick={()=>{fetchDexSwap(ABI,tokenOne,tokenTwo,tokenOneAmount,slippage)}}>Swap</div>
      </div>
    </>
  );
}

export default Swap;
