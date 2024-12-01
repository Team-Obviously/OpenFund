import express from "express";
import { getAll, getOne, deleteOne } from "../controller/utils/handlerFactory";
import User from "../models/user.model";
import { verifyOktoToken } from "../middleware/auth.middleware";

const router = express.Router();

router.route("/").get(getAll(User));

router.route("/:id").get(getOne(User)).delete(verifyOktoToken, deleteOne(User));

export default router;
