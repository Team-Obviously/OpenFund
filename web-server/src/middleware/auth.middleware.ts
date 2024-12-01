import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model"; // Make sure to import your User model
import { IUser } from "../models/user.model";

interface OktoTokenPayload {
  auth_token: string;
  refresh_auth_token: string;
  device_token: string;
  message: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
      oktoData?: OktoTokenPayload;
    }
  }
}

export const verifyOktoToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the Okto data from request body
    const oktoData = req.body as OktoTokenPayload;

    if (!oktoData?.auth_token) {
      return res.status(401).json({ message: "No auth token provided" });
    }

    // Store Okto data in request for later use
    req.oktoData = oktoData;

    // Create or update user in database
    const user = await User.findOneAndUpdate(
      { oktoAuthToken: oktoData.auth_token },
      {
        oktoAuthToken: oktoData.auth_token,
        oktoRefreshToken: oktoData.refresh_auth_token,
        oktoDeviceToken: oktoData.device_token,
        lastLogin: new Date(),
      },
      { upsert: true, new: true }
    );

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
