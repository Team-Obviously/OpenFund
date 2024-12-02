"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletBalance = getWalletBalance;
exports.registerRepository = registerRepository;
exports.donateToRepository = donateToRepository;
exports.assignStakeToIssue = assignStakeToIssue;
exports.distributeStakeToResolvers = distributeStakeToResolvers;
const ethers_1 = require("ethers");
require('dotenv').config();
const contractArtifact = require('./artifacts-zk/contracts/Contract.sol/GitHubStakeContract.json');
const provider = new ethers_1.ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology");
const wallet = new ethers_1.ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = "0xae9b52cAf30f7412Fcdb3e3047402fD6947A62BC";
// const contractAddress = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0"; //localhost deployment
const contractABI = contractArtifact.abi;
const contract = new ethers_1.ethers.Contract(contractAddress, contractABI, wallet);
function getWalletBalance() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const balance = yield provider.getBalance(wallet.address);
            return ethers_1.ethers.formatEther(balance);
        }
        catch (error) {
            console.error('Error getting wallet balance:', error);
            throw error;
        }
    });
}
function registerRepository(repoName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tx = yield contract.registerRepository(repoName);
            yield tx.wait();
            return tx;
        }
        catch (error) {
            console.error('Error registering repository:', error);
            throw error;
        }
    });
}
function donateToRepository(repoName, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tx = yield contract.donateToRepository(repoName, {
                value: ethers_1.ethers.parseEther(amount)
            });
            yield tx.wait();
            return tx;
        }
        catch (error) {
            console.error('Error donating to repository:', error);
            throw error;
        }
    });
}
function assignStakeToIssue(repoName, issueName, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tx = yield contract.assignStakeToIssue(repoName, issueName, ethers_1.ethers.parseEther(amount));
            yield tx.wait();
            return tx;
        }
        catch (error) {
            console.error('Error assigning stake to issue:', error);
            throw error;
        }
    });
}
function distributeStakeToResolvers(repoName, issueName, resolvers, distributions) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const distributionsInWei = distributions.map(amount => ethers_1.ethers.parseEther(amount));
            const tx = yield contract.distributeStakeToResolvers(repoName, issueName, resolvers, distributionsInWei);
            yield tx.wait();
            return tx;
        }
        catch (error) {
            console.error('Error distributing stake:', error);
            throw error;
        }
    });
}
//# sourceMappingURL=blockchainTransactions.js.map