import express from "express";
import { signupWithOkto } from "../controller/auth.controller";
import { githubCallback } from "../controller/github.controller";

const router = express.Router();

router.post("/signup", signupWithOkto);
router.post("/github-callback", githubCallback);
export default router;
