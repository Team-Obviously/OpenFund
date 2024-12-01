import express from "express";

import {
  createOrganisation,
  getOrganisations,
} from "../controller/organisation.controller";
import { getOrganisationsByOwner } from "../controller/organisation.controller";

const router = express.Router();

router.post("/", createOrganisation);
router.get("/", getOrganisationsByOwner);
router.get("/owner", getOrganisationsByOwner);
router.get("/all", getOrganisations);

export default router;
