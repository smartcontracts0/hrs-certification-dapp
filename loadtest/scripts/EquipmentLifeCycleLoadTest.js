const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer, manufacturer, cab1] = await ethers.getSigners();

  const Registration = await ethers.getContractFactory("Registration");
  const Bidding = await ethers.getContractFactory("BiddingContract");
  const Accreditation = await ethers.getContractFactory("EquipmentAccreditation");
  const Certification = await ethers.getContractFactory("EquipmentCertification");

  // Deploy contracts
  const registration = await Registration.connect(deployer).deploy();
  await registration.deployed();

  const bidding = await Bidding.connect(deployer).deploy(registration.address);
  await bidding.deployed();

  const accreditation = await Accreditation.connect(deployer).deploy(bidding.address);
  await accreditation.deployed();

  const certification = await Certification.connect(deployer).deploy(registration.address, accreditation.address);
  await certification.deployed();

  console.log("✅ Contracts Deployed");

  // Setup
  await registration.connect(deployer).registerManufacturer(manufacturer.address);
  await registration.connect(deployer).registerCAB("CAB1", cab1.address);
  const ipfs = "QmXjY6f9VcPzWZn5Yq7Uu4kDQ6Pf5zKn1tT6LvJ7e8ybHv";
  await registration.connect(cab1).updateCABDetails(ipfs);
  await registration.connect(deployer).accreditCAB(cab1.address, true);

  console.log("✅ Manufacturer and CAB setup complete");

  const NUM = 100;
  const results = [];

  for (let i = 0; i < NUM; i++) {
    const start = Date.now();
    let txCount = 0;
    let success = true;
    let equipmentId = null;

    try {
      const eqType = i % 2;
      await registration.connect(manufacturer).registerEquipment(eqType, ipfs); txCount++;
      equipmentId = await registration.equipmentCounter();

      await bidding.connect(manufacturer).createAuction(equipmentId); txCount++;
      await bidding.connect(cab1).submitBid(i + 1, 100 + i); txCount++;
      await bidding.connect(manufacturer).selectBestBid(i + 1, { value: 100 + i }); txCount++;

      await accreditation.connect(cab1).submitTestResults(equipmentId, ipfs); txCount++;
      await accreditation.connect(deployer).makeAccreditationDecision(equipmentId, 1); txCount++;
      await accreditation.connect(deployer).updateAccreditation(equipmentId, ipfs); txCount++;
      await accreditation.connect(deployer).confirmUpdatedAccreditation(equipmentId, 1); txCount++;
      await accreditation.connect(deployer).revokeAccreditation(equipmentId); txCount++;

      await certification.connect(manufacturer).requestCertification(equipmentId, cab1.address, ipfs); txCount++;
      await certification.connect(deployer).makeCertificationDecision(equipmentId, 1); txCount++;
      await certification.connect(manufacturer).updateCertification(equipmentId, ipfs); txCount++;
      await certification.connect(deployer).confirmUpdatedCertification(equipmentId, 1); txCount++;
      await certification.connect(cab1).submitAuditReport(equipmentId, ipfs); txCount++;
      await certification.connect(deployer).revokeCertification(equipmentId); txCount++;

    } catch (error) {
      console.error(`❌ Error at equipment ${equipmentId || i + 1}:`, error.message);
      success = false;
    }

    const end = Date.now();
    results.push({
      equipmentId: equipmentId?.toString() || `failed_${i + 1}`,
      time: ((end - start) / 1000).toFixed(3),
      txCount,
      success
    });

    const statusMsg = success ? "✅" : "⚠️";
    console.log(`${statusMsg} Equipment ${equipmentId || i + 1} completed with ${txCount} transactions in ${(end - start) / 1000}s`);
  }

  fs.writeFileSync("Equipmentloadtest_results.json", JSON.stringify(results, null, 2));
  console.log("\n🎯 Load test complete.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
