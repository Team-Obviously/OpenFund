import { Request, Response } from "express";
import { catchAsync } from "../utils/utils";
import axios from "axios";
import User from "../models/user.model";
import Repository from "../models/repository.model";
import { IUser } from "../models/user.model";
import Donations from "../models/donations.model";
import { Issue } from "../models/issue.model";

export const getAllIssues = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(401).json({
      status: "error",
      message: "User not authenticated",
    });
  }

  const issues = await Issue.find().sort({ updatedAt: -1 });

  res.status(200).json({
    status: "success",
    data: {
      issues,
    },
  });
});

export const getMyIssues = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.body;

  const issues = await Issue.find({
    contributor: userId,
  }).sort({ updatedAt: -1 });

  res.status(200).json({
    status: "success",
    data: {
      issues,
    },
  });
});

export const getMyContributedIssues = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.body;
    const user = await User.findById(userId);
    const issues = await Issue.find({
      closedBy: user.githubUsername,
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      status: "success",
      data: {
        issues,
      },
    });
  }
);
