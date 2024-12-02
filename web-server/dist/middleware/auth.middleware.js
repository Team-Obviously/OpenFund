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
exports.verifyOktoToken = void 0;
const user_model_1 = __importDefault(require("../models/user.model")); // Make sure to import your User model
const verifyOktoToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the Okto data from request body
        const oktoData = req.body;
        if (!(oktoData === null || oktoData === void 0 ? void 0 : oktoData.auth_token)) {
            return res.status(401).json({ message: "No auth token provided" });
        }
        // Store Okto data in request for later use
        req.oktoData = oktoData;
        // Create or update user in database
        const user = yield user_model_1.default.findOneAndUpdate({ oktoAuthToken: oktoData.auth_token }, {
            oktoAuthToken: oktoData.auth_token,
            oktoRefreshToken: oktoData.refresh_auth_token,
            oktoDeviceToken: oktoData.device_token,
            lastLogin: new Date(),
        }, { upsert: true, new: true });
        // Attach user to request
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.verifyOktoToken = verifyOktoToken;
//# sourceMappingURL=auth.middleware.js.map