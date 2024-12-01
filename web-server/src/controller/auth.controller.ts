import Users from "../models/user.model";
import { Response, Request } from "express";
import { sign } from "jsonwebtoken";
import { catchAsync } from "../utils/utils";

interface OktoSignupData {
  auth_token: string;
  refresh_auth_token: string;
  device_token: string;
  message: string;
}

export const signup = (req: Request, res: Response) => {
  // const {
  //   firstName,
  //   lastName,
  //   emailId,
  //   password,
  //   confirmPassword,
  //   mobile_number,
  // } = req.body;
  console.log(req.body);
  // Users.findOne({ emailId: emailId })
  //   .then((user: any) => {
  //     if (user) {
  //       return res.status(400).json({
  //         error: "Email is taken",
  //       });
  //     }

  //     const newUser = new Users({
  //       firstName,
  //       lastName,
  //       emailId,
  //       password,
  //       confirmPassword,
  //     });

  //     newUser
  //       .save()
  //       .then((savedUser: any) => {
  //         const jwtToken = sign(
  //           { _id: savedUser._id },
  //           process.env.JWT_SECRET ?? "",
  //           {
  //             expiresIn: "100h",
  //           }
  //         );

  //         return res.status(200).json({
  //           message: "success",
  //           jwtToken,
  //           user: savedUser,
  //         });
  //       })
  //       .catch((err: any) => {
  //         if (err) {
  //           return res.status(401).json({
  //             error: err,
  //           });
  //         }
  //       });
  //   })
  //   .catch((err) => {
  //     if (err) {
  //       res.status(400).json({
  //         error: "Email is taken",
  //       });
  //     }
  //   });
};

export const signin = (req: Request, res: Response) => {
  const { emailId, password } = req.body;
  Users.findOne({ emailId })
    .then((user: any) => {
      if (!user.authenticate(password)) {
        return res.status(400).json({
          error: "Email and password do not match",
        });
      }

      const jwtToken = sign({ _id: user._id }, process.env.JWT_SECRET ?? "", {
        expiresIn: "100h",
      });

      res.cookie("jwt", jwtToken, {
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: req.secure || req.headers["x-forwarded-proto"] === "https",
      });

      return res.json({
        jwtToken,
        user: user,
      });
    })
    .catch((err) => {
      if (err) {
        return res.status(400).json({
          error: "User does not exist. Please signup",
          err,
        });
      }
    });
};

export const signupWithOkto = catchAsync(
  async (req: Request, res: Response) => {
    const { oktoAuthResponse, userDetails } = req.body;

    console.log(req.body);

    // Validate required fields
    if (
      !oktoAuthResponse?.auth_token ||
      !oktoAuthResponse?.refresh_auth_token ||
      !oktoAuthResponse?.device_token
    ) {
      return res.status(400).json({
        status: "error",
        message: "Missing required Okto credentials",
      });
    }

    // Check if user already exists
    const existingUser = await Users.findOne({
      oktoAuthToken: oktoAuthResponse.auth_token,
    });
    if (existingUser) {
      return res.status(200).json({
        status: "success",
        data: { user: existingUser },
      });
    }

    // Create new user
    const user = await Users.create({
      oktoAuthToken: oktoAuthResponse.auth_token,
      oktoRefreshToken: oktoAuthResponse.refresh_auth_token,
      oktoDeviceToken: oktoAuthResponse.device_token,
      name: userDetails.name,
      githubUsername: userDetails.githubUsername,
    });

    res.status(201).json({
      status: "success",
      data: { user },
    });
  }
);

export const addWalletAddress = catchAsync(async (req: Request, res: Response) => {
  const { walletAddress, userId } = req.body;
  const user = await Users.findByIdAndUpdate(userId, {
    walletAddress,
  });

  res.status(200).json({
    status: "success",
    data: { user },
  });
}
);
