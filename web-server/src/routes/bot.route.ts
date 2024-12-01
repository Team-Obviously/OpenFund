import express from "express";
import { closeIssue, newComment } from "../controller/bot.controller";

const router = express.Router();

router.route("/comment").post(newComment);
router.route("/closed").post(closeIssue);
export default router;
