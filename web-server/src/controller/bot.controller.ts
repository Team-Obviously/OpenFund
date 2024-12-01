import { catchAsync } from "../utils/utils";
import { Request, Response } from "express";
import { b } from "../baml_client/sync_client"
import type { StakeComment } from "../baml_client/types"

export const newComment = catchAsync(async (req: Request, res: Response) => {
  let comment = req.body.body;

  const stakeComment = b.ExtractStakeComment(comment);


  console.log(stakeComment);



  res.status(200).json({
    status: "success",
    message: "Comment added successfully",
  });
});


