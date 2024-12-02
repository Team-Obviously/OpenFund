# OpenFund

OpenFund is a cutting-edge decentralized platform designed to revolutionize funding for the open-source ecosystem. By connecting open-source maintainers with donors, OpenFund ensures sustainable growth and development in the community. Donors can discover and support impactful projects, while maintainers receive the financial backing they need to innovate.

---

## 🌟 Features

- **Seamless Project Funding**: Effortlessly make donations using cryptocurrency.
- **GitHub Integration**: Link directly to GitHub repositories and manage issues.
- **Secure Smart Contracts**: Transparent fund management via blockchain.
- **Multi-Wallet Support**: Leverage the Okto SDK for smooth wallet management.
- **Project Discovery**: Explore and search for open-source initiatives.
- **Contributor Dashboard**: Manage projects and track contributions with ease.
- **Donor Dashboard**: Discover new projects and monitor donation impact.
- **AI Agent Integration**: Automate smart contract actions with natural language commands.

---

## 🛠 Tech Stack

### Frontend

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **UI Components**: Radix UI
- **Routing**: React Router
- **Wallet Integration**: Okto SDK

### Backend

- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT and GitHub OAuth (via Passport.js)
- **AI Integration**: BAML Boundary ML for intent-based smart contract execution
- **GitHub Tools**: Octokit and Probot for automation

### Smart Contracts

- **Language**: Solidity
- **Local Development**: Hardhat
- **Scaling**: zkSync
- **Blockchain Support**: Polygon network
- **Tooling**: Thirdweb for smart contract creation, deployment, and testing
- **Libraries**: Ethers.js and Chai.js for contract testing

---

## 📁 Project Structure

The project is organized into modular components:

- `web-client/`: React-based frontend application
- `web-server/`: Node.js backend server
- `contract/`: Smart contract implementations
- `contract-testing/`: Smart contract test suite
- `github-server/`: GitHub integration service
- `baml_client/`: BAML client for AI integration for independently interacting with blockchain infrastructure
- `app_name/`: GitHub bot implementation

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Git
- Okto Wallet
- MetaMask or compatible Web3 wallet

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/openfund.git
   cd openfund
   ```
2. **Set up the web client:**

   ```bash
   cd web-client
   npm install
   cp .env.example .env # Configure your environment variables
   npm run dev
   ```
3. **Set up the web server:**

   ```bash
   cd ../web-server
   npm install
   cp .env.example .env # Configure your environment variables
   npm run start
   ```
4. **Configure environment variables:**

   - MongoDB connection string
   - GitHub OAuth credentials
   - JWT secret
   - Okto SDK keys
   - Smart contract addresses

---

## 🛠 Development

Each component can be developed and tested independently:

### Web Client

```bash
cd web-client
npm run dev
```

### Web Server

```bash
cd web-server
npm run start
```

### Smart Contracts

```bash
cd contract
npm install
npx thirdweb build
npx thirdweb deploy
```

---

## 🤝 Contributing

We welcome contributions to OpenFund! Here’s how you can get started:

1. **Fork the repository**
2. **Create a feature branch:**

   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes:**

   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch:**

   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

---


## 💬 Support

For any queries, suggestions, or issues, please open an issue on GitHub. We encourage you to report:

- Bugs
- Feature requests
- General questions
- Support requests

---

Join us in empowering the open-source community through sustainable funding with OpenFund!
