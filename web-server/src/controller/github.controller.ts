import { Request, Response } from "express";
import { catchAsync } from "../utils/utils";
import axios from "axios";
import User from "../models/user.model";
import Repository from "../models/repository.model";
import { IUser } from "../models/user.model";

// Add this interface to extend Express Request
interface AuthRequest extends Request {
  user?: IUser;
}

export const getRepositories = catchAsync(
  async (req: Request, res: Response) => {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        status: "error",
        message: "GitHub access token is required",
      });
    }

    try {
      // Fetch user's repositories from GitHub API
      const response = await axios.get("https://api.github.com/user/repos", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
        params: {
          sort: "updated",
          per_page: 100, // Adjust this number as needed
        },
      });

      res.status(200).json({
        status: "success",
        repositories: response.data,
      });
    } catch (error: any) {
      res.status(error.response?.status || 500).json({
        status: "error",
        message: error.response?.data?.message || "Error fetching repositories",
      });
    }
  }
);

export const githubCallback = catchAsync(
  async (req: Request, res: Response) => {
    console.log(req.body);
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        status: "error",
        message: "GitHub code is required",
      });
    }

    try {
      // Exchange code for access token
      const tokenResponse = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const { access_token } = tokenResponse.data;

      // Get GitHub user details
      const userResponse = await axios.get("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      // // Update user record with GitHub access token
      // const updatedUser = await User.findOneAndUpdate(
      //   { githubUsername: userResponse.data.login },
      //   { githubAccessToken: access_token },
      //   { new: true }
      // );

      // if (!updatedUser) {
      //   return res.status(404).json({
      //     status: "error",
      //     message: "User not found",
      //   });
      // }

      res.status(200).json({
        status: "success",
        githubAccessToken: access_token,
        // user: updatedUser,
      });
    } catch (error: any) {
      console.log(error);
      res.status(error.response?.status || 500).json({
        status: "error",
        message:
          error.response?.data?.message || "Error processing GitHub callback",
      });
    }
  }
);

export const syncUserRepositories = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { accessToken } = req.body;
    const userId = req.user?._id;

    if (!accessToken) {
      return res.status(400).json({
        status: "error",
        message: "GitHub access token is required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "User not authenticated",
      });
    }

    try {
      // Fetch repositories from GitHub
      const response = await axios.get("https://api.github.com/user/repos", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
        params: {
          sort: "updated",
          per_page: 100,
        },
      });

      // Transform and save repositories
      const repositories = await Promise.all(
        response.data.map(async (repo: any) => {
          const repoData = {
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            url: repo.html_url,
            owner: repo.owner.login,
            userId: userId,
            isPrivate: repo.private,
          };

          // Update or create repository
          return await Repository.findOneAndUpdate(
            { fullName: repo.full_name, userId: userId },
            repoData,
            { upsert: true, new: true }
          );
        })
      );

      res.status(200).json({
        status: "success",
        data: {
          repositories,
        },
      });
    } catch (error: any) {
      res.status(error.response?.status || 500).json({
        status: "error",
        message: error.response?.data?.message || "Error syncing repositories",
      });
    }
  }
);

export const getUserRepositories = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "User not authenticated",
      });
    }

    const repositories = await Repository.find({ userId: userId }).sort({
      updatedAt: -1,
    });

    res.status(200).json({
      status: "success",
      data: {
        repositories,
      },
    });
  }
);

export const getRepository = catchAsync(async (req: Request, res: Response) => {
  const { repositoryId } = req.params;
  const repository = await Repository.findById(repositoryId);
  res.status(200).json({ status: "success", data: { repository } });
});

export const createRepository = catchAsync(
  async (req: Request, res: Response) => {
    const { name, fullName, description, url, maintainer } = req.body;
    const repository = await Repository.create(
      {
        name,
        description,
        url,
        maintainer,
      },
      { new: true }
    );
    res.status(200).json({ status: "success", data: { repository } });
  }
);
