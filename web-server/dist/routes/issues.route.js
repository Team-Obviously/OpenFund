"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const issues_controller_1 = require("../controller/issues.controller");
const handlerFactory_1 = require("../controller/utils/handlerFactory");
const issue_model_1 = require("../models/issue.model");
const router = (0, express_1.Router)();
router.get("/all", (0, handlerFactory_1.getAll)(issue_model_1.Issue));
router.get("/my", issues_controller_1.getMyIssues);
// router.get("/:repositoryId", getRepository);
// router.post("/", createRepository);
exports.default = router;
//# sourceMappingURL=issues.route.js.map