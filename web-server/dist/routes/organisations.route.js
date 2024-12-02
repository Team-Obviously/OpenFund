"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const organisation_controller_1 = require("../controller/organisation.controller");
const organisation_controller_2 = require("../controller/organisation.controller");
const router = express_1.default.Router();
router.post("/", organisation_controller_1.createOrganisation);
router.get("/", organisation_controller_2.getOrganisationsByOwner);
router.get("/owner", organisation_controller_2.getOrganisationsByOwner);
router.get("/all", organisation_controller_1.getOrganisations);
exports.default = router;
//# sourceMappingURL=organisations.route.js.map