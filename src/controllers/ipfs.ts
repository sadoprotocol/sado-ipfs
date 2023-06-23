import fs from "node:fs/promises";

import { type NextFunction, type Request, type Response } from "express";

import { ACCEPTED_MIME_TYPES } from "../config";
import { prisma } from "../db/client";
import ERRORS from "../errors";
import { saveContentData } from "../models/Content";
import { ipfsCore } from "../modules/IPFSCore";
import { cidArrayDifference, deleteFile, generateGatewayURL, getBase64Metadata, parseCID } from "../utils";

async function uploadBase64(
	request: Request,
	response: Response,
	next: NextFunction
): Promise<Response | undefined> {
	try {
		const content = request.body.content as string;
		const pin = request.body.pin as boolean;
		const { buff, ...metadata } = getBase64Metadata(content);

		const cid = await ipfsCore.add(buff, pin);
		const pinned = await ipfsCore.isPinned(cid);

		await saveContentData({ cid, pinned, metadata });

		return response.send({
			success: true,
			data: {
				cid: cid.toString(),
				url: generateGatewayURL(cid),
			},
		});
	} catch (error) {
		next(error);
	}
}

async function uploadFile(
	request: Request,
	response: Response,
	next: NextFunction
): Promise<Response | undefined> {
	const file = request.file;

	// TODO: move validation to route level and use JSON schema to validate
	if (!file) {
		next(new Error(ERRORS.MISSING_FILE));
		return;
	}

	if (!ACCEPTED_MIME_TYPES.includes(file.mimetype)) {
		next(new Error(ERRORS.UNSUPPORTED_FILE));
		return;
	}

	try {
		const pin = request.body.pin as boolean;
		const content = await fs.readFile(file.path, { encoding: "base64" });
		const buff = Buffer.from(content, "base64");

		const cid = await ipfsCore.add(buff, pin);
		const pinned = await ipfsCore.isPinned(cid);

		await saveContentData({
			cid,
			pinned,
			metadata: {
				byteSize: file.size,
				mimetype: file.mimetype,
			},
		});

		return response.send({
			success: true,
			data: {
				cid: cid.toString(),
				url: generateGatewayURL(cid),
			},
		});
	} catch (error) {
		next(error);
	} finally {
		// delete temporary file from OS
		if (file?.path) {
			await deleteFile(file?.path);
		}
	}
}

async function pin(request: Request, response: Response, next: NextFunction): Promise<Response | undefined> {
	try {
		const ids = request.body.id;
		const cids = Array.isArray(ids) ? ids.map(parseCID) : [parseCID(ids)];
		const pinned = await ipfsCore.pin(cids);

		await prisma.content.updateMany({
			where: {
				cid: { in: pinned.map((cid) => cid.toString()) },
			},
			data: { pinned: true },
		});

		return response.send({
			success: true,
			data: {
				pinned: pinned.map((cid) => cid.toString()),
				rejected: cidArrayDifference(cids, pinned),
			},
		});
	} catch (error) {
		next(error);
	}
}

async function unpin(
	request: Request,
	response: Response,
	next: NextFunction
): Promise<Response | undefined> {
	try {
		const ids = request.body.id;
		const cids = Array.isArray(ids) ? ids.map(parseCID) : [parseCID(ids)];
		const unpinned = await ipfsCore.unpin(cids);

		await prisma.content.updateMany({
			where: {
				cid: { in: unpinned.map((cid) => cid.toString()) },
			},
			data: { pinned: false },
		});

		return response.send({
			success: true,
			data: {
				unpinned: unpinned.map((cid) => cid.toString()),
				rejected: cidArrayDifference(cids, unpinned).map((cid) => cid.toString()),
			},
		});
	} catch (error) {
		next(error);
	}
}

export { pin, unpin, uploadBase64, uploadFile };
