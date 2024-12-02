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
exports.closeIssue = exports.newComment = void 0;
const utils_1 = require("../utils/utils");
const sync_client_1 = require("../baml_client/sync_client");
const issue_model_1 = require("../models/issue.model");
const repository_model_1 = __importDefault(require("../models/repository.model"));
const blockchainTransactions_1 = require("../blockchain/blockchainTransactions");
const axios_1 = __importDefault(require("axios"));
const user_model_1 = __importDefault(require("../models/user.model"));
exports.newComment = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body: commentBody, issue_url, html_url, user, repository, owner, issueTitle, } = req.body;
        const response = yield sync_client_1.b.ExtractStakeComment(commentBody);
        console.log(response);
        const newIssue = new issue_model_1.Issue({
            issueNumber: response.issue_number,
            title: issueTitle,
            amount: response.amount,
            status: "open",
            creator: user.login,
            assignee: null,
            repository: repository,
            organizationName: owner,
            issueUrl: issue_url,
            htmlUrl: html_url,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        // Save the issue
        const savedIssue = yield newIssue.save();
        const updatedRepo = yield repository_model_1.default.findOneAndUpdate({
            name: repository,
        }, {
            $push: { issues: savedIssue._id },
        }, { new: true });
        if (!updatedRepo) {
            throw new Error("Repository not found");
        }
        yield axios_1.default.post("http://localhost:3002/add-labels", {
            owner: owner,
            repo: repository,
            issue_number: response.issue_number,
            labels: ["Funded"],
        });
        yield axios_1.default.post("http://localhost:3002/add-comment", {
            owner: owner,
            repo: repository,
            issue_number: response.issue_number,
            comment: "Now this issue has been funded by " + response.amount + "matic. Solve it to earn the stake!",
        });
        // assign stake to issue
        try {
            const tx = yield (0, blockchainTransactions_1.assignStakeToIssue)(repository, String(response.issue_number), String(response.amount));
        }
        catch (error) {
            console.error('Error in ASSIGN STAKE TO ISSUE::: ', error);
        }
        return res.status(200).json({
            success: true,
            message: "Issue created successfully",
            data: {
                issue: savedIssue,
                repository: updatedRepo,
            },
        });
    }
    catch (error) {
        console.error("Error in newComment:", error);
        return res.status(500).json({
            success: false,
            message: "Error processing comment",
            error: error.message,
        });
    }
}));
exports.closeIssue = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('REQUEST BODY::: ', req.body);
    const { issue, contributors, linkedPRs } = req.body;
    console.log(req.body.issue.number);
    console.log(req.body.issue.title);
    const currentIssue = yield issue_model_1.Issue.findOne({
        issueNumber: issue.number,
    });
    if (!currentIssue) {
        throw new Error("Issue not found");
    }
    currentIssue.status = "closed";
    currentIssue.assignee = contributors[0];
    yield currentIssue.save();
    // // distribute stake to resolvers
    // const tx = await distributeStakeToResolvers(repository, String(issue.number), contributors,
    //   // equal distribution
    //   contributors.map((contributor) => {
    //     return String(currentIssue.amount / contributors.length);
    //   })
    // );
    // fetch the user details from the contributors list and create a new array of wallet addresses
    const users = yield user_model_1.default.find();
    const addresses = contributors.map((contributor) => { var _a; return (_a = users.find((user) => user.githubUsername === contributor)) === null || _a === void 0 ? void 0 : _a.walletAddress; });
    console.log('ADDRESSES::: ', addresses);
    // get the repository name from the issue_url
    const repositoryName = issue.url.split('/').slice(3, 5).join('/');
    const issueNumber = issue.number;
    const resolvers = addresses;
    // equal distribution
    const distributions = addresses.map((address) => String(currentIssue.amount / addresses.length));
    try {
        const tx = yield (0, blockchainTransactions_1.distributeStakeToResolvers)(repositoryName, issueNumber, resolvers, distributions);
    }
    catch (error) {
        console.error('Error in DISTRIBUTE STAKE TO RESOLVERS::: ', error);
    }
    res.status(200).json({
        status: "success",
        message: "Issue closed successfully",
    });
}));
//# sourceMappingURL=bot.controller.js.map