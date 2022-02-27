// функция для запуска контракта
const hre = require('hardhat');

async function main() {
    
    const [signer] = await hre.ethers.getSigners(); //получение первого аккаунта из созданных hardhat

    const Donations = await hre.ethers.getContractFactory("Donations", signer); // получение контракта
    const donations = await Donations.deploy(); // исполнение контракта

    await donations.deployed(); // ожидание развертки контракта

    console.log("Contract address: ", donations.address); // выводит адрес контракта
  }
  
  main() // это нужно для асинхронности
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });