const hre = require('hardhat');

async function main() {
    
    const [signer] = await hre.ethers.getSigners(); //getting the first account from the created hardhat

    const Donations = await hre.ethers.getContractFactory("Donations", signer); // getting a contract
    const donations = await Donations.deploy(); // contract execution

    await donations.deployed(); // waiting for the contract to be deployed

    console.log("Contract address: ", donations.address); // outputs the address of the contract
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });