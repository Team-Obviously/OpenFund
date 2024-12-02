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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const issue_model_1 = __importDefault(require("../models/issue.model"));
const repository_model_1 = __importDefault(require("../models/repository.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const dotenv_1 = __importDefault(require("dotenv"));
const donations_model_1 = __importDefault(require("../models/donations.model"));
const organisation_model_1 = __importDefault(require("../models/organisation.model"));
dotenv_1.default.config();
const dummyUsers = [
    {
        name: "User One",
        email: "user1@example.com",
        password: "password123",
        githubUsername: "user123",
        oktoDeviceToken: "device_token_1",
        oktoRefreshToken: "refresh_token_1",
        oktoAuthToken: "auth_token_1",
    },
    {
        name: "User Two",
        email: "user2@example.com",
        password: "password456",
        githubUsername: "user456",
        oktoDeviceToken: "device_token_2",
        oktoRefreshToken: "refresh_token_2",
        oktoAuthToken: "auth_token_2",
    },
];
// Repository data will be populated after creating users
let dummyRepositories;
const dummyIssues = [
    {
        title: "Fix memory leak in worker thread",
        description: "There is a memory leak when spawning multiple worker threads",
        githubIssueUrl: "https://github.com/user/awesome-project/issues/1",
        url: "https://github.com/user/awesome-project/issues/1",
        repository: "", // Will be filled with actual repository ID
        repositoryId: "",
        contributor: "",
        status: "open",
        bounty: 500,
        assignee: null,
        labels: ["bug", "high-priority"],
    },
    {
        title: "Add TypeScript types",
        description: "Need to add proper TypeScript type definitions",
        githubIssueUrl: "https://github.com/user/cool-library/issues/2",
        url: "https://github.com/user/cool-library/issues/2",
        repository: "", // Will be filled with actual repository ID
        repositoryId: "",
        contributor: "",
        status: "open",
        bounty: 300,
        assignee: null,
        labels: ["enhancement", "documentation"],
    },
];
let dummyDonations;
const dummyOrganisations = [
    {
        name: "Awesome Organization",
        description: "Organization for awesome open source projects",
        url: "https://github.com/awesome-org",
        repositories: [], // Will be filled after repository creation
        owner: "", // Will be filled with user ID
    },
    {
        name: "Cool Projects",
        description: "Organization for cool libraries and tools",
        url: "https://github.com/cool-projects",
        repositories: [],
        owner: "",
    },
];
function seedData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB
            yield mongoose_1.default.connect(process.env.MONGODB_URI);
            console.log("Connected to MongoDB");
            // Clear existing data
            yield repository_model_1.default.deleteMany({});
            yield issue_model_1.default.deleteMany({});
            yield user_model_1.default.deleteMany({});
            yield donations_model_1.default.deleteMany({});
            yield organisation_model_1.default.deleteMany({});
            console.log("Cleared existing data");
            // Insert users first
            const users = (yield user_model_1.default.insertMany(dummyUsers));
            console.log("Inserted users");
            // Create repositories with user references
            dummyRepositories = [
                {
                    name: "awesome-project",
                    description: "A really awesome open source project",
                    githubUrl: "https://github.com/user/awesome-project",
                    url: "https://github.com/user/awesome-project",
                    owner: "user123",
                    maintainer: users[0]._id,
                    stars: 1200,
                    language: "TypeScript",
                    topics: ["web", "typescript", "open-source"],
                    fundingGoal: 5000,
                    currentFunding: 2500,
                },
                {
                    name: "cool-library",
                    description: "A cool utility library",
                    githubUrl: "https://github.com/user/cool-library",
                    url: "https://github.com/user/cool-library",
                    owner: "user456",
                    maintainer: users[1]._id,
                    stars: 800,
                    language: "JavaScript",
                    topics: ["library", "javascript", "utilities"],
                    fundingGoal: 3000,
                    currentFunding: 1000,
                },
            ];
            // Insert repositories
            const repositories = (yield repository_model_1.default.insertMany(dummyRepositories));
            console.log("Inserted repositories");
            // Create and insert organizations
            const organisationsWithRefs = dummyOrganisations.map((org, index) => (Object.assign(Object.assign({}, org), { owner: users[index]._id, repositories: [repositories[index]._id] })));
            yield organisation_model_1.default.insertMany(organisationsWithRefs);
            console.log("Inserted organizations");
            // Create donations after repositories are created
            dummyDonations = [
                {
                    amount: 1000,
                    repository: repositories[0]._id,
                    donor: users[0]._id,
                    userId: users[0]._id,
                    status: "completed",
                    transactionHash: "0x123abc...",
                },
                {
                    amount: 500,
                    repository: repositories[1]._id,
                    donor: users[1]._id,
                    userId: users[1]._id,
                    status: "completed",
                    transactionHash: "0x456def...",
                },
            ];
            // Insert donations
            yield donations_model_1.default.insertMany(dummyDonations);
            console.log("Inserted donations");
            // Update issues with repository references
            const issuesWithRepos = dummyIssues.map((issue, index) => (Object.assign(Object.assign({}, issue), { repository: repositories[index]._id, repositoryId: repositories[index]._id, contributor: users[index]._id })));
            // Insert issues
            yield issue_model_1.default.insertMany(issuesWithRepos);
            console.log("Inserted issues");
            console.log("Seeding completed successfully");
            process.exit(0);
        }
        catch (error) {
            console.error("Error seeding data:", error);
            process.exit(1);
        }
    });
}
seedData();
//# sourceMappingURL=seedData.js.map