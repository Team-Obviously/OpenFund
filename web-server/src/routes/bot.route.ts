import express from "express";
import { newComment } from "../controller/bot.controller";

const router = express.Router();

router.route("/comment").post(newComment);
export default router;
