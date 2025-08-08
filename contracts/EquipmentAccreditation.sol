// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Bidding.sol";
import "./CommonsLibrary.sol";

contract EquipmentAccreditation is Ownable(msg.sender) {
    using CommonsLibrary for CommonsLibrary.Status;

    BiddingContract bidding;

    struct TestResult {
        uint256 equipmentId;
        address cab;
        string ipfsHash;
        CommonsLibrary.Status accreditationStatus;
        bool exists;
        bool isRevoked;
        string updatedIpfsHash;
    }

    mapping(uint256 => TestResult) public testResults;

    event TestResultsSubmitted(uint256 equipmentId, address cab, string ipfsHash);
    event AccreditationDecisionMade(uint256 equipmentId, CommonsLibrary.Status decision);
    event AccreditationRevoked(uint256 equipmentId, address revokedBy, uint256 timestamp);
    event AccreditationUpdated(uint256 equipmentId, string newIpfsHash, uint256 timestamp);
    event AccreditationDecisionUpdated(uint256 equipmentId, CommonsLibrary.Status decision, uint256 timestamp);

    constructor(address biddingAddress) {
        bidding = BiddingContract(biddingAddress);
    }

    function submitTestResults(uint256 _equipmentId, string memory _ipfsHash) public {
        require(bytes(_ipfsHash).length == 46, "Invalid IPFS hash length");
        require(!testResults[_equipmentId].exists, "Test results already submitted");

        uint256 auctionId = bidding.equipmentToAuction(_equipmentId);
        require(auctionId != 0, "No auction found for this equipment");

        address winningCAB = bidding.getWinningCAB(auctionId);
        require(msg.sender == winningCAB, "Only the winning CAB can submit test results");

        testResults[_equipmentId] = TestResult({
            equipmentId: _equipmentId,
            cab: msg.sender,
            ipfsHash: _ipfsHash,
            accreditationStatus: CommonsLibrary.Status.Pending,
            exists: true,
            isRevoked: false,
            updatedIpfsHash: ""
        });

    emit TestResultsSubmitted(_equipmentId, msg.sender, _ipfsHash);
}


    function makeAccreditationDecision(uint256 _equipmentId, CommonsLibrary.Status decision) public onlyOwner {
        TestResult storage result = testResults[_equipmentId];
        require(result.exists, "Test results do not exist");
        require(decision == CommonsLibrary.Status.Approved || decision == CommonsLibrary.Status.Denied, "Invalid decision value");

        result.accreditationStatus = decision;

        emit AccreditationDecisionMade(_equipmentId, decision);
    }

    function revokeAccreditation(uint256 _equipmentId) external onlyOwner {
        TestResult storage result = testResults[_equipmentId];
        require(result.exists, "Test results do not exist");
        require(!result.isRevoked, "Already revoked");

        result.isRevoked = true;

        emit AccreditationRevoked(_equipmentId, msg.sender, block.timestamp);
    }

    function updateAccreditation(uint256 _equipmentId, string memory newIpfsHash) external onlyOwner {
        TestResult storage result = testResults[_equipmentId];
        require(result.exists, "Test results do not exist");
        require(!result.isRevoked, "Accreditation revoked");

        require(bytes(newIpfsHash).length == 46, "Invalid IPFS hash length");
        result.updatedIpfsHash = newIpfsHash;


        emit AccreditationUpdated(_equipmentId, newIpfsHash, block.timestamp);
    }

    function confirmUpdatedAccreditation(uint256 _equipmentId, CommonsLibrary.Status decision) external onlyOwner {
        TestResult storage result = testResults[_equipmentId];
        require(result.exists, "Test results do not exist");
        require(!result.isRevoked, "Accreditation revoked");

        result.accreditationStatus = decision;

        emit AccreditationDecisionUpdated(_equipmentId, decision, block.timestamp);
    }

    function getTestResultDetails(uint256 _equipmentId) public view returns (uint256, address, string memory, CommonsLibrary.Status) {
        TestResult storage result = testResults[_equipmentId];
        require(result.exists, "Test results do not exist");

        return (result.equipmentId, result.cab, result.ipfsHash, result.accreditationStatus);
    }
}
