import { Request, Response } from "express";
import { catchAsync } from "../utils/utils";
import axios from "axios";
import User from "../models/user.model";
import Repository from "../models/repository.model";
import { IUser } from "../models/user.model";
import Donations from "../models/donations.model";
import { Issue } from "../models/issue.model";

export const getAllRepositories = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.body;

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "User not authenticated",
      });
    }

    const repositories = await Repository.find().sort({ updatedAt: -1 });

    res.status(200).json({
      status: "success",
      data: {
        repositories,
      },
    });
  }
);

export const getMyDonatedRepositories = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.body;

    const repositories = await Repository.find({
      donators: { $in: [userId] },
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      status: "success",
      data: {
        repositories,
      },
    });
  }
);

export const getContributorsForRepository = catchAsync(
  async (req: Request, res: Response) => {
    const { repositoryId } = req.body;

    const repository = await Repository.findById(repositoryId);

    res.status(200).json({
      status: "success",
      data: {
        repository,
      },
    });
  }
);

export const donateToRepository = catchAsync(
  async (req: Request, res: Response) => {
    const { repositoryId, userId, amount } = req.body;

    const repository = await Repository.findById(repositoryId);

    if (!repository) {
      return res.status(404).json({
        status: "error",
        message: "Repository not found",
      });
    }

    const donation = await Donations.create({
      userId,
      amount,
    });

    repository.donations.push(donation);
    await repository.save();

    res.status(200).json({
      status: "success",
      data: {
        repository,
      },
    });
  }
);

export const getMyContributedRepositories = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.body;

    const repositories = await Repository.find({
      contributors: { $in: [userId] },
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      status: "success",
      data: {
        repositories,
      },
    });
  }
);

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

export const getRepositoryByOrganisation = catchAsync(
  async (req: Request, res: Response) => {
    const { organisationId } = req.body;

    const repositories = await Repository.find({
      organisation: organisationId,
    });

    res.status(200).json({
      status: "success",
      data: {
        repositories,
      },
    });
  }
);
