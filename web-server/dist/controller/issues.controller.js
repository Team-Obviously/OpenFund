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
exports.getMyIssues = exports.getAllIssues = void 0;
const utils_1 = require("../utils/utils");
const issue_model_1 = require("../models/issue.model");
exports.getAllIssues = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    if (!userId) {
        return res.status(401).json({
            status: "error",
            message: "User not authenticated",
        });
    }
    const issues = yield issue_model_1.Issue.find().sort({ updatedAt: -1 });
    res.status(200).json({
        status: "success",
        data: {
            issues,
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
//# sourceMappingURL=issues.controller.js.map