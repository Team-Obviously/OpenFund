import express from "express";
import {
  getRepositories,
  githubCallback,
  syncUserRepositories,
  getUserRepositories,
} from "../controller/github.controller";
import { verifyOktoToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/github-callback", githubCallback);
router.post("/repos", verifyOktoToken, getRepositories);
router.post("/sync-repos", verifyOktoToken, syncUserRepositories);
router.get("/user-repos", verifyOktoToken, getUserRepositories);

export default router;
