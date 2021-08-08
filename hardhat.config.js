require("@nomiclabs/hardhat-waffle");
require('dotenv').config({path: __dirname + '/.env'})
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat: {

    },
    kovan:{
      chainId: 42,
      url: `https://eth-kovan.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      gas: "auto",
      gasPrice: "auto",
      gasMultiplier: 0.2,
      accounts: {
        mnemonic: `${process.env.MNEMONIC}`,
        initialIndex: 0,
        count: 10
      },
    }
  },
  solidity: {
    version: "0.6.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  throwOnTransactionFailures: true,
  throwOnCallFailures: true

};

