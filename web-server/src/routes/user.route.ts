import express from "express";
import { getAll, getOne, deleteOne } from "../controller/utils/handlerFactory";
import User from "../models/user.model";
import { verifyOktoToken } from "../middleware/auth.middleware";
import { addWalletAddress } from "../controller/auth.controller";
const router = express.Router();

router.route("/").get(getAll(User));

router.route("/:id").get(getOne(User)).delete(verifyOktoToken, deleteOne(User));
router.post("/wallet", addWalletAddress);
export default router;
