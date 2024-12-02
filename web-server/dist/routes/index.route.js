"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const user_route_1 = __importDefault(require("./user.route"));
const auth_route_1 = __importDefault(require("./auth.route"));
const github_route_1 = __importDefault(require("./github.route"));
const bot_route_1 = __importDefault(require("./bot.route"));
const issues_route_1 = __importDefault(require("./issues.route"));
const repositories_route_1 = __importDefault(require("./repositories.route"));
const organisations_route_1 = __importDefault(require("./organisations.route"));
const routes = (app) => {
    app.use("/api/users", user_route_1.default);
    app.use("/api/auth", auth_route_1.default);
    app.use("/api/github", github_route_1.default);
    app.use("/api/bot", bot_route_1.default);
    app.use("/api/issues", issues_route_1.default);
    app.use("/api/repositories", repositories_route_1.default);
    app.use("/api/organisations", organisations_route_1.default);
};
exports.routes = routes;
//# sourceMappingURL=index.route.js.map