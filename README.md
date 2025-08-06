# HRS Certification DApp

This repository hosts the source code for a **blockchain-based certification and traceability system** for Hydrogen Refueling Station (HRS) components. The project combines smart contracts (Solidity), decentralized storage (IPFS), and a web frontend (Next.js) to automate and secure the lifecycle of equipment registration, bidding, accreditation, and certification.

## 🔍 Overview

As hydrogen refueling infrastructure expands, the safe and transparent certification of critical components — such as compressors, tanks, and heat exchangers — becomes vital. This project provides a decentralized application (DApp) to ensure traceability, accountability, and compliance across all stakeholders:
- Equipment Manufacturers
- Conformity Assessment Bodies (CABs)
- International Accreditation Bodies (IABs)
- Local Certification Authorities (LCAs)

## 🚀 Features

- EVM-based smart contracts for:
  - Entity registration (CABs, manufacturers)
  - Equipment registration and tracking
  - Bidding mechanism to select CABs
  - Accreditation and certification management
- IPFS integration for secure, off-chain document storage
- Fully implemented UI with Next.js and React
- Deployment on Sepolia testnet
- Slither-based static analysis for smart contract security
- Cost/gas analysis and optimization

## 🧱 Smart Contracts

Located in the `/contracts/` directory:
- `Registration.sol`: Handles entity registration and CAB accreditation
- `Bidding.sol`: Manages auction-based CAB selection
- `EquipmentAccreditation.sol`: Manages test result submission and international accreditation
- `EquipmentCertification.sol`: Handles final local certification

## 🖥️ Frontend (Next.js DApp)

The frontend is implemented in the `src/` directory using:
- React & TypeScript
- TailwindCSS for styling
- Wagmi & RainbowKit for wallet connection
- Ethers.js for blockchain interactions

## 🛠️ Getting Started

### Prerequisites
- Node.js >= 18
- MetaMask or compatible wallet
- Sepolia ETH (for testing)

### Install dependencies

```bash
npm install
```

### Run local development server

```bash
npm run dev
```

The DApp will be available at [http://localhost:3000](http://localhost:3000)

## 🧪 Smart Contract Deployment (Hardhat Recommended)

1. Install Hardhat:
```bash
npm install --save-dev hardhat
```

2. Compile contracts:
```bash
npx hardhat compile
```

3. Deploy to Sepolia:
Update deployment script and `.env` for keys, then run:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## 🔐 Security & Audits

- Static analysis via Slither.
- Common vulnerabilities addressed: reentrancy, unchecked calls, timestamp dependence.
- See `audits/` directory for detailed results.

## 📦 Project Structure

```
contracts/               # Solidity smart contracts
src/                     # DApp frontend (Next.js)
public/                  # Static files
audits/                  # Security analysis reports
```

## 📜 License

This project is licensed under the MIT License.

## 🙌 Acknowledgments

This work is supported by Khalifa University, UAE, and is part of a broader effort to digitize safety and quality assurance in the hydrogen energy sector.

---

For further technical details, see our [research paper](https://doi.org/xx.xxxx/x.xxxx.2025.xxxxxx) (pending publication).
