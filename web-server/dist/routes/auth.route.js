"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth.controller");
const github_controller_1 = require("../controller/github.controller");
const router = express_1.default.Router();
router.post("/signup", auth_controller_1.signupWithOkto);
router.post("/github-callback", github_controller_1.githubCallback);
exports.default = router;
//# sourceMappingURL=auth.route.js.map