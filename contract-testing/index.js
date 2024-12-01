import { ethers } from 'ethers';
import { donateToRepository, registerRepository, assignStakeToIssue, distributeStakeToResolvers, getWalletBalance } from './txns.js';

async function main() {
    const repoName = 'sample-repo-v1';
    const issueName = 'issue1';
    const amount = '10';

    // donate to repo
    // const donateToRepo = await donateToRepository(repoName, amount);
    // console.log('Donated to repo:', donateToRepo);

    // register repo
    // const registerRepo = await registerRepository(repoName);
    // console.log('Registered repo:', registerRepo);

    // wallet balance
    // const balance = await getWalletBalance();
    // console.log('Wallet balance:', balance);

    // assign stake to issue
    // const assignStake = await assignStakeToIssue(repoName, issueName, '5');
    // console.log('Assigned stake to issue:', assignStake);

    // distribute stake to resolvers
    const distributeStake = await distributeStakeToResolvers(repoName, issueName, ['0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000001', '0x0000000000000000000000000000000000000002'], ['5', '5', '5']);
    console.log('Distributed stake to resolvers:', distributeStake);
}

main();