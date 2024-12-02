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
exports.createRepository = exports.getRepositoriesWithIssues = exports.getRepositoryOfMaintainer = exports.getMyIssues = exports.getMyContributedRepositories = exports.donateToRepository = exports.getContributorsForRepository = exports.getMyDonatedRepositories = exports.getAllRepositories = void 0;
const utils_1 = require("../utils/utils");
const repository_model_1 = __importDefault(require("../models/repository.model"));
const donations_model_1 = __importDefault(require("../models/donations.model"));
const issue_model_1 = require("../models/issue.model");
const mongoose_1 = __importDefault(require("mongoose"));
const blockchainTransactions_1 = require("../blockchain/blockchainTransactions");
exports.getAllRepositories = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const repositories = yield repository_model_1.default.find().populate("donations");
    // Calculate total amount for each repository
    const repositoriesWithTotalAmount = repositories.map((repo) => {
        const totalAmount = (repo.donations || []).reduce((acc, donation) => {
            return acc + (donation.amount || 0);
        }, 0);
        return Object.assign(Object.assign({}, repo.toObject()), { totalAmount });
    });
    res.status(200).json({
        status: "success",
        data: {
            repositories: repositoriesWithTotalAmount,
        },
    });
}));
exports.getMyDonatedRepositories = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const repositories = yield repository_model_1.default.find().populate("donations");
    const filteredRepo = repositories.filter((repo) => {
        return repo.donations.some((donation) => donation.userId.toString() === userId);
    });
    res.status(200).json({
        status: "success",
        data: {
            repositories: filteredRepo,
        },
    });
}));
exports.getContributorsForRepository = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { repositoryId } = req.body;
    const repository = yield repository_model_1.default.findById(repositoryId);
    res.status(200).json({
        status: "success",
        data: {
            repository,
        },
    });
}));
exports.donateToRepository = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { repositoryId, userId, amount } = req.body;
    console.log(req.body);
    // Find repository and initialize donations array if it doesn't exist
    const repository = yield repository_model_1.default.findById(repositoryId);
    if (!repository) {
        return res.status(404).json({
            status: "error",
            message: "Repository not found",
        });
    }
    const donation = yield donations_model_1.default.create({
        userId,
        amount,
        repository: repositoryId,
    });
    if (!repository.donations) {
        repository.donations = [];
    }
    repository.donations.push(donation);
    yield repository.save();
    // Donate to repository on blockchain
    try {
        const tx = yield (0, blockchainTransactions_1.donateToRepository)(repository.name, String(amount));
        console.log('TX in DONATE TO REPO::: ', tx);
    }
    catch (error) {
        console.error('Error in DONATE TO REPO::: ', error);
    }
    res.status(200).json({
        status: "success",
        data: {
            repository,
            donation,
        },
    });
}));
exports.getMyContributedRepositories = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    const repositories = yield repository_model_1.default.find({
        contributors: { $in: [userId] },
    }).sort({ updatedAt: -1 });
    res.status(200).json({
        status: "success",
        data: {
            repositories,
        },
    });
}));
exports.getMyIssues = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    const issues = yield issue_model_1.Issue.find({
        contributor: userId,
    }).sort({ updatedAt: -1 });
    res.status(200).json({
        status: "success",
        data: {
            issues,
        },
    });
}));
exports.getRepositoryOfMaintainer = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { maintainerId } = req.body;
    console.log("MAINTAINER ID:::, ", maintainerId);
    const repositories = yield repository_model_1.default.find().populate("donations");
    const filteredRepo = repositories.filter((repo) => {
        return repo.maintainer.toString() === maintainerId;
    });
    res.status(200).json({
        status: "success",
        data: {
            repositories: filteredRepo,
        },
    });
}));
exports.getRepositoriesWithIssues = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { repositoryId } = req.body;
    let repository = yield repository_model_1.default.findById(repositoryId)
        .populate("issues")
        .populate("donations")
        .populate("donators");
    // Add dummy data if fields are empty
    const dummyData = {
        issues: repository.issues.length
            ? repository.issues
            : [
                {
                    issueNumber: 1,
                    title: "Sample Issue 1",
                    amount: 100,
                    status: "open",
                    creator: "dummyUser",
                    assignee: null,
                    repository: repository.name,
                    organizationName: "dummyOrg",
                    issueUrl: "https://example.com",
                    htmlUrl: "https://example.com",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    issueNumber: 2,
                    title: "Sample Issue 2",
                    amount: 200,
                    status: "open",
                    creator: "dummyUser",
                    assignee: null,
                    repository: repository.name,
                    organizationName: "dummyOrg",
                    issueUrl: "https://example.com",
                    htmlUrl: "https://example.com",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
        donations: repository.donations.length
            ? repository.donations
            : [
                {
                    _id: new mongoose_1.default.Types.ObjectId(),
                    amount: 500,
                    userId: "dummy1",
                    repository: repository._id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    _id: new mongoose_1.default.Types.ObjectId(),
                    amount: 300,
                    userId: "dummy2",
                    repository: repository._id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
        donators: repository.donators.length
            ? repository.donators
            : [
                {
                    _id: new mongoose_1.default.Types.ObjectId(),
                    name: "John Doe",
                    email: "john@example.com",
                    oktoAuthToken: "",
                    oktoRefreshToken: "",
                    oktoDeviceToken: "",
                    githubUsername: "johndoe",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    _id: new mongoose_1.default.Types.ObjectId(),
                    name: "Jane Smith",
                    email: "jane@example.com",
                    oktoAuthToken: "",
                    oktoRefreshToken: "",
                    oktoDeviceToken: "",
                    githubUsername: "janesmith",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
    };
    const responseData = Object.assign(Object.assign({}, repository.toObject()), { issues: dummyData.issues, donations: dummyData.donations, donators: dummyData.donators });
    res.status(200).json({
        status: "success",
        data: {
            repository,
        },
    });
}));
exports.createRepository = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, projectUrl, userId } = req.body;
    console.log(req.body);
    const repository = yield repository_model_1.default.create({
        name,
        url: projectUrl,
        maintainer: userId,
    });
    // Register repository on blockchain
    try {
        const tx = yield (0, blockchainTransactions_1.registerRepository)(name);
        console.log('TX in REGISTER REPO::: ', tx);
    }
    catch (error) {
        console.error('Error in REGISTER REPO::: ', error);
    }
    res.status(201).json({
        status: "success",
        data: {
            repository,
        },
    });
}));
//# sourceMappingURL=repositories.controller.js.map