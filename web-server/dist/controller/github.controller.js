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
exports.createRepository = exports.getRepository = exports.getUserRepositories = exports.syncUserRepositories = exports.githubCallback = exports.getRepositories = void 0;
const utils_1 = require("../utils/utils");
const axios_1 = __importDefault(require("axios"));
const repository_model_1 = __importDefault(require("../models/repository.model"));
exports.getRepositories = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { accessToken } = req.body;
    if (!accessToken) {
        return res.status(400).json({
            status: "error",
            message: "GitHub access token is required",
        });
    }
    try {
        // Fetch user's repositories from GitHub API
        const response = yield axios_1.default.get("https://api.github.com/user/repos", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github.v3+json",
            },
            params: {
                sort: "updated",
                per_page: 100, // Adjust this number as needed
            },
        });
        res.status(200).json({
            status: "success",
            repositories: response.data,
        });
    }
    catch (error) {
        res.status(((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || 500).json({
            status: "error",
            message: ((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "Error fetching repositories",
        });
    }
}));
exports.githubCallback = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    console.log(req.body);
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({
            status: "error",
            message: "GitHub code is required",
        });
    }
    try {
        // Exchange code for access token
        const tokenResponse = yield axios_1.default.post("https://github.com/login/oauth/access_token", {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
        }, {
            headers: {
                Accept: "application/json",
            },
        });
        const { access_token } = tokenResponse.data;
        // Get GitHub user details
        const userResponse = yield axios_1.default.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        // // Update user record with GitHub access token
        // const updatedUser = await User.findOneAndUpdate(
        //   { githubUsername: userResponse.data.login },
        //   { githubAccessToken: access_token },
        //   { new: true }
        // );
        // if (!updatedUser) {
        //   return res.status(404).json({
        //     status: "error",
        //     message: "User not found",
        //   });
        // }
        res.status(200).json({
            status: "success",
            githubAccessToken: access_token,
            // user: updatedUser,
        });
    }
    catch (error) {
        console.log(error);
        res.status(((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || 500).json({
            status: "error",
            message: ((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || "Error processing GitHub callback",
        });
    }
}));
exports.syncUserRepositories = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { accessToken } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!accessToken) {
        return res.status(400).json({
            status: "error",
            message: "GitHub access token is required",
        });
    }
    if (!userId) {
        return res.status(401).json({
            status: "error",
            message: "User not authenticated",
        });
    }
    try {
        // Fetch repositories from GitHub
        const response = yield axios_1.default.get("https://api.github.com/user/repos", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github.v3+json",
            },
            params: {
                sort: "updated",
                per_page: 100,
            },
        });
        // Transform and save repositories
        const repositories = yield Promise.all(response.data.map((repo) => __awaiter(void 0, void 0, void 0, function* () {
            const repoData = {
                name: repo.name,
                fullName: repo.full_name,
                description: repo.description,
                url: repo.html_url,
                owner: repo.owner.login,
                userId: userId,
                isPrivate: repo.private,
            };
            // Update or create repository
            return yield repository_model_1.default.findOneAndUpdate({ fullName: repo.full_name, userId: userId }, repoData, { upsert: true, new: true });
        })));
        res.status(200).json({
            status: "success",
            data: {
                repositories,
            },
        });
    }
    catch (error) {
        res.status(((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || 500).json({
            status: "error",
            message: ((_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || "Error syncing repositories",
        });
    }
}));
exports.getUserRepositories = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId) {
        return res.status(401).json({
            status: "error",
            message: "User not authenticated",
        });
    }
    const repositories = yield repository_model_1.default.find({ userId: userId }).sort({
        updatedAt: -1,
    });
    res.status(200).json({
        status: "success",
        data: {
            repositories,
        },
    });
}));
exports.getRepository = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { repositoryId } = req.params;
    const repository = yield repository_model_1.default.findById(repositoryId);
    res.status(200).json({ status: "success", data: { repository } });
}));
exports.createRepository = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, fullName, description, url, maintainer } = req.body;
    const repository = yield repository_model_1.default.create({
        name,
        description,
        url,
        maintainer,
    }, { new: true });
    res.status(200).json({ status: "success", data: { repository } });
}));
//# sourceMappingURL=github.controller.js.map