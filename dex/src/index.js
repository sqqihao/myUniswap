import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
//通过rainbowkit导入的数据
import '@rainbow-me/rainbowkit/styles.css';
// import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
// import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';

import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider,http ,fallback} from 'wagmi';
// import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import providerList from "./providers-list";

import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import {config} from "./wagmiconf.js";


/*
const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, polygon, optimism, arbitrum, base, bnbChain,localChain],
  ssr: true, // If your dApp uses server side rendering (SSR)

  transports: {
    [localhost.id]:   http("http://localhost:8545")
  },
  //transports:{
    // [mainnet.id]: http(providerList.ALCHEMY)//本地就不走了
    //[mainnet.id]: http(providerList.LOCAL)
  //}

  // transports: [
  //   jsonRpcProvider({
  //     rpc: (chain) => {
  //       if (chain.id === 1) {
  //         // 1 是以太坊主网的 Chain ID
  //         return {
  //           http: `https://mainnet.infura.io/v3/92936b57a77c4b238dd4193b5b2cb62f`,
  //         };
  //       }
  //       return null; // 如果不是主网，不定义任何其他 transports
  //     },
  //   }),
  // ]
});
*/
// console.log("mainnet id is " +mainnet.id);

const queryClient = new QueryClient();


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>

  <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <BrowserRouter>
              <App />
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
