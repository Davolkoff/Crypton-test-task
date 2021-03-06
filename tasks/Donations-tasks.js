const DonationsArtifact = require('../artifacts/contracts/Donations.sol/Donations.json');


task("donaters", "Returns list of donaters")
  .addParam("contract", "Address of contract")
  .setAction(async (taskArgs) => {
    const [signer] = await hre.ethers.getSigners();
    const donationsContract = new hre.ethers.Contract(
      taskArgs.contract,
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

task("withdraw", "Withdraws money to a certain address")
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

task("donate", "Donate money")
  .addParam("contract", "Address of contract")
  .addParam("amount", "Amount of money in ETH")
  .setAction(async (taskArgs) => {
    const [signer] = await hre.ethers.getSigners();
    const tx = {
      to: taskArgs.contract,
      value: hre.ethers.utils.parseEther(taskArgs.amount)
  }

  const txSend = await signer.sendTransaction(tx);
  await txSend.wait();
  console.log("Money donated");
  })

task("total", "Returns sum of donations by user address")
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