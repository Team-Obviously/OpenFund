import express from "express";
import {
  getRepositories,
  githubCallback,
} from "../controller/github.controller";
import { verifyOktoToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/github-callback", githubCallback);
router.post("/repos", verifyOktoToken, getRepositories);

export default router;
