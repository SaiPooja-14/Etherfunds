// Deploy script for Sepolia testnet
const hre = require("hardhat");

async function main() {
  console.log("Deploying EtherFund to Sepolia testnet...");

  // We get the contract to deploy
  const EtherFund = await hre.ethers.getContractFactory("EtherFund");
  const etherFund = await EtherFund.deploy();

  await etherFund.deployed();

  console.log("EtherFund deployed to:", etherFund.address);
  console.log("Add this address to your .env file as REACT_APP_CONTRACT_ADDRESS");
  console.log("\nWaiting for block confirmations...");
  
  // Wait for a few block confirmations
  await etherFund.deployTransaction.wait(5);
  
  console.log("Contract deployed and confirmed!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });