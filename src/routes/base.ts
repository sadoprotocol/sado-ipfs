import { Router } from "express";

import { healthCheck } from "../controllers/base";

const router = Router();

router.get("/health-check", healthCheck);

export default { basePath: "/", router };