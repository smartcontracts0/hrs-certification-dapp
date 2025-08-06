const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with: ${deployer.address}`);

  const Registration = await ethers.getContractFactory("Registration");
  const registration = await Registration.deploy();
  await registration.deployed();
  console.log(`Registration: ${registration.address}`);

  const Bidding = await ethers.getContractFactory("BiddingContract"); // updated name
  const bidding = await Bidding.deploy(registration.address);
  await bidding.deployed();
  console.log(`Bidding: ${bidding.address}`);

  const Accreditation = await ethers.getContractFactory("EquipmentAccreditation");
  const accreditation = await Accreditation.deploy(bidding.address);
  await accreditation.deployed();
  console.log(`Accreditation: ${accreditation.address}`);

  const Certification = await ethers.getContractFactory("EquipmentCertification");
  const certification = await Certification.deploy(registration.address, accreditation.address);
  await certification.deployed();
  console.log(`Certification: ${certification.address}`);

  // Save deployed addresses for next script
  fs.writeFileSync(
    "deployedContracts.json",
    JSON.stringify(
      {
        registration: registration.address,
        bidding: bidding.address,
        accreditation: accreditation.address,
        certification: certification.address,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
