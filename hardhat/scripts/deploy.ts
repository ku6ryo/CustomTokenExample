import { ethers } from "hardhat";

async function main() {
  // Using Hardhat network Account #0 to deploy
  const contract = await ethers.getContractFactory("RyoToken");
  const deployed = await contract.deploy(1_000_000_000);
  await deployed.deployed();
  console.log(await deployed.balanceOf(await deployed.signer.getAddress()))
  console.log("DEPLOYED CONTRACT ADDRESS: ", deployed.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
