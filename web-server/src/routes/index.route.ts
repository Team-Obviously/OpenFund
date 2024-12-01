import { Application } from "express";
import userRouter from "./user.route";
import authRouter from "./auth.route";
import githubRouter from "./github.route";
import botRouter from "./bot.route";
export const routes = (app: Application) => {
  app.use("/api/users", userRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/github", githubRouter);
  app.use("/api/bot", botRouter);
};
