"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const github_controller_1 = require("../controller/github.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post("/github-callback", github_controller_1.githubCallback);
router.post("/repos", auth_middleware_1.verifyOktoToken, github_controller_1.getRepositories);
router.post("/sync-repos", auth_middleware_1.verifyOktoToken, github_controller_1.syncUserRepositories);
router.get("/user-repos", auth_middleware_1.verifyOktoToken, github_controller_1.getUserRepositories);
exports.default = router;
//# sourceMappingURL=github.route.js.map