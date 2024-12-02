# OpenFund

OpenFund is a decentralized platform that connects open-source projects with donors, enabling sustainable funding for the open-source ecosystem. The platform allows maintainers to list their projects and receive donations, while donors can discover and support promising open-source initiatives.

## Features

- **Project Funding**: Seamless donation process using cryptocurrency
- **GitHub Integration**: Direct connection with GitHub repositories and issues
- **Smart Contract Integration**: Secure and transparent fund management
- **Multi-wallet Support**: Integration with Okto SDK for wallet management
- **Project Discovery**: Browse and search open-source projects
- **Contributor Dashboard**: Track contributions and manage projects
- **Donor Dashboard**: Monitor donations and discover new projects

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Radix UI components
- React Router for navigation
- Okto SDK for wallet integration

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT authentication
- GitHub OAuth integration
- Passport.js for authentication

### Smart Contracts
- Solidity
- Hardhat for development
- zkSync for scaling
- Polygon network support

## Project Structure

The project consists of several key components:

- `web-client/`: React frontend application
- `web-server/`: Express backend server
- `contract/`: Smart contract implementation
- `contract-testing/`: Smart contract test suite
- `github-server/`: GitHub integration service
- `baml_client/`: BAML client implementation
- `src/`: Core source code
- `app_name/`: Application specific implementation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Git
- Okto Wallet
- Metamask or compatible Web3 wallet

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/openfund.git
cd openfund
```

2. Set up the web client:
```bash
cd web-client
npm install
cp .env.example .env # Configure your environment variables
npm run dev
```

3. Set up the web server:
```bash
cd ../web-server
npm install
cp .env.example .env # Configure your environment variables
npm run start
```

4. Configure environment variables:
   - MongoDB connection string
   - GitHub OAuth credentials
   - JWT secret
   - Okto SDK keys
   - Smart contract addresses

## Development

Each component can be developed independently:

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
npx hardhat compile
npx hardhat test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the terms of the license included with this software.

## Support

Please open an issue for:
- Bug reports
- Feature requests
- General questions
- Support requests
