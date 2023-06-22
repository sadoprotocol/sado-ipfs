import { Router } from "express";

import { pin, retrieve, unpin, upload } from "../controllers/ipfs";

const router = Router();

router.post("/upload", upload);
router.get("/retrieve", retrieve);
router.put("/pin", pin);
router.put("/unpin", unpin);

export default { basePath: "/ipfs", router };
