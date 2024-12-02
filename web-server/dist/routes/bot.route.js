"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bot_controller_1 = require("../controller/bot.controller");
const router = express_1.default.Router();
router.route("/comment").post(bot_controller_1.newComment);
router.route("/closed").post(bot_controller_1.closeIssue);
exports.default = router;
//# sourceMappingURL=bot.route.js.map