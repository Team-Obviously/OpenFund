import { Request, Response } from "express";
import { catchAsync } from "../utils/utils";
import Organisation from "../models/organisation.model";

export const createOrganisation = catchAsync(
  async (req: Request, res: Response) => {
    const { name, description, url } = req.body;

    const organisation = await Organisation.create({
      name,
      description,
      url,
    });

    res.status(201).json({
      status: "success",
      data: {
        organisation,
      },
    });
  }
);

export const getOrganisations = catchAsync(
  async (req: Request, res: Response) => {
    const organisations = await Organisation.find();

    res.status(200).json({ status: "success", data: { organisations } });
  }
);

export const getOrganisationsByOwner = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.body;

    const organisations = await Organisation.find({ owner: userId });

    res.status(200).json({
      status: "success",
      data: {
        organisations,
      },
    });
  }
);
