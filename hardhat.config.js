require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require('solidity-coverage');

const DonationsArtifact = require('./artifacts/contracts/Donations.sol/Donations.json');


task("donaters", "Returns list of donaters") // выводит список жертвователей
  .addParam("address", "Address of contract")
  .setAction(async (taskArgs) => {
    const [signer] = await hre.ethers.getSigners();
    const donationsContract = new hre.ethers.Contract(
      taskArgs.address,
      DonationsArtifact.abi,
      signer
    )

  const donaters = await donationsContract.getDonaters()

  if (donaters.length > 0){
    console.log("\n------------------------------------------")
    console.log("\t      Donaters list")
    console.log("------------------------------------------\n")
    
    for (const donater of donaters){
      console.log(donater)
    }
    console.log("------------------------------------------\n")
  }
  else console.log("Donaters list is empty")
  })

task("withdraw", "Withdraws money to a certain address") // выводит деньги из контракта на определенный адрес
  .addParam("user", "Address of user")
  .addParam("contract", "Address of contract")
  .addParam("amount", "Amount of money in ETH")
  .setAction(async (taskArgs) => {
    const [signer] = await hre.ethers.getSigners();
    const donationsContract = new hre.ethers.Contract(
      taskArgs.contract,
      DonationsArtifact.abi,
      signer
    )

    await donationsContract.withdrawTo(taskArgs.user, hre.ethers.utils.parseEther(taskArgs.amount))
    console.log("Money has been successfully withdrawn!")
  })

task("donate", "Donate money") // позволяет пожертвовать деньги
  .addParam("address", "Address of contract")
  .addParam("amount", "Amount of money in ETH")
  .setAction(async (taskArgs) => {
    const [signer] = await hre.ethers.getSigners();
    const tx = {
      to: taskArgs.address,
      value: hre.ethers.utils.parseEther(taskArgs.amount)
  }

  const txSend = await signer.sendTransaction(tx);
  await txSend.wait();
  })

task("total", "Returns sum of donations by user address") // возвращает сумму пожертвований определенного пользователя
  .addParam("user", "Address of user")
  .addParam("contract", "Address of contract")
  .setAction(async (taskArgs) => {
    const [signer] = await hre.ethers.getSigners();
    const donationsContract = new hre.ethers.Contract(
      taskArgs.contract,
      DonationsArtifact.abi,
      signer
    )
    amount = await donationsContract.totalDonations(taskArgs.user);
    console.log(hre.ethers.utils.formatEther(amount),"ETH")
  })

module.exports = {
  solidity: {
    version: "0.8.4",
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
  defaultNetwork: "rinkeby",
  networks: {
    rinkeby:{
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
      accounts: [process.env.PRIVATE_KEY]
    },
    hardhat: {
      chainId: 1337
    }
  },
  plugins: ["solidity-coverage"]
};
