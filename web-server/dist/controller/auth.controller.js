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
exports.addWalletAddress = exports.signupWithOkto = exports.signin = exports.signup = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = require("jsonwebtoken");
const utils_1 = require("../utils/utils");
const signup = (req, res) => {
    // const {
    //   firstName,
    //   lastName,
    //   emailId,
    //   password,
    //   confirmPassword,
    //   mobile_number,
    // } = req.body;
    console.log(req.body);
    // Users.findOne({ emailId: emailId })
    //   .then((user: any) => {
    //     if (user) {
    //       return res.status(400).json({
    //         error: "Email is taken",
    //       });
    //     }
    //     const newUser = new Users({
    //       firstName,
    //       lastName,
    //       emailId,
    //       password,
    //       confirmPassword,
    //     });
    //     newUser
    //       .save()
    //       .then((savedUser: any) => {
    //         const jwtToken = sign(
    //           { _id: savedUser._id },
    //           process.env.JWT_SECRET ?? "",
    //           {
    //             expiresIn: "100h",
    //           }
    //         );
    //         return res.status(200).json({
    //           message: "success",
    //           jwtToken,
    //           user: savedUser,
    //         });
    //       })
    //       .catch((err: any) => {
    //         if (err) {
    //           return res.status(401).json({
    //             error: err,
    //           });
    //         }
    //       });
    //   })
    //   .catch((err) => {
    //     if (err) {
    //       res.status(400).json({
    //         error: "Email is taken",
    //       });
    //     }
    //   });
};
exports.signup = signup;
const signin = (req, res) => {
    const { emailId, password } = req.body;
    user_model_1.default.findOne({ emailId })
        .then((user) => {
        var _a;
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: "Email and password do not match",
            });
        }
        const jwtToken = (0, jsonwebtoken_1.sign)({ _id: user._id }, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "", {
            expiresIn: "100h",
        });
        res.cookie("jwt", jwtToken, {
            expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: req.secure || req.headers["x-forwarded-proto"] === "https",
        });
        return res.json({
            jwtToken,
            user: user,
        });
    })
        .catch((err) => {
        if (err) {
            return res.status(400).json({
                error: "User does not exist. Please signup",
                err,
            });
        }
    });
};
exports.signin = signin;
exports.signupWithOkto = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oktoAuthResponse, userDetails } = req.body;
    console.log(req.body);
    // Validate required fields
    if (!(oktoAuthResponse === null || oktoAuthResponse === void 0 ? void 0 : oktoAuthResponse.auth_token) ||
        !(oktoAuthResponse === null || oktoAuthResponse === void 0 ? void 0 : oktoAuthResponse.refresh_auth_token) ||
        !(oktoAuthResponse === null || oktoAuthResponse === void 0 ? void 0 : oktoAuthResponse.device_token)) {
        return res.status(400).json({
            status: "error",
            message: "Missing required Okto credentials",
        });
    }
    // Check if user already exists
    const existingUser = yield user_model_1.default.findOne({
        oktoAuthToken: oktoAuthResponse.auth_token,
    });
    if (existingUser) {
        return res.status(200).json({
            status: "success",
            data: { user: existingUser },
        });
    }
    // Create new user
    const user = yield user_model_1.default.create({
        oktoAuthToken: oktoAuthResponse.auth_token,
        oktoRefreshToken: oktoAuthResponse.refresh_auth_token,
        oktoDeviceToken: oktoAuthResponse.device_token,
        name: userDetails.name,
        githubUsername: userDetails.githubUsername,
    });
    res.status(201).json({
        status: "success",
        data: { user },
    });
}));
exports.addWalletAddress = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletAddress, userId } = req.body;
    const user = yield user_model_1.default.findByIdAndUpdate(userId, {
        walletAddress,
    });
    res.status(200).json({
        status: "success",
        data: { user },
    });
}));
//# sourceMappingURL=auth.controller.js.map