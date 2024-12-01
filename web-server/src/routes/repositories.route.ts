import { Router } from "express";
import {
  getContributorsForRepository,
  getMyDonatedRepositories,
} from "../controller/repositories.controller";
import { getAll } from "../controller/utils/handlerFactory";
import Repository from "../models/repository.model";

const router = Router();

router.get("/all", getAll(Repository));
router.get("/my", getMyDonatedRepositories);
router.get("/contributors", getContributorsForRepository);

// router.get("/:repositoryId", getRepository);
// router.post("/", createRepository);

export default router;
