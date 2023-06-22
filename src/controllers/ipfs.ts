import { type NextFunction, type Request, type Response } from "express";

import { ipfsCore } from "../modules/IPFSCore";
import { parseCID } from "../utils";

async function upload(
	request: Request,
	response: Response,
	next: NextFunction
): Promise<Response | undefined> {
	try {
		const cid = await ipfsCore.add(request.body.content);

		return response.send({
			success: true,
			data: { cid: cid.toString() },
		});
	} catch (error) {
		next(error);
	}
}

async function retrieve(
	request: Request,
	response: Response,
	next: NextFunction
): Promise<Response | undefined> {
	try {
		const cid = parseCID(request.params.id);
		const content = await ipfsCore.get(cid);

		return response.send({
			success: true,
			data: { content },
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

export { pin, retrieve, unpin, upload };
