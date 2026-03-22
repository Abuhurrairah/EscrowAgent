import { promises as fs } from "fs";
import path from "path";
import hre from "hardhat";

const { ethers } = hre;

async function main() {
  const escrowAgent = await ethers.deployContract("EscrowAgent");
  await escrowAgent.waitForDeployment();
  const address = await escrowAgent.getAddress();

  const envPath = path.join(process.cwd(), ".env.local");
  const envBody = `NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=${address}\n`;
  await fs.writeFile(envPath, envBody, "utf8");

  console.log("EscrowAgent deployed to:", address);
  console.log(".env.local updated with NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
