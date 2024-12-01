import { Router } from "express";
import {
  donateToRepository,
  getContributorsForRepository,
  getMyDonatedRepositories,
  getRepositoryOfMaintainer,
  createRepository,
  getAllRepositories,
  getRepositoriesWithIssues,
} from "../controller/repositories.controller";

const router = Router();

router.get("/all", getAllRepositories);
router.get("/my/:userId", getMyDonatedRepositories);
router.get("/contributors", getContributorsForRepository);
router.post("/maintainer", getRepositoryOfMaintainer);
router.post("/donate", donateToRepository);
router.post("/create", createRepository);
router.post("/with-issues", getRepositoriesWithIssues);

// router.get("/:repositoryId", getRepository);
// router.post("/", createRepository);

export default router;
