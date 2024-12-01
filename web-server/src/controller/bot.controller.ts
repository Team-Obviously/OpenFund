import { catchAsync } from "../utils/utils";
import { Request, Response } from "express";
import { b } from "../baml_client/sync_client";
import type { StakeComment } from "../baml_client/types";
import { Issue } from "../models/issue.model";
import Repository from "../models/repository.model";
import { assignStakeToIssue, donateToRepository } from "../blockchain/blockchainTransactions";
import axios from "axios";

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

    // const balance = await assignStakeToIssue(
    //   repository,
    //   String(response.issue_number),
    //   String(response.amount)
    // );
    // console.log(balance, issueTitle);

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
      comment: "Now this issue has been funded by " + response.amount + "matic. Solve it to earn the stake!",
    });

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
  const { issue, contributors, linkedPRs } = req.body;
  console.log(req.body.issue.number);
  console.log(req.body.issue.title);

  const currentIssue = await Issue.findOne({
    issueNumber: issue.number,
  });

  if (!currentIssue) {
    throw new Error("Issue not found");
  }

  currentIssue.status = "closed";
  currentIssue.assignee = contributors[0];
  await currentIssue.save();

  res.status(200).json({
    status: "success",
    message: "Issue closed successfully",
  });
});
