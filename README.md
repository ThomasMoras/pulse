# Pulse

## Introduction
Pulse is a decentralized dating application similar to Tinder. Pulse aims to enable exchanges between users while preserving their data and ensuring one unique account per user (through Proof of Personhood). 
Pulse will also allow users to prove their personal information stored in a unique SBT without revealing it using Zero knowledge proof.

## Technologies Used

### Backend
- **Node.js**: Runtime environment for executing JavaScript code server-side
- **Solidity**: Object-oriented programming language for implementing smart contracts
- **Hardhat**: Development environment for Ethereum software
- **OpenZeppelin Contracts**: Library for secure smart contract development

### Frontend
- **Next.js**: React framework for building server-rendered applications
- **React**: JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: JavaScript superset with static typing
- **Vercel**: Cloud platform for deployment
- **Shadcn/UI**: Component library for modern web applications
- **Rainbow Kit**: Wallet connection manager for Ethereum dApps
- **Lit Protocol**: Decentralized encryption protocol for secure messaging
- **Wagmi**: Collection of React Hooks for Ethereum

## Core Features

### 1. User Profile Management (SBT)
- Create and modify user profiles by connecting wallets
- Input and update personal information and interests
- IPFS-based image storage for profile pictures
- Soulbound Token (SBT) implementation for unique profile verification

### 2. Advanced User Search
- Multi-criteria filtering system
- Search by gender, interests, ratings
- Customizable filter combinations
- Real-time search results

### 3. Profile Interactions
- Like, Dislike, and Super Like functionality
- Interaction limits based on user NFT tier
- Engagement tracking and statistics
- Interactive user interface for smooth experience

### 4. Encrypted Messaging
- End-to-end encrypted conversations using Lit Protocol
- On-chain message storage
- Real-time messaging capabilities
- Message history management

### 5. Proof of Personhood Integration
- World ID integration for unique user verification
- One-time verification process
- Sybil resistance mechanism
- Secure identity management

### 6. Zero Knowledge Proofs
- Private information verification without disclosure
- ZK-proof implementation for sensitive data
- Privacy-preserving user verification
- Secure information management

### 7. NFT Subscription Tiers
- Multiple subscription levels via NFTs
- Tiered benefits system
- Premium features unlock
- NFT-based access control

### 8. Partner Program
- Dedicated partner user role
- Event creation capabilities
- NFT-gated event access
- Partner dashboard and management tools

## Security Features
- Blockchain-based transaction recording
- Smart contract security measures
- Encrypted data storage
- Secure wallet integration

## User Benefits
- Unique identity verification
- Privacy protection
- Tiered access to features
- Secure messaging
- Event participation opportunities

## Installation

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies with pnpm
pnpm install

# Set up environment variables
cp .env.example .env

# Run development server
pnpm dev

# Build the application
pnpm build

# Run linting
pnpm lint

# Run tests
pnpm test

# Format code
pnpm format

# Clean installation
pnpm clean

# Start production server
pnpm start
```
## Testing 

```bash
# Run tests
pnpm hardhat test
pnpm hardhat coverage
```

## Smart Contract Deployment

```bash
# Compile contracts
pnpm hardhat compile

# Deploy contracts local
pnpm hard scripts/deploy.ts --network localhost

# Deploy contracts base sepolia
pnpm hard scripts/deploy.ts --network base-sepolia
```

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.
