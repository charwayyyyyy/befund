import { ethers } from "hardhat";

async function main() {
  const BeFund = await ethers.getContractFactory("BeFund");
  const beFund = await BeFund.deploy();
  await beFund.waitForDeployment();
  const address = await beFund.getAddress();
  console.log("BeFund deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
