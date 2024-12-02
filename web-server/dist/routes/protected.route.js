"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_route_1 = __importDefault(require("./auth.route"));
auth_route_1.default.get("/protected-route", auth_middleware_1.verifyOktoToken, (req, res) => {
    // Your route handler
});
//# sourceMappingURL=protected.route.js.map