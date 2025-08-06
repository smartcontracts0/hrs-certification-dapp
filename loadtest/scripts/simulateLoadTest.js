// scripts/simulateLoadTest.js
const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer, manufacturer, cab1] = await ethers.getSigners();

  const Registration = await ethers.getContractFactory("Registration");
  const Bidding = await ethers.getContractFactory("BiddingContract");
  const Accreditation = await ethers.getContractFactory("EquipmentAccreditation");
  const Certification = await ethers.getContractFactory("EquipmentCertification");

  const registration = await Registration.deploy();
  await registration.deployed();
  console.log("Registration deployed to:", registration.address);

  const bidding = await Bidding.deploy(registration.address);
  await bidding.deployed();
  console.log("Bidding deployed to:", bidding.address);

  const accreditation = await Accreditation.deploy(bidding.address);
  await accreditation.deployed();
  console.log("Accreditation deployed to:", accreditation.address);

  const certification = await Certification.deploy(
    registration.address,
    accreditation.address
  );
  await certification.deployed();
  console.log("Certification deployed to:", certification.address);

  await registration.connect(deployer).registerManufacturer(manufacturer.address);
  await registration.connect(deployer).registerCAB("CAB1", cab1.address);
  await registration.connect(cab1).updateCABDetails("QmTzQ1NsxztTGusvxno7Qh7gXXJ63LJYULS7LuVkgLRZPh");
  await registration.connect(deployer).accreditCAB(cab1.address, true);

  const results = [];
  const NUM = 100;
  const ipfs = "QmTzQ1NsxztTGusvxno7Qh7gXXJ63LJYULS7LuVkgLRZPh";

  for (let i = 1; i <= NUM; i++) {
    const start = Date.now();

    await registration.connect(manufacturer).registerEquipment(i % 2, ipfs);
    await bidding.connect(manufacturer).createAuction(i);
    await bidding.connect(cab1).submitBid(i, 100 + i);
    await bidding.connect(manufacturer).selectBestBid(i, { value: 100 + i });
    await accreditation.connect(cab1).submitTestResults(i, ipfs);
    await accreditation.connect(deployer).makeAccreditationDecision(i, 1);
    await certification.connect(manufacturer).requestCertification(i, cab1.address, ipfs);
    await certification.connect(deployer).makeCertificationDecision(i, 1);

    const end = Date.now();
    results.push({ equipmentId: i, time: (end - start) / 1000 });
    console.log(`✅ Equipment ${i} certified in ${(end - start) / 1000}s`);
  }

  fs.writeFileSync("loadtest_results.json", JSON.stringify(results, null, 2));
  console.log(`\nFinished ${NUM} certifications`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
