import { Router } from "express";

import { pin, unpin, uploadBase64 } from "../controllers/ipfs";

const router = Router();

router.post("/upload-base64", uploadBase64);
router.put("/pin", pin);
router.put("/unpin", unpin);

export default { basePath: "/ipfs", router };
