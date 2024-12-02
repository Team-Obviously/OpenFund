"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const repositories_controller_1 = require("../controller/repositories.controller");
const router = (0, express_1.Router)();
router.get("/all", repositories_controller_1.getAllRepositories);
router.get("/my/:userId", repositories_controller_1.getMyDonatedRepositories);
router.get("/contributors", repositories_controller_1.getContributorsForRepository);
router.post("/maintainer", repositories_controller_1.getRepositoryOfMaintainer);
router.post("/donate", repositories_controller_1.donateToRepository);
router.post("/create", repositories_controller_1.createRepository);
router.post("/with-issues", repositories_controller_1.getRepositoriesWithIssues);
// router.get("/:repositoryId", getRepository);
// router.post("/", createRepository);
exports.default = router;
//# sourceMappingURL=repositories.route.js.map