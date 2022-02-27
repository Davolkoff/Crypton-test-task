const { expect } = require("chai");
const { ethers } = require("hardhat");

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

  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // Expect receives a value, and wraps it in an Assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      expect(await donations.getOwner()).to.equal(owner.address);
    });
  });

  describe("Transactions", function (){
    it("Should give the ability to send money to a smart contract", async function () {
      const tx = {
          to: donations.address,
          value: ethers.utils.parseEther('3')
      }
  
      const txSend = await addr2.sendTransaction(tx);
      await txSend.wait();
      expect(await ethers.provider.getBalance(donations.address)).to.equals(ethers.utils.parseEther('3'))
    });
  
    it("Should add information about new transactions to existing user note", async function () {
      const tx = {
        to: donations.address,
        value: ethers.utils.parseEther('3')
      }
  
      const txSend = await addr2.sendTransaction(tx);
      await txSend.wait();
      const txSend2 = await addr2.sendTransaction(tx);
      await txSend2.wait();
      expect(await ethers.provider.getBalance(donations.address)).to.equals(ethers.utils.parseEther('6'))
    });
  
    it("Should withdraw money from contract", async function() {
      const tx = {
        to: donations.address,
        value: ethers.utils.parseEther('3')
      }
      const txSend = await addr2.sendTransaction(tx);
      await txSend.wait();
  
      const start_balance = await ethers.utils.formatEther(await ethers.provider.getBalance(addr3.address));
      await donations.withdrawTo(addr3.address, ethers.utils.parseEther('2'));
      const finish_balance = await ethers.utils.formatEther(await ethers.provider.getBalance(addr3.address));
  
      expect(finish_balance - start_balance).to.equals(2)
  
      await expect(
        donations.connect(addr1).withdrawTo(addr3.address, ethers.utils.parseEther('1'))
        ).to.be.revertedWith("Not an owner");
    });
  });
  
  describe("Donations functions", function () {
    it("Should return donations amount by address", async function() {
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
  
      expect(await donations.totalDonations(addr1.address)).to.equals(ethers.utils.parseEther('5'));
    });
  
    it("Should return donaters list", async function() {
      const tx = {
        to: donations.address,
        value: ethers.utils.parseEther('4')
      }
      const txSend = await addr1.sendTransaction(tx);
      await txSend.wait();
  
      const tx2 = {
        to: donations.address,
        value: ethers.utils.parseEther('0.0001332')
      }
      const txSend2 = await addr2.sendTransaction(tx2);
      await txSend2.wait();
  
      const tx3 = {
        to: donations.address,
        value: ethers.utils.parseEther('0.01')
      }
      const txSend3 = await addr3.sendTransaction(tx3);
      await txSend3.wait();
  
      const donaters = await donations.getDonaters();
  
      expect(donaters[0]).to.equals(addr1.address);
      expect(donaters[1]).to.equals(addr2.address);
      expect(donaters[2]).to.equals(addr3.address);
      expect(donaters.length).to.equals(3);
  
    });
  });
  
});


// describe("Token contract", function () {
//   // Mocha has four functions that let you hook into the the test runner's
//   // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

//   // They're very useful to setup the environment for tests, and to clean it
//   // up after they run.

//   // A common pattern is to declare some variables, and assign them in the
//   // `before` and `beforeEach` callbacks.

//   let Token;
//   let hardhatToken;
//   let owner;
//   let addr1;
//   let addr2;
//   let addrs;

//   // `beforeEach` will run before each test, re-deploying the contract every
//   // time. It receives a callback, which can be async.
//   beforeEach(async function () {
//     // Get the ContractFactory and Signers here.
//     Token = await ethers.getContractFactory("Token");
//     [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

//     // To deploy our contract, we just have to call Token.deploy() and await
//     // for it to be deployed(), which happens once its transaction has been
//     // mined.
//     hardhatToken = await Token.deploy();
//   });

//   // You can nest describe calls to create subsections.
//   describe("Deployment", function () {
//     // `it` is another Mocha function. This is the one you use to define your
//     // tests. It receives the test name, and a callback function.

//     // If the callback function is async, Mocha will `await` it.
//     it("Should set the right owner", async function () {
//       // Expect receives a value, and wraps it in an Assertion object. These
//       // objects have a lot of utility methods to assert values.

//       // This test expects the owner variable stored in the contract to be equal
//       // to our Signer's owner.
//       expect(await hardhatToken.owner()).to.equal(owner.address);
//     });

//     it("Should assign the total supply of tokens to the owner", async function () {
//       const ownerBalance = await hardhatToken.balanceOf(owner.address);
//       expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
//     });
//   });

//   describe("Transactions", function () {
//     it("Should transfer tokens between accounts", async function () {
//       // Transfer 50 tokens from owner to addr1
//       await hardhatToken.transfer(addr1.address, 50);
//       const addr1Balance = await hardhatToken.balanceOf(addr1.address);
//       expect(addr1Balance).to.equal(50);

//       // Transfer 50 tokens from addr1 to addr2
//       // We use .connect(signer) to send a transaction from another account
//       await hardhatToken.connect(addr1).transfer(addr2.address, 50);
//       const addr2Balance = await hardhatToken.balanceOf(addr2.address);
//       expect(addr2Balance).to.equal(50);
//     });

//     it("Should fail if sender doesn’t have enough tokens", async function () {
//       const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

//       // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
//       // `require` will evaluate false and revert the transaction.
//       await expect(
//         hardhatToken.connect(addr1).transfer(owner.address, 1)
//       ).to.be.revertedWith("Not enough tokens");

//       // Owner balance shouldn't have changed.
//       expect(await hardhatToken.balanceOf(owner.address)).to.equal(
//         initialOwnerBalance
//       );
//     });

//     it("Should update balances after transfers", async function () {
//       const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

//       // Transfer 100 tokens from owner to addr1.
//       await hardhatToken.transfer(addr1.address, 100);

//       // Transfer another 50 tokens from owner to addr2.
//       await hardhatToken.transfer(addr2.address, 50);

//       // Check balances.
//       const finalOwnerBalance = await hardhatToken.balanceOf(owner.address);
//       expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

//       const addr1Balance = await hardhatToken.balanceOf(addr1.address);
//       expect(addr1Balance).to.equal(100);

//       const addr2Balance = await hardhatToken.balanceOf(addr2.address);
//       expect(addr2Balance).to.equal(50);
//     });
//   });
// });