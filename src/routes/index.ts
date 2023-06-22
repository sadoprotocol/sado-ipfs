import { type NextFunction, type Request, type Response, Router } from "express";

import IPFSRouter from "./ipfs";

const applicationRouter = Router();
const routers = [IPFSRouter];

// Dynamically bind routers to the main application router
routers.forEach((router) => {
	applicationRouter.use(router.basePath, router.router);
});

// ❗Important note: This error handler needs to be the very last route in the application router stack
applicationRouter.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
	return response.json({
		status: false,
		error: error.message,
	});
});

export default applicationRouter;
