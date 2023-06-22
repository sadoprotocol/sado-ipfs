import { type NextFunction, type Request, type Response } from "express";

import { prisma } from "../db/client";
import { ipfsCore } from "../modules/IPFSCore";
import { generateGatewayURL, getBase64Metadata, parseCID } from "../utils";

async function uploadBase64(
	request: Request,
	response: Response,
	next: NextFunction
): Promise<Response | undefined> {
	try {
		const content = request.body.content as string;
		const pin = request.body.pin as boolean;
		const { buff, ...metadata } = getBase64Metadata(content);

		const cid = await ipfsCore.add(buff);
		await prisma.content.create({
			data: {
				cid: cid.toString(),
				metadata,
				pinned: pin,
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
	}
}

async function pin(request: Request, response: Response, next: NextFunction): Promise<Response | undefined> {
	try {
		const ids = request.body.id;
		const cids = Array.isArray(ids) ? ids.map(parseCID) : [parseCID(ids)];
		const pinned = await ipfsCore.pin(cids);

		return response.send({
			success: true,
			data: {
				pinned: pinned.map((cid) => cid.toString()),
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

		return response.send({
			success: true,
			data: {
				unpinned: unpinned.map((cid) => cid.toString()),
			},
		});
	} catch (error) {
		next(error);
	}
}

export { pin, unpin, uploadBase64 };
