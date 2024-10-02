import React from 'react';
import ABI from "../ABI";
import {config} from "../wagmiconf.js";
import {ethLinkConAddr,UniswapRouterConAddr,erc20Addr,erc20AddrB} from "../conf";
import {getBalance,getToken,getWalletClient,getTransactionCount, sendTransaction,readContract,writeContract ,simulateContract,getAccount} from '@wagmi/core'
import { parseEther } from 'viem'



function Tokens() {
  const { address } = getAccount(config)


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
          console.log(tx);
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  }



  async function getABRATIO(){

      const result = await readContract(config,{
        abi:ABI.UniswapV2Router02ABI,
        //Uniswap V2: Router 2
        address: UniswapRouterConAddr,//"0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",//'0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        functionName: 'getRes',
        args: [erc20Addr,erc20AddrB]
      });

      console.log(result);

  }



  function approv() {
  	// body...
  	approveToken(erc20Addr,parseEther('2000'))
  }

  function run(){

	console.log(address)
	const path = [erc20Addr,erc20AddrB];
	const deadline = Math.floor(Date.now() / 1000) + 60 * 20; 

	const sendData = [
		99n, 
		10n,
		path,
		address,
		deadline
	];
	console.log(sendData);

	// const to = '' // should be a checksummed recipient address

	async function trans(){
		const result = await writeContract(config,{
			abi:ABI.UniswapV2Router02ABI,
			address: UniswapRouterConAddr,
			functionName: 'swapExactTokensForTokens',
			args: sendData
		}).then(function (res) {
			console.log(res)
			// debugger;
		});
		console.log(result)
	};
	trans();
  }

  async function getbal() {
	const balance = await getBalance(config, {
	  address: erc20Addr,
	})
	console.log(balance)


  const result = await readContract(config,{
    abi:ABI.SIMPLEERC20ABI,
    address: erc20Addr,
    functionName: 'balanceOf',
    args: [
    	address
    ]
  });

  console.log(result)

  const result1 = await readContract(config,{
    abi:ABI.SIMPLEERC20ABI,
    address: erc20AddrB,
    functionName: "balanceOf",
    args: [
    	address
    ]
  });

  console.log(result1)


  }

  async function send(){

	const result = await sendTransaction(config, {
	  to: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
	  value: parseEther('200'),
	})
	console.log(result)
  }

  async function getn(){
  	const nonce = await getTransactionCount(config, {
	  address: UniswapRouterConAddr,
	})
	console.log(nonce)
  }

  async function getClient(){
  	const client = await getWalletClient(config);
  	console.log(client)

  }
  async function getTk(){
  	const tk =  await getToken(config,{
  		address:erc20Addr
  	});
  	console.log(tk)

  }

  return (
  	<div>
	    <div onClick={getABRATIO}>getABRATIO</div>
	    <div onClick={approv}>approv router </div>
	    <div onClick={run}>swapExactTokensForTokens</div>
	    <div onClick={getbal}>getbalance</div>
	    <div onClick={send}>send Eth</div>
	    <div onClick={getn}>getNonce</div>
	    <div onClick={getClient}>getClient</div>
	    <div onClick={getTk}>getTk</div>
	    
	</div>
  )
}

export default Tokens