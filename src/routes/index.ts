import { type NextFunction, type Request, type Response, Router } from "express";

import ERRORS from "../errors";
import BaseRouter from './base'
import IPFSRouter from "./ipfs";

const applicationRouter = Router();
const routers = [IPFSRouter, BaseRouter];

// Dynamically bind routers to the main application router
routers.forEach((router) => {
	applicationRouter.use(router.basePath, router.router);
});

// Catch 404 requests
applicationRouter.use((_request: Request, _response: Response, next: NextFunction) => {
	next(new Error(ERRORS.NOT_FOUND));
});

// ❗Important note: This error handler needs to be the very last route in the application router stack
applicationRouter.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
	return response.json({
		status: false,
		error: error.message,
	});
});

export default applicationRouter;
