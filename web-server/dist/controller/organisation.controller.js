"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrganisationsByOwner = exports.getOrganisations = exports.createOrganisation = void 0;
const utils_1 = require("../utils/utils");
const organisation_model_1 = __importDefault(require("../models/organisation.model"));
exports.createOrganisation = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, url } = req.body;
    const organisation = yield organisation_model_1.default.create({
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
}));
exports.getOrganisations = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const organisations = yield organisation_model_1.default.find();
    res.status(200).json({ status: "success", data: { organisations } });
}));
exports.getOrganisationsByOwner = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    const organisations = yield organisation_model_1.default.find({ owner: userId });
    res.status(200).json({
        status: "success",
        data: {
            organisations,
        },
    });
}));
//# sourceMappingURL=organisation.controller.js.map