const { expect } = require("chai");
const { ethers } = require("hardhat");

// combines all functions
describe("Donations contract", function () {
  let owner;
  let addr1;
  let addr2;
  let addr3;

  beforeEach(async function () {
    const Donations = await ethers.getContractFactory("Donations");
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    donations = await Donations.deploy();
    await donations.deployed();
  });

  // checks the first function from the contract constructor specifying the creator
  describe("Deployment", function () { 

    it("Should set the right owner", async function () {

      expect(await donations.getOwner()).to.equal(owner.address);
    });
  });

  // checks money transfer functions
  describe("Transactions", function (){

  beforeEach(async function () {
    const tx = {
      to: donations.address,
      value: ethers.utils.parseEther('3')
    }

  const txSend = await addr2.sendTransaction(tx);
  await txSend.wait();
  });
    it("Should give the ability to send money to a smart contract", async function () {
      
      expect(await ethers.provider.getBalance(donations.address)).to.equals(ethers.utils.parseEther('3'))
    });
  
    it("Should add information about new transactions to existing user note", async function () {
      const tx = {
        to: donations.address,
        value: ethers.utils.parseEther('3')
      }

      const txSend2 = await addr2.sendTransaction(tx);
      await txSend2.wait();
      expect(await ethers.provider.getBalance(donations.address)).to.equals(ethers.utils.parseEther('6'))
    });
  
    it("Should withdraw money from contract", async function() {
  
      const start_balance = await ethers.utils.formatEther(await ethers.provider.getBalance(addr3.address));
      await donations.withdrawTo(addr3.address, ethers.utils.parseEther('2'));
      const finish_balance = await ethers.utils.formatEther(await ethers.provider.getBalance(addr3.address));
  
      expect(finish_balance - start_balance).to.equals(2)
  
      await expect(
        donations.connect(addr1).withdrawTo(addr3.address, ethers.utils.parseEther('1'))
        ).to.be.revertedWith("Not an owner");
    });
  });
  
  // checks functions that return information from the contract
  describe("Donations functions", function () {
    beforeEach(async function () {
      const tx = {
        to: donations.address,
        value: ethers.utils.parseEther('2')
      }
      const txSend = await addr1.sendTransaction(tx);
      await txSend.wait();
  
      const tx2 = {
        to: donations.address,
        value: ethers.utils.parseEther('3')
      }
      const txSend2 = await addr1.sendTransaction(tx2);
      await txSend2.wait();
  
      const tx3 = {
        to: donations.address,
        value: ethers.utils.parseEther('3')
      }
      const txSend3 = await addr2.sendTransaction(tx3);
      await txSend3.wait();

      const tx4 = {
        to: donations.address,
        value: ethers.utils.parseEther('1')
      }
      const txSend4 = await addr3.sendTransaction(tx4);
      await txSend4.wait();
    });

    it("Should return donations amount by address", async function() {
      expect(await donations.totalDonations(addr1.address)).to.equals(ethers.utils.parseEther('5'));
    });
  
    it("Should return donaters list", async function() {

      const donaters = await donations.getDonaters();
  
      expect(donaters[0]).to.equals(addr1.address);
      expect(donaters[1]).to.equals(addr2.address);
      expect(donaters[2]).to.equals(addr3.address);
      expect(donaters.length).to.equals(3);
  
    });
  });
  
});
