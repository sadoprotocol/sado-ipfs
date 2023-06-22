import { Router } from "express";

import IPFSRouter from "./ipfs";

const applicationRouter = Router();
const routers = [IPFSRouter];

// Dynamically bind routers to the main application router
routers.forEach((router) => {
	applicationRouter.use(router.basePath, router.router);
});

export default applicationRouter;
