const { ethers } = require("hardhat");

describe("Gas Usage Suite", function () {
  let registration, bidding, accreditation, certification;
  let deployer, manufacturer, cab;

  before(async () => {
    [deployer, manufacturer, cab] = await ethers.getSigners();

    const Registration = await ethers.getContractFactory("Registration");
    registration = await Registration.deploy();
    await registration.deployed();

    const Bidding = await ethers.getContractFactory("BiddingContract");
    bidding = await Bidding.deploy(registration.address);
    await bidding.deployed();

    const Accreditation = await ethers.getContractFactory("EquipmentAccreditation");
    accreditation = await Accreditation.deploy(bidding.address);
    await accreditation.deployed();

    const Certification = await ethers.getContractFactory("EquipmentCertification");
    certification = await Certification.deploy(
      registration.address,
      accreditation.address
    );
    await certification.deployed();
  });

  it("Register Manufacturer & CAB", async () => {
    await registration.connect(deployer).registerManufacturer(manufacturer.address);
    await registration.connect(deployer).registerCAB("CAB1", cab.address);
    await registration.connect(cab).updateCABDetails("QmTzQ1NsxztTGusvxno7Qh7gXXJ63LJYULS7LuVkgLRZPh");
    await registration.connect(deployer).accreditCAB(cab.address, true);

    await registration.getCABDetails(cab.address);
  });

  it("Simulate full certification flow (All Functions)", async () => {
    const ipfs = "QmTzQ1NsxztTGusvxno7Qh7gXXJ63LJYULS7LuVkgLRZPh";

    // Registration
    await registration.connect(manufacturer).registerEquipment(0, ipfs);
    const equipmentId = await registration.equipmentCounter();
    await registration.getEquipmentDetails(equipmentId);

    // Bidding
    await bidding.connect(manufacturer).createAuction(equipmentId);
    await bidding.connect(cab).submitBid(1, 100);
    await bidding.connect(manufacturer).selectBestBid(1, { value: 100 });

    await bidding.getBidDetails(1, 1);
    await bidding.getAuctionDetails(1);
    await bidding.getWinningCAB(equipmentId);

    // Accreditation
    await accreditation.connect(cab).submitTestResults(equipmentId, ipfs);
    await accreditation.connect(deployer).makeAccreditationDecision(equipmentId, 1);
    await accreditation.connect(deployer).updateAccreditation(equipmentId, ipfs);
    await accreditation.connect(deployer).confirmUpdatedAccreditation(equipmentId, 1);
    await accreditation.getTestResultDetails(equipmentId);

    // Certification
    await certification.connect(manufacturer).requestCertification(equipmentId, cab.address, ipfs);
    await certification.connect(deployer).makeCertificationDecision(equipmentId, 1);
    await certification.connect(manufacturer).updateCertification(equipmentId, ipfs);
    await certification.connect(deployer).confirmUpdatedCertification(equipmentId, 1);
    await certification.connect(cab).submitAuditReport(equipmentId, ipfs);
    await certification.connect(deployer).revokeCertification(equipmentId);
    await certification.getCertificationRequestDetails(equipmentId);
    await certification.getAuditLog(equipmentId);
  });
});
