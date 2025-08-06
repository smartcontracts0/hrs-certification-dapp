# Load Testing Scripts for HRS Certification DApp

This folder contains all scripts and data used to perform load testing on the HRS Certification decentralized application (DApp). The tests simulate end-to-end certification workflows, stress-testing the contract interactions to evaluate system behavior under scale.

## 🧪 What’s Included

- **Hardhat Test Scripts** (`simulateLoadTest.js`):  
  Scripts that deploy smart contracts and simulate the entire certification process for multiple equipment items.

- **loadtest_results.json**:  
  Output JSON containing execution time for each equipment certification (used for plotting performance metrics).

## 🧪 Test Workflow Simulated

For each equipment item (e.g., 100 iterations), the following steps are executed:

1. Register Equipment
2. Initiate Auction by Manufacturer
3. Submit Bid by CAB
4. Select Best Bid by Manufacturer
5. Submit Test Results by CAB
6. Approve Accreditation by IAB
7. Submit Certification Request by Manufacturer
8. Approve Certification by LCA

## 🚀 Running the Tests

Ensure your local Hardhat node is running:

```bash
npx hardhat node
```

Then execute the load test script:

```bash
npx hardhat run scripts/simulateLoadTest2.js --network localhost
```

## 📁 Folder Structure

```
loadtest/
├── scripts/
│   ├── deployAll.js
│   ├── simulateLoadTest.js│   
├── loadtest_results.json
└── README.md
```

## 🛠 Requirements

- Node.js (v18+ recommended)
- Hardhat
- Ethers.js

## 📬 Contact

For questions or contributions, reach out via the main repository:
[https://github.com/smartcontracts0/hrs-certification-dapp](https://github.com/smartcontracts0/hrs-certification-dapp)
