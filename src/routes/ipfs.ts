import { Router } from "express";

import { pin, unpin, uploadBase64, uploadFile } from "../controllers/ipfs";
import { singleFileRequestHandler } from "../middlewares";

const router = Router();

router.post("/upload-base64", uploadBase64);
router.post("/upload-file", singleFileRequestHandler("content"), uploadFile);
router.put("/pin", pin);
router.put("/unpin", unpin);

export default { basePath: "/ipfs", router };
