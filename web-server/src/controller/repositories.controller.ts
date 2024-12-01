import { Request, Response } from "express";
import { catchAsync } from "../utils/utils";
import axios from "axios";
import User from "../models/user.model";
import Repository, { IRepository } from "../models/repository.model";
import { IUser } from "../models/user.model";
import Donations, { IDonations } from "../models/donations.model";
import { Issue, IIssue } from "../models/issue.model";
import mongoose from "mongoose";

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

    // Add dummy data if fields are empty
    const dummyData = {
      issues: repository.issues.length
        ? repository.issues
        : [
            {
              issueNumber: 1,
              title: "Sample Issue 1",
              amount: 100,
              status: "open",
              creator: "dummyUser",
              assignee: null,
              repository: repository.name,
              organizationName: "dummyOrg",
              issueUrl: "https://example.com",
              htmlUrl: "https://example.com",
              createdAt: new Date(),
              updatedAt: new Date(),
            } as IIssue,
            {
              issueNumber: 2,
              title: "Sample Issue 2",
              amount: 200,
              status: "open",
              creator: "dummyUser",
              assignee: null,
              repository: repository.name,
              organizationName: "dummyOrg",
              issueUrl: "https://example.com",
              htmlUrl: "https://example.com",
              createdAt: new Date(),
              updatedAt: new Date(),
            } as IIssue,
          ],
      donations: repository.donations.length
        ? repository.donations
        : [
            {
              _id: new mongoose.Types.ObjectId(),
              amount: 500,
              userId: "dummy1",
              repository: repository._id,
              createdAt: new Date(),
              updatedAt: new Date(),
            } as DummyTypes["donation"],
            {
              _id: new mongoose.Types.ObjectId(),
              amount: 300,
              userId: "dummy2",
              repository: repository._id,
              createdAt: new Date(),
              updatedAt: new Date(),
            } as DummyTypes["donation"],
          ],
      donators: repository.donators.length
        ? repository.donators
        : [
            {
              _id: new mongoose.Types.ObjectId(),
              name: "John Doe",
              email: "john@example.com",
              oktoAuthToken: "",
              oktoRefreshToken: "",
              oktoDeviceToken: "",
              githubUsername: "johndoe",
              createdAt: new Date(),
              updatedAt: new Date(),
            } as DummyTypes["user"],
            {
              _id: new mongoose.Types.ObjectId(),
              name: "Jane Smith",
              email: "jane@example.com",
              oktoAuthToken: "",
              oktoRefreshToken: "",
              oktoDeviceToken: "",
              githubUsername: "janesmith",
              createdAt: new Date(),
              updatedAt: new Date(),
            } as DummyTypes["user"],
          ],
    };

    const responseData = {
      ...repository.toObject(),
      issues: dummyData.issues,
      donations: dummyData.donations,
      donators: dummyData.donators,
    };

    res.status(200).json({
      status: "success",
      data: {
        repository: responseData,
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
