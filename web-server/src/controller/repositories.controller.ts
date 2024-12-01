import { Request, Response } from "express";
import { catchAsync } from "../utils/utils";
import axios from "axios";
import User from "../models/user.model";
import Repository from "../models/repository.model";
import { IUser } from "../models/user.model";
import Donations, { IDonations } from "../models/donations.model";
import { Issue } from "../models/issue.model";

export const getAllRepositories = catchAsync(
  async (req: Request, res: Response) => {
    const repositories = await Repository.find().populate("donations");

    // Calculate total amount for each repository
    const repositoriesWithTotalAmount = repositories.map((repo) => {
      const totalAmount = (repo.donations || []).reduce(
        (acc, donation: IDonations) => {
          return acc + (donation.amount || 0);
        },
        0
      );

      return {
        ...repo.toObject(),
        totalAmount,
      };
    });

    res.status(200).json({
      status: "success",
      data: {
        repositories: repositoriesWithTotalAmount,
      },
    });
  }
);

export const getMyDonatedRepositories = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const repositories = await Repository.find().populate("donations");

    const filteredRepo = repositories.filter((repo) => {
      return repo.donations.some(
        (donation) => donation.userId.toString() === userId
      );
    });

    res.status(200).json({
      status: "success",
      data: {
        repositories: filteredRepo,
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
    console.log(req.body);
    // Find repository and initialize donations array if it doesn't exist
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
      repository: repositoryId,
    });

    if (!repository.donations) {
      repository.donations = [];
    }

    repository.donations.push(donation);
    await repository.save();

    res.status(200).json({
      status: "success",
      data: {
        repository,
        donation,
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
    const { maintainer } = req.body;

    const repositories = await Repository.find({
      maintainer,
    });

    res.status(200).json({
      status: "success",
      data: {
        repositories,
      },
    });
  }
);

export const createRepository = catchAsync(
  async (req: Request, res: Response) => {
    const { name, projectUrl, userId } = req.body;
    console.log(req.body);

    const repository = await Repository.create({
      name,
      url: projectUrl,
      maintainer: userId,
    });

    res.status(201).json({
      status: "success",
      data: {
        repository,
      },
    });
  }
);
