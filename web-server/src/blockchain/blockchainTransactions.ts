import { ethers } from "ethers";
require('dotenv').config();
const contractArtifact = require('./artifacts-zk/contracts/Contract.sol/GitHubStakeContract.json');

const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
// const contractAddress = "0xae9b52cAf30f7412Fcdb3e3047402fD6947A62BC";
const contractAddress = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0"; //localhost deployment


const contractABI = contractArtifact.abi;

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

async function getWalletBalance(): Promise<string> {
    try {
        const balance = await provider.getBalance(wallet.address);
        return ethers.formatEther(balance);
    } catch (error) {
        console.error('Error getting wallet balance:', error);
        throw error;
    }
}

async function registerRepository(repoName: string): Promise<void> {
    try {
        const tx = await contract.registerRepository(repoName);
        await tx.wait();
    } catch (error) {
        console.error('Error registering repository:', error);
        throw error;
    }
}

async function donateToRepository(repoName: string, amount: string): Promise<void> {
    try {
        const tx = await contract.donateToRepository(repoName, {
            value: ethers.parseEther(amount)
        });
        await tx.wait();
    } catch (error) {
        console.error('Error donating to repository:', error);
        throw error;
    }
}

async function assignStakeToIssue(repoName: string, issueName: string, amount: string): Promise<void> {
    try {
        const tx = await contract.assignStakeToIssue(
            repoName,
            issueName,
            ethers.parseEther(amount)
        );
        await tx.wait();
    } catch (error) {
        console.error('Error assigning stake to issue:', error);
        throw error;
    }
}

async function distributeStakeToResolvers(
    repoName: string,
    issueName: string,
    resolvers: string[],
    distributions: string[]
): Promise<void> {
    try {
        const distributionsInWei = distributions.map(amount => ethers.parseEther(amount));
        
        const tx = await contract.distributeStakeToResolvers(
            repoName,
            issueName,
            resolvers,
            distributionsInWei
        );
        await tx.wait();
    } catch (error) {
        console.error('Error distributing stake:', error);
        throw error;
    }
}

export {
    getWalletBalance,
    registerRepository,
    donateToRepository,
    assignStakeToIssue,
    distributeStakeToResolvers
};


