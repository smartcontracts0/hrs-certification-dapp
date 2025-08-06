const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const contracts = JSON.parse(fs.readFileSync("deployedContracts.json"));
  const [deployer, ...accounts] = await ethers.getSigners();

  const Registration = await ethers.getContractAt("Registration", contracts.registration);
  const Bidding = await ethers.getContractAt("BiddingContract", contracts.bidding);
  const Accreditation = await ethers.getContractAt("EquipmentAccreditation", contracts.accreditation);
  const Certification = await ethers.getContractAt("EquipmentCertification", contracts.certification);

  console.time("Total Execution Time");

  for (let i = 0; i < 100; i++) {
    const manufacturer = accounts[i % accounts.length];
    const cab = accounts[(i + 1) % accounts.length];
    const cid = "QmTzQ1NsxztTGusvxno7Qh7gXXJ63LJYULS7LuVkgLRZPh";

    // 1. Register manufacturer
    await (await Registration.connect(deployer).registerManufacturer(manufacturer.address)).wait();

    // 2. Register CAB
    await (await Registration.connect(deployer).registerCAB(`CAB_${i}`, cab.address)).wait();

    // 3. CAB updates details
    await (await Registration.connect(cab).updateCABDetails(cid)).wait();

    // 4. Accredit CAB
    await (await Registration.connect(deployer).accreditCAB(cab.address, true)).wait();

    // 5. Manufacturer registers equipment
    await (await Registration.connect(manufacturer).registerEquipment(0, cid)).wait();

    const equipmentId = await Registration.equipmentCounter();

    // 6. Create Auction
    await (await Bidding.connect(manufacturer).createAuction(equipmentId)).wait();

    // 7. Submit Bid
    await (await Bidding.connect(cab).submitBid(i + 1, 1000)).wait();

    // 8. Select Best Bid
    await (await Bidding.connect(manufacturer).selectBestBid(i + 1, { value: 1000 })).wait();

    // 9. Submit Test Results
    await (await Accreditation.connect(cab).submitTestResults(equipmentId, cid)).wait();

    // 10. Approve Accreditation
    await (await Accreditation.connect(deployer).makeAccreditationDecision(equipmentId, 1)).wait();

    // 11. Request Certification
    await (await Certification.connect(manufacturer).requestCertification(equipmentId, cab.address, cid)).wait();

    // 12. Approve Certification
    await (await Certification.connect(deployer).makeCertificationDecision(equipmentId, 1)).wait();

    // 13. Submit Audit Report
    await (await Certification.connect(cab).submitAuditReport(equipmentId, cid)).wait();

    if ((i + 1) % 10 === 0) {
      console.log(`Completed ${i + 1}/100 certifications`);
    }
  }

  console.timeEnd("Total Execution Time");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
