import { Application } from "express";
import userRouter from "./user.route";
import authRouter from "./auth.route";
import githubRouter from "./github.route";
import botRouter from "./bot.route";
import issuesRouter from "./issues.route";
import repositoriesRouter from "./repositories.route";
import organisationsRouter from "./organisations.route";

export const routes = (app: Application) => {
  app.use("/api/users", userRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/github", githubRouter);
  app.use("/api/bot", botRouter);
  app.use("/api/issues", issuesRouter);
  app.use("/api/repositories", repositoriesRouter);
  app.use("/api/organisations", organisationsRouter);
};
