import { Request, Response } from "express";
import { catchAsync } from "../utils/utils";
import axios from "axios";
import User from "../models/user.model";
import Repository, { IRepository } from "../models/repository.model";
import { IUser } from "../models/user.model";
import Donations, { IDonations } from "../models/donations.model";
import { Issue, IIssue } from "../models/issue.model";
import mongoose from "mongoose";
import {
  donateToRepository as donateToRepositoryBlockchain,
  registerRepository,
} from "../blockchain/blockchainTransactions";

type DonationType = {
  _id: mongoose.Types.ObjectId;
  amount: number;
  userId: string;
  repository: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

type DummyUserType = {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  oktoAuthToken: string;
  oktoRefreshToken: string;
  oktoDeviceToken: string;
  githubUsername: string;
  createdAt: Date;
  updatedAt: Date;
};

interface DummyTypes {
  donation: {
    _id: mongoose.Types.ObjectId;
    amount: number;
    userId: string;
    repository: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  };
  user: {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    oktoAuthToken: string;
    oktoRefreshToken: string;
    oktoDeviceToken: string;
    githubUsername: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

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

    // Donate to repository on blockchain
    try {
      const tx = await donateToRepositoryBlockchain(
        repository.name,
        String(amount)
      );
      console.log("TX in DONATE TO REPO::: ", tx);
    } catch (error) {
      console.error("Error in DONATE TO REPO::: ", error);
    }

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

export const getRepositoryOfMaintainer = catchAsync(
  async (req: Request, res: Response) => {
    const { maintainerId } = req.body;
    console.log("MAINTAINER ID:::, ", maintainerId);
    const repositories = await Repository.find().populate("donations");

    const filteredRepo = repositories.filter((repo) => {
      return repo.maintainer.toString() === maintainerId;
    });

    res.status(200).json({
      status: "success",
      data: {
        repositories: filteredRepo,
      },
    });
  }
);

export const getRepositoriesWithIssues = catchAsync(
  async (req: Request, res: Response) => {
    const { repositoryId } = req.body;

    let repository = await Repository.findById(repositoryId)
      .populate("issues")
      .populate("donations")
      .populate("donators");

    res.status(200).json({
      status: "success",
      data: {
        repository,
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

    // Register repository on blockchain
    try {
      const tx = await registerRepository(name);
      console.log("TX in REGISTER REPO::: ", tx);
    } catch (error) {
      console.error("Error in REGISTER REPO::: ", error);
    }

    res.status(201).json({
      status: "success",
      data: {
        repository,
      },
    });
  }
);
