// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract GitHubStakeContract {
    address public owner; // Contract owner for the AI bot

    struct Repository {
        uint256 totalStake;
        mapping(string => uint256) issueStakes; // Maps issue name to its assigned stake
    }

    mapping(string => Repository) public repositories; // Maps repository name to its details

    event RepositoryRegistered(string repoName);
    event DonationReceived(string repoName, uint256 amount);
    event StakeAssigned(string repoName, string issueName, uint256 amount);
    event StakeDistributed(
        string repoName,
        string issueName,
        address[] resolvers,
        uint256[] distributions
    );

    /**
     * @dev Constructor to set the deployer as the owner.
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Registers a new repository. Initializes its total stake to zero.
     * @param repoName The name of the repository.
     */
    function registerRepository(string calldata repoName) external {
        // Ensure the repository does not already exist
        require(
            repositories[repoName].totalStake == 0,
            "Repository already registered"
        );

        // Create a new Repository instance
        Repository storage newRepo = repositories[repoName];

        // Initialize total stake to zero (implicit in the mapping)
        newRepo.totalStake = 0;

        // Emit the repository registered event
        emit RepositoryRegistered(repoName);
    }

    /**
     * @dev Allows anyone to donate Ether to a repository.
     * @param repoName The name of the repository to donate to.
     */
    function donateToRepository(string calldata repoName) external payable {
        require(msg.value > 0, "Donation must be greater than zero");
        repositories[repoName].totalStake += msg.value;
        emit DonationReceived(repoName, msg.value);
    }

    /**
     * @dev Assigns a portion of the repository's total stake to an issue.
     * @param repoName The name of the repository.
     * @param issueName The name of the issue to assign stake to.
     * @param amount The amount of stake to assign.
     */
    function assignStakeToIssue(
        string calldata repoName,
        string calldata issueName,
        uint256 amount
    ) external {
        Repository storage repo = repositories[repoName];
        repo.totalStake -= amount;
        repo.issueStakes[issueName] += amount;
        emit StakeAssigned(repoName, issueName, amount);
    }

    /**
     * @dev Distributes the stake assigned to an issue among resolvers.
     * @param repoName The name of the repository.
     * @param issueName The name of the issue to distribute stake from.
     * @param resolvers The list of resolver addresses.
     * @param distributions The corresponding amounts to distribute to each resolver.
     */
    function distributeStakeToResolvers(
        string calldata repoName,
        string calldata issueName,
        address[] calldata resolvers,
        uint256[] calldata distributions
    ) external {
        require(
            resolvers.length == distributions.length,
            "Resolvers and distributions length mismatch"
        );

        Repository storage repo = repositories[repoName];
        uint256 totalAssignedStake = repo.issueStakes[issueName];
        uint256 totalDistributed = 0;

        for (uint256 i = 0; i < distributions.length; i++) {
            totalDistributed += distributions[i];
        }

        require(
            totalDistributed <= totalAssignedStake,
            "Distribution exceeds assigned stake"
        );

        repo.issueStakes[issueName] -= totalDistributed;

        for (uint256 i = 0; i < resolvers.length; i++) {
            payable(resolvers[i]).transfer(distributions[i]);
        }

        emit StakeDistributed(repoName, issueName, resolvers, distributions);
    }

    /**
     * @dev Fallback function to receive Ether directly.
     */
    receive() external payable {}
}
