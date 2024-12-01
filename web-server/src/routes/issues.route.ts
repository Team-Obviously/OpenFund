import { Router } from "express";
import { getMyIssues } from "../controller/issues.controller";
import { getAll } from "../controller/utils/handlerFactory";
import { Issue } from "../models/issue.model";

const router = Router();

router.get("/all", getAll(Issue));
router.get("/my", getMyIssues);
// router.get("/:repositoryId", getRepository);
// router.post("/", createRepository);

export default router;
