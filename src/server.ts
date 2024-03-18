import "dotenv/config";
import "./db/client";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { MAXIMUM_JSON_PAYLOAD_SIZE } from "./config";
import applicationRouter from "./routes";

const app = express();

app.use(express.json({ limit: MAXIMUM_JSON_PAYLOAD_SIZE }));
const allowedDomains = process.env.ALLOWED_DOMAINS ? process.env.ALLOWED_DOMAINS.split(',') : [];

// CORS options
const corsOptions = {
	origin: function(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
		// allow requests with no origin
		if (!origin) return callback(null, true);

		if (allowedDomains.indexOf(origin) !== -1) {
			callback(null, true); // origin is in the allowed list
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	optionsSuccessStatus: 200 // For legacy browsers
};
applicationRouter.use(cors(corsOptions));
app.use(cors(corsOptions));
app.use(applicationRouter);
mongoose.connection.on("open", () => {
	app.listen(process.env.PORT, () => {
		console.log(
			`Sado IPFS is running at http://localhost:${process.env.PORT} | env: ${process.env.NODE_ENV}`
		);
	});
});
