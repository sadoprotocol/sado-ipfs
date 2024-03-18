import { Router } from "express";

import {pin, unpin, upload, uploadFile, serve, getRecursivePreview} from "../controllers/ipfs";
import { singleFileRequestHandler } from "../middlewares";

const router = Router();

router.post("/upload", upload);
router.post("/upload-file", singleFileRequestHandler("content"), uploadFile);
router.put("/pin", pin);
router.put("/unpin", unpin);
router.get("/serve/:cid", serve);
router.get("/content/:inscriptionId", getRecursivePreview);
router.get("/r/blockhash", getRecursivePreview);
router.get("/r/blockhash/:height", getRecursivePreview);
router.get("/r/blockheight", getRecursivePreview);
router.get("/r/blockinfo/:query", getRecursivePreview);
router.get("/r/blocktime", getRecursivePreview);
router.get("/r/children/:inscriptionId", getRecursivePreview);
router.get("/r/children/:inscriptionId/:page", getRecursivePreview);
router.get("/r/inscription/:inscriptionId", getRecursivePreview);
router.get("/r/metadata/:inscriptionId", getRecursivePreview);
router.get("/r/sat/:satNumber", getRecursivePreview);
router.get("/r/sat/:satNumber/:page", getRecursivePreview)
router.get("r/sat/:satNumber/at/:index", getRecursivePreview);

export default { basePath: "/", router };
