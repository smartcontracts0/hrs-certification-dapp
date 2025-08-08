const { ethers } = require("hardhat");
const fs = require("fs");

const NUM = 100;

async function main() {
  const [deployer] = await ethers.getSigners();
  const Registration = await ethers.getContractFactory("Registration");
  const registration = await Registration.connect(deployer).deploy();
  await registration.deployed();

  const ipfs = "QmXjY6f9VcPzWZn5Yq7Uu4kDQ6Pf5zKn1tT6LvJ7e8ybHv";
  const results = [];

  for (let i = 0; i < NUM; i++) {
    const start = Date.now();
    let txCount = 0;
    let success = true;

    try {
      // Create and fund a new Manufacturer and CAB wallet
      const newManufacturer = ethers.Wallet.createRandom().connect(ethers.provider);
      const newCAB = ethers.Wallet.createRandom().connect(ethers.provider);

      await deployer.sendTransaction({
        to: newManufacturer.address,
        value: ethers.utils.parseEther("1.0")
      });
      await deployer.sendTransaction({
        to: newCAB.address,
        value: ethers.utils.parseEther("1.0")
      });

      // Register Manufacturer
      await registration.connect(deployer).registerManufacturer(newManufacturer.address); txCount++;

      // Register CAB
      await registration.connect(deployer).registerCAB(`CAB${i + 1}`, newCAB.address); txCount++;

      // Update CAB details
      await registration.connect(newCAB).updateCABDetails(ipfs); txCount++;

      // Accredit CAB
      await registration.connect(deployer).accreditCAB(newCAB.address, true); txCount++;

    } catch (error) {
      console.error(`❌ Error at iteration ${i + 1}:`, error.message);
      success = false;
    }

    const end = Date.now();
    results.push({
      iteration: i + 1,
      time: ((end - start) / 1000).toFixed(3),
      txCount,
      success
    });

    const status = success ? "✅" : "⚠️";
    console.log(`${status} Setup ${i + 1} completed with ${txCount} transactions in ${(end - start) / 1000}s`);
  }

  fs.writeFileSync("registrationTest_results.json", JSON.stringify(results, null, 2));
  console.log("\n🎯 Registration and Accreditation load test complete.");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
