# HRS Certification DApp

This repository hosts the complete decentralized application (DApp) for managing the certification lifecycle of Hydrogen Refueling Station (HRS) components. The system is implemented using Ethereum smart contracts (Solidity), a modern web frontend (Next.js), and decentralized storage via IPFS.

## 🔍 Overview

The DApp enables transparent, role-based interaction between stakeholders in the certification process:

- **Manufacturers**: Register equipment, initiate auctions, and request certifications.
- **Conformity Assessment Bodies (CABs)**: Bid on auctions, submit test results, and upload audit records.
- **International Accreditation Body (IAB)**: Registers and accredits CABs and manufacturers, and manages test result review.
- **Local Certification Authority (LCA)**: Reviews submitted test results and makes certification decisions based on audit data.

## 🚀 Features

- Role-based dashboards (dynamic routing based on connected wallet and smart contract role detection)
- Certification lifecycle including registration, bidding, testing, auditing, accreditation, and certification
- IPFS integration for off-chain document storage (e.g., equipment data, test results, audit reports)
- Ethers.js & Wagmi for blockchain interaction
- Full compatibility with MetaMask on the Sepolia testnet
- CAB bidding and manufacturer auction flows
- Audit review mechanism for the LCA

## 🧱 Smart Contracts

The smart contracts are found in the `contracts/` directory:

- `Registration.sol`: Manages manufacturer and CAB registration, and CAB accreditation
- `Bidding.sol`: Handles auction creation and bidding by CABs
- `EquipmentAccreditation.sol`: Accepts test results from winning CABs and handles IAB accreditation
- `EquipmentCertification.sol`: Handles certification decisions and audit submission by CABs

All contracts have been flattened and audited using Slither. See the `audits/` directory for the full report.

## 📂 Directory Structure

```
hrs-dapp/
├── contracts/                 # Solidity contracts
├── audits/                   # Slither vulnerability report (PDF)
├── remix-scenarios/          # Remix IDE testing scenario (scenario.json)
├── src/                      # DApp frontend
│   ├── app/                  # Route-specific dashboards and logic
│   ├── components/           # Reusable UI components (Tabs, Shell, Layout)
│   ├── hooks/                # Wallet role detection
│   └── lib/contracts/        # ABIs and deployed contract addresses
├── public/                   # Static files
└── README.md                 # You're here
```

## 🧪 Setup & Deployment

### Prerequisites

- Node.js ≥ 18
- MetaMask installed in your browser
- Sepolia ETH for testing
- Git

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Then open: [http://localhost:3000](http://localhost:3000)

### Compile & Deploy Contracts (Optional)

```bash
npm install --save-dev hardhat
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

Update addresses and ABIs in `src/lib/contracts/` after deployment.

## 🔐 Security

- Slither-based static analysis performed on all contracts
- Key issues such as reentrancy, access control, and input validation have been addressed
- Report: `audits/VulnerabilityReport.pdf`

## 🧾 Additional Artifacts

- **Remix Scenario**: `remix-scenarios/scenario.json` includes annotated tests for manual contract interaction.
- **Audit Logs**: Accessible through the UI for LCA role.

## 📝 License

MIT License

## 📣 Acknowledgments

This work is part of a research project at **Khalifa University**, UAE, focusing on digitized certification and traceability in hydrogen infrastructure.

