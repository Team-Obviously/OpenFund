import { Router } from "express";
import { getMyDonatedRepositories } from "../controller/repositories.controller";
import { getAll } from "../controller/utils/handlerFactory";
import Repository from "../models/repository.model";

const router = Router();

router.get("/all", getAll(Repository));
router.get("/my", getMyDonatedRepositories);
// router.get("/:repositoryId", getRepository);
// router.post("/", createRepository);

export default router;
