// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Registration.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./EquipmentAccreditation.sol";
import "./CommonsLibrary.sol";

contract EquipmentCertification is Ownable(msg.sender) {
    using CommonsLibrary for CommonsLibrary.Status;

    Registration registration;
    EquipmentAccreditation accreditation;

    struct CertificationRequest {
        uint256 equipmentId;
        address manufacturer;
        address cab;
        CommonsLibrary.Status certificationStatus;
        string ipfsHash;
        bool exists;
        bool isRevoked;
        string updatedIpfsHash;
    }

    struct AuditEntry {
        address auditor;
        string ipfsHash;
        uint256 timestamp;
    }

    mapping(uint256 => CertificationRequest) public certificationRequests;
    mapping(uint256 => AuditEntry[]) public auditLogs;

    event CertificationRequestCreated(uint256 equipmentId, address manufacturer, address cab, string ipfsHash);
    event CertificationDecisionMade(uint256 equipmentId, CommonsLibrary.Status decision);
    event CertificationRevoked(uint256 equipmentId, address revokedBy, uint256 timestamp);
    event CertificationUpdated(uint256 equipmentId, string newIpfsHash, uint256 timestamp);
    event CertificationDecisionUpdated(uint256 equipmentId, CommonsLibrary.Status decision, uint256 timestamp);
    event AuditReportSubmitted(uint256 equipmentId, address auditor, string ipfsHash, uint256 timestamp);

    constructor(address registrationAddress, address equipmentAccreditation) {
        registration = Registration(registrationAddress);
        accreditation = EquipmentAccreditation(equipmentAccreditation);
    }

    modifier onlyManufacturer(uint256 _equipmentId) {
        (, address manufacturer, , ) = registration.getEquipmentDetails(_equipmentId);
        require(manufacturer == msg.sender, "Only the manufacturer can perform this action");
        _;
    }

    modifier onlyRegisteredCAB() {
        require(registration.registeredCABs(msg.sender), "Only registered CABs can perform this action");
        _;
    }

    function requestCertification(uint256 _equipmentId, address _cab, string memory _ipfsHash) public onlyManufacturer(_equipmentId) {
        require(bytes(_ipfsHash).length == 46, "Invalid IPFS hash length");
        require(!certificationRequests[_equipmentId].exists, "Certification request already exists");
        require(registration.registeredCABs(_cab), "CAB is not registered");

        (, , , , bool accredited) = registration.getCABDetails(_cab);
        (, address winningCAB, , ) = accreditation.getTestResultDetails(_equipmentId);
        (, , , CommonsLibrary.Status testStatus) = accreditation.getTestResultDetails(_equipmentId);
        require(testStatus == CommonsLibrary.Status.Approved, "Test result not approved");
        require(accredited, "CAB is not accredited");
        require(winningCAB == _cab, "This is not the CAB that tested this equipment");



        certificationRequests[_equipmentId] = CertificationRequest({
            equipmentId: _equipmentId,
            manufacturer: msg.sender,
            cab: _cab,
            certificationStatus: CommonsLibrary.Status.Pending,
            ipfsHash: _ipfsHash,
            exists: true,
            isRevoked: false,
            updatedIpfsHash: ""
        });

        emit CertificationRequestCreated(_equipmentId, msg.sender, _cab, _ipfsHash);
    }

    function makeCertificationDecision(uint256 _equipmentId, CommonsLibrary.Status decision) public onlyOwner {
        CertificationRequest storage request = certificationRequests[_equipmentId];
        (, , , CommonsLibrary.Status status) = accreditation.getTestResultDetails(_equipmentId);

        require(request.exists, "Certification request does not exist");
        require(decision == CommonsLibrary.Status.Approved || decision == CommonsLibrary.Status.Denied, "Invalid decision value");
        require(status == CommonsLibrary.Status.Approved, "This equipment is not accredited");

        request.certificationStatus = decision;

        emit CertificationDecisionMade(_equipmentId, decision);
    }

    function revokeCertification(uint256 _equipmentId) external onlyOwner {
        CertificationRequest storage request = certificationRequests[_equipmentId];
        require(request.exists, "Certification request does not exist");
        require(!request.isRevoked, "Certification is already revoked");
        require(request.certificationStatus == CommonsLibrary.Status.Approved, "Only approved certifications can be revoked");

        request.isRevoked = true;

        emit CertificationRevoked(_equipmentId, msg.sender, block.timestamp);
    }


    //Updated documentation: e.g., revised test results, compliance adjustments, new declarations, etc.
    function updateCertification(uint256 _equipmentId, string memory newIpfsHash) external onlyManufacturer(_equipmentId) {
        CertificationRequest storage request = certificationRequests[_equipmentId];
        require(request.exists, "Certification request does not exist");
        require(!request.isRevoked, "Certification is revoked");
        require(request.certificationStatus == CommonsLibrary.Status.Approved, "Only approved certifications can be updated");
        require(bytes(newIpfsHash).length == 46, "Invalid IPFS hash length");
        request.updatedIpfsHash = newIpfsHash;


        emit CertificationUpdated(_equipmentId, newIpfsHash, block.timestamp);
    }

    function confirmUpdatedCertification(uint256 _equipmentId, CommonsLibrary.Status decision) external onlyOwner {
        CertificationRequest storage request = certificationRequests[_equipmentId];
        require(bytes(request.updatedIpfsHash).length == 46, "No updated certification submitted");
        require(request.exists, "Certification request does not exist");
        require(!request.isRevoked, "Certification is revoked");

        request.certificationStatus = decision;

        emit CertificationDecisionUpdated(_equipmentId, decision, block.timestamp);
    }

    function submitAuditReport(uint256 _equipmentId, string memory ipfsHash) external {
        (, address winningCAB, , ) = accreditation.getTestResultDetails(_equipmentId);
        require(msg.sender == winningCAB, "Only the CAB that tested this equipment can audit it");

        CertificationRequest storage request = certificationRequests[_equipmentId];
        require(request.exists, "Certification request does not exist");
        require(request.certificationStatus == CommonsLibrary.Status.Approved, "Only approved certifications can be audited");

        auditLogs[_equipmentId].push(AuditEntry({
            auditor: msg.sender,
            ipfsHash: ipfsHash,
            timestamp: block.timestamp
        }));

        emit AuditReportSubmitted(_equipmentId, msg.sender, ipfsHash, block.timestamp);
    }


    function getCertificationRequestDetails(uint256 _equipmentId) public view returns (uint256, address, address, CommonsLibrary.Status, string memory, bool, string memory) {
        CertificationRequest storage request = certificationRequests[_equipmentId];
        require(request.exists, "Certification request does not exist");

        return (
            request.equipmentId,
            request.manufacturer,
            request.cab,
            request.certificationStatus,
            request.ipfsHash,
            request.isRevoked,
            request.updatedIpfsHash
        );
    }

    function getAuditLog(uint256 _equipmentId) public view returns (AuditEntry[] memory) {
        return auditLogs[_equipmentId];
    }
}
