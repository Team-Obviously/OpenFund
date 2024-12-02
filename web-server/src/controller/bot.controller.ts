import { catchAsync } from "../utils/utils";
import { Request, Response } from "express";
import { b } from "../baml_client/sync_client";
import type { StakeComment } from "../baml_client/types";
import { Issue } from "../models/issue.model";
import Repository from "../models/repository.model";
import {
  assignStakeToIssue,
  distributeStakeToResolvers,
  donateToRepository,
} from "../blockchain/blockchainTransactions";
import axios from "axios";
import User, { IUser } from "../models/user.model";

export const newComment = catchAsync(async (req: Request, res: Response) => {
  try {
    const {
      body: commentBody,
      issue_url,
      html_url,
      user,
      repository,
      owner,
      issueTitle,
    } = req.body;

    const response = await b.ExtractStakeComment(commentBody);
    console.log(response);

    const newIssue = new Issue({
      issueNumber: response.issue_number,
      title: issueTitle,
      amount: response.amount,
      status: "open",
      creator: user.login,
      assignee: null,
      repository: repository,
      organizationName: owner,
      issueUrl: issue_url,
      htmlUrl: html_url,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save the issue
    const savedIssue = await newIssue.save();

    const updatedRepo = await Repository.findOneAndUpdate(
      {
        name: repository,
      },
      {
        $push: { issues: savedIssue._id },
      },
      { new: true }
    );

    if (!updatedRepo) {
      throw new Error("Repository not found");
    }

    await axios.post("http://localhost:3002/add-labels", {
      owner: owner,
      repo: repository,
      issue_number: response.issue_number,
      labels: ["Funded"],
    });

    await axios.post("http://localhost:3002/add-comment", {
      owner: owner,
      repo: repository,
      issue_number: response.issue_number,
      comment:
        "Now this issue has been funded by " +
        response.amount +
        "matic. Solve it to earn the stake!",
    });

    // assign stake to issue
    try {
      const tx = await assignStakeToIssue(
        repository,
        String(response.issue_number),
        String(response.amount)
      );
    } catch (error) {
      console.error("Error in ASSIGN STAKE TO ISSUE::: ", error);
    }

    return res.status(200).json({
      success: true,
      message: "Issue created successfully",
      data: {
        issue: savedIssue,
        repository: updatedRepo,
      },
    });
  } catch (error) {
    console.error("Error in newComment:", error);
    return res.status(500).json({
      success: false,
      message: "Error processing comment",
      error: error.message,
    });
  }
});

export const closeIssue = catchAsync(async (req: Request, res: Response) => {
  console.log("REQUEST BODY::: ", req.body);

  const { issue, contributors, linkedPRs } = req.body;
  console.log(req.body.issue.number);
  console.log(req.body.issue.title);

  const currentIssue = await Issue.findOne({
    issueNumber: issue.number,
    closedBy: "virajbhartiya",
  });

  if (!currentIssue) {
    throw new Error("Issue not found");
  }

  currentIssue.status = "closed";
  currentIssue.assignee = contributors[0];
  await currentIssue.save();

  // // distribute stake to resolvers
  // const tx = await distributeStakeToResolvers(repository, String(issue.number), contributors,
  //   // equal distribution
  //   contributors.map((contributor) => {
  //     return String(currentIssue.amount / contributors.length);
  //   })
  // );

  // fetch the user details from the contributors list and create a new array of wallet addresses
  const users = await User.find();
  const addresses = contributors.map(
    (contributor: string) =>
      users.find((user) => user.githubUsername === contributor)?.walletAddress
  );

  console.log("ADDRESSES::: ", addresses);
  // get the repository name from the issue_url
  const repositoryName = issue.url.split("/").slice(3, 5).join("/");
  const issueNumber = issue.number;
  const resolvers = addresses;
  // equal distribution
  const distributions = addresses.map((address: string) =>
    String(currentIssue.amount / addresses.length)
  );

  try {
    const tx = await distributeStakeToResolvers(
      repositoryName,
      issueNumber,
      resolvers,
      distributions
    );
  } catch (error) {
    console.error("Error in DISTRIBUTE STAKE TO RESOLVERS::: ", error);
  }

  res.status(200).json({
    status: "success",
    message: "Issue closed successfully",
  });
});
