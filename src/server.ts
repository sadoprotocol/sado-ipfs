import "dotenv/config";
import "./db/client";

import express from "express";
import mongoose from "mongoose";

import { MAXIMUM_JSON_PAYLOAD_SIZE } from "./config";
import applicationRouter from "./routes";

const app = express();

app.use(express.json({ limit: MAXIMUM_JSON_PAYLOAD_SIZE }));
app.use(applicationRouter);

mongoose.connection.on("open", () => {
	app.listen(process.env.PORT, () => {
		console.log(
			`Sado IPFS is running at http://localhost:${process.env.PORT} | env: ${process.env.NODE_ENV}`
		);
	});
});
