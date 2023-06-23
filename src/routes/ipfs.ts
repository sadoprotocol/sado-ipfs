import { Router } from "express";

import { pin, unpin, upload, uploadFile } from "../controllers/ipfs";
import { singleFileRequestHandler } from "../middlewares";

const router = Router();

router.post("/upload", upload);
router.post("/upload-file", singleFileRequestHandler("content"), uploadFile);
router.put("/pin", pin);
router.put("/unpin", unpin);

export default { basePath: "/ipfs", router };
