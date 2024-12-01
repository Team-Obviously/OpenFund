const { ethers } = require("hardhat");

async function main() {
    // Get signers (accounts)
    const [owner, user1, user2, user3] = await ethers.getSigners();

    // Deploy the contract
    const RepositoryStakeContract = await ethers.getContractFactory("RepositoryStakeContract");
    const repositoryStakeContract = await RepositoryStakeContract.deploy();
    await repositoryStakeContract.waitForDeployment();

    console.log("Contract deployed to:", await repositoryStakeContract.getAddress());
    console.log("Owner:", owner.address);

    // Test 1: Register Repository
    console.log("\n--- Test 1: Repository Registration ---");
    const registerTx = await repositoryStakeContract.connect(user1).registerRepository("blockchain-project", "johndoe");
    await registerTx.wait();
    
    const repoDetails = await repositoryStakeContract.getRepositoryDetails(0);
    console.log("Repository Details:", {
        name: repoDetails[0],
        owner: repoDetails[1],
        totalStake: repoDetails[2].toString()
    });

    // Test 2: Stake to Project
    console.log("\n--- Test 2: Project Staking ---");
    const stakeAmount = ethers.parseEther("5"); // 5 ETH
    const stakeTx = await repositoryStakeContract.connect(user1).stakeToProject(0, stakeAmount, { value: stakeAmount });
    await stakeTx.wait();

    const updatedRepoDetails = await repositoryStakeContract.getRepositoryDetails(0);
    console.log("Updated Repository Stake:", ethers.formatEther(updatedRepoDetails[2]), "ETH");

    // Test 3: Create Issue
    console.log("\n--- Test 3: Issue Creation ---");
    const issueStake = ethers.parseEther("1"); // 1 ETH for issue
    const createIssueTx = await repositoryStakeContract.connect(user1).createIssue(0, issueStake);
    await createIssueTx.wait();

    const issueDetails = await repositoryStakeContract.getIssueDetails(0, 0);
    console.log("Issue Details:", {
        stakeAmount: ethers.formatEther(issueDetails[0]),
        resolver: issueDetails[1],
        isResolved: issueDetails[2],
        fundsClaimed: issueDetails[3]
    });

    // Test 4: Solve Issue
    console.log("\n--- Test 4: Solve Issue ---");
    const solveIssueTx = await repositoryStakeContract.connect(user1).solveIssue(0, 0, user2.address);
    await solveIssueTx.wait();

    // Test 5: Distribute Funds
    console.log("\n--- Test 5: Distribute Funds ---");
    // Get initial balance
    const initialBalance = await ethers.provider.getBalance(user2.address);
    console.log("Initial Balance:", ethers.formatEther(initialBalance), "ETH");

    // Distribute funds
    const distributeFundsTx = await repositoryStakeContract.connect(user1).distributeFunds(0, 0);
    await distributeFundsTx.wait();

    // Get final balance
    const finalBalance = await ethers.provider.getBalance(user2.address);
    console.log("Final Balance:", ethers.formatEther(finalBalance), "ETH");
    console.log("Balance Increase:", ethers.formatEther(finalBalance - initialBalance), "ETH");

    // Verify updated issue details after fund distribution
    const updatedIssueDetails = await repositoryStakeContract.getIssueDetails(0, 0);
    console.log("Updated Issue Details:", {
        stakeAmount: ethers.formatEther(updatedIssueDetails[0]),
        resolver: updatedIssueDetails[1],
        isResolved: updatedIssueDetails[2],
        fundsClaimed: updatedIssueDetails[3]
    });
}

// Error handling for the main function
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Deployment Error:", error);
        process.exit(1);
    });

module.exports = main;