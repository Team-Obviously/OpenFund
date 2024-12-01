import mongoose from "mongoose";
import Issue from "../models/issue.model";
import Repository from "../models/repository.model";
import User from "../models/user.model";
import dotenv from "dotenv";
import { Document } from "mongoose";
import Donation from "../models/donations.model";

dotenv.config();

// Define interfaces for our data structures
interface DummyUser {
  name: string;
  email: string;
  password: string;
  githubUsername: string;
  oktoDeviceToken: string;
  oktoRefreshToken: string;
  oktoAuthToken: string;
}

interface DummyRepository {
  name: string;
  description: string;
  githubUrl: string;
  url: string;
  owner: string;
  maintainer: mongoose.Types.ObjectId;
  stars: number;
  language: string;
  topics: string[];
  fundingGoal: number;
  currentFunding: number;
}

interface DummyIssue {
  title: string;
  description: string;
  githubIssueUrl: string;
  url: string;
  repository: mongoose.Types.ObjectId | string;
  repositoryId: mongoose.Types.ObjectId;
  contributor: mongoose.Types.ObjectId;
  status: "open" | "closed";
  bounty: number;
  assignee: string | null;
  labels: string[];
}

interface DummyDonation {
  amount: number;
  repository: mongoose.Types.ObjectId;
  donor: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  status: "pending" | "completed" | "failed";
  transactionHash?: string;
}

interface UserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  // ... other user fields if needed
}

interface RepositoryDocument extends Document {
  _id: mongoose.Types.ObjectId;
}

const dummyUsers: DummyUser[] = [
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
let dummyRepositories: DummyRepository[];
const dummyIssues: DummyIssue[] = [
  {
    title: "Fix memory leak in worker thread",
    description: "There is a memory leak when spawning multiple worker threads",
    githubIssueUrl: "https://github.com/user/awesome-project/issues/1",
    url: "https://github.com/user/awesome-project/issues/1",
    repository: "", // Will be filled with actual repository ID
    repositoryId: "" as unknown as mongoose.Types.ObjectId,
    contributor: "" as unknown as mongoose.Types.ObjectId,
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
    repositoryId: "" as unknown as mongoose.Types.ObjectId,
    contributor: "" as unknown as mongoose.Types.ObjectId,
    status: "open",
    bounty: 300,
    assignee: null,
    labels: ["enhancement", "documentation"],
  },
];

let dummyDonations: DummyDonation[];

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Repository.deleteMany({});
    await Issue.deleteMany({});
    await User.deleteMany({});
    await Donation.deleteMany({});
    console.log("Cleared existing data");

    // Insert users first
    const users = (await User.insertMany(dummyUsers)) as UserDocument[];
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
    const repositories = (await Repository.insertMany(
      dummyRepositories
    )) as RepositoryDocument[];
    console.log("Inserted repositories");

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
    await Donation.insertMany(dummyDonations);
    console.log("Inserted donations");

    // Update issues with repository references
    const issuesWithRepos = dummyIssues.map((issue, index) => ({
      ...issue,
      repository: repositories[index]._id,
      repositoryId: repositories[index]._id,
      contributor: users[index]._id,
    }));

    // Insert issues
    await Issue.insertMany(issuesWithRepos);
    console.log("Inserted issues");

    console.log("Seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
