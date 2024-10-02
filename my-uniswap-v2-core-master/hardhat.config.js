require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
      compilers: [
          {
              version: "0.5.16", // 指定 0.5.x 的具体版本
              settings: {
                  optimizer: {
                      enabled: true,
                      runs: 200
                  }
              }
          },
          {
              version: "0.6.6", // 指定 0.6.x 的具体版本
              settings: {
                  optimizer: {
                      enabled: true,
                      runs: 200
                  }
              }
          },
          {
              version: "0.6.12", // 指定 0.6.x 的具体版本
              settings: {
                  optimizer: {
                      enabled: true,
                      runs: 200
                  }
              }
          }
      ]
  },
  networks: {
  	localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
  		gas: 3000000,
  	  chainId: 1337 // We set 1337 to make interacting with MetaMask simpler
    },
    // sepolia: {
    //   url: `https://eth-sepolia.g.alchemy.com/v2/`+process.env.ALCHEMY,
    //   allowUnlimitedContractSize: true,
    //   accounts: [process.env.PRIVATE_KEY]
    // }
  },

};
