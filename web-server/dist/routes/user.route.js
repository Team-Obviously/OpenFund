"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handlerFactory_1 = require("../controller/utils/handlerFactory");
const user_model_1 = __importDefault(require("../models/user.model"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_controller_1 = require("../controller/auth.controller");
const router = express_1.default.Router();
router.route("/").get((0, handlerFactory_1.getAll)(user_model_1.default));
router.route("/:id").get((0, handlerFactory_1.getOne)(user_model_1.default)).delete(auth_middleware_1.verifyOktoToken, (0, handlerFactory_1.deleteOne)(user_model_1.default));
router.post("/wallet", auth_controller_1.addWalletAddress);
exports.default = router;
//# sourceMappingURL=user.route.js.map