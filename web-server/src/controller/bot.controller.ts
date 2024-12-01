import { catchAsync } from "../utils/utils";
import { Request, Response } from "express";
import { b } from "../baml_client/sync_client";
import type { StakeComment } from "../baml_client/types";
import { Issue } from "../models/issue.model";
import Repository from "../models/repository.model";

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

    const amountMatch = commentBody.match(/@openfund-bot send (\d+) Matic/i);
    const amount = amountMatch ? parseInt(amountMatch[1]) : 0;

    const issueNumberMatch = commentBody.match(/Issue number: (\d+)/i);
    const issueNumber = issueNumberMatch ? parseInt(issueNumberMatch[1]) : null;

    const newIssue = new Issue({
      issueNumber,
      title: issueTitle,
      amount,
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
        organizationName: owner,
      },
      {
        $push: { issues: savedIssue._id },
      },
      { new: true }
    );

    if (!updatedRepo) {
      throw new Error("Repository not found");
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
  const { issue, contributors, linkedPRs } = req.body;
  console.log(req.body.issue.number);
  console.log(req.body.issue.title);

  res.status(200).json({
    status: "success",
    message: "Issue closed successfully",
  });
});
