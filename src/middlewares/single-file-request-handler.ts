import { type RequestHandler } from "express";
import multer from "multer";

import { MAXIMUM_FILE_SIZE, TEMP_DIRECTORY } from "../config";

const storage = multer.diskStorage({
	destination: TEMP_DIRECTORY,
	filename: (_req, file, cb) => {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(null, `${file.fieldname}-${uniqueSuffix}`);
	},
});
const fileHandler = multer({
	storage,
	limits: {
		fileSize: MAXIMUM_FILE_SIZE,
	},
});

export const singleFileRequestHandler = (fieldName: string): RequestHandler => fileHandler.single(fieldName);
