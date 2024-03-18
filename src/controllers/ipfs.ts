import fs from "node:fs/promises";

import { type NextFunction, type Request, type Response } from "express";

import { ACCEPTED_MIME_TYPES } from "../config";
import ERRORS from "../errors";
import { ContentModel, saveContentData, getContentData } from "../models/Content";
import { ipfsCore } from "../modules/IPFSCore";
import { cidArrayDifference, deleteFile, generateGatewayURL, getContentMetadata, parseCID } from "../utils";

import fetch from 'node-fetch';

async function upload(
	request: Request,
	response: Response,
	next: NextFunction
): Promise<Response | undefined> {
	try {
		const content = request.body.content as string;
		const pin = request.body.pin as boolean;
		const { buff, ...metadata } = getContentMetadata(content);

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

		await ContentModel.updateMany(
			{ cid: { $in: pinned.map((cid) => cid.toString()) } },
			{ $set: { pinned: true } }
		);

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

		await ContentModel.updateMany(
			{ cid: { $in: unpinned.map((cid) => cid.toString()) } },
			{ $set: { pinned: false } }
		);

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

/**
 *
 * @param request
 * @param response
 * @param next
 *
 * This function is responsible for serving the content from the IPFS gateway and overriding the content type
 */
async function serve(request: Request, response: Response, next: NextFunction) {
	try {
		const cid = parseCID(request.params.cid);

		const gatewayURL = generateGatewayURL(cid);
		const asset =  await fetch(new URL(gatewayURL) )

		//  check stored mimetype of the asset and override the contentType that is return
		const storedContent = await getContentData(cid);

		if(storedContent && storedContent.metadata && storedContent.metadata.mimetype){
			response.setHeader('Content-Type', storedContent.metadata.mimetype.toString())
		}

		if (asset.body) {
			// pipe readable stream directly to the response
			asset.body.pipe(response);
		} else {
			throw new Error('Response body is null');
		}

	} catch (error) {
		next(error);
	}
}

/**
 *
 * @param request
 * @param response
 * @param next
 *
 * This function is responsible for redirecting the request to the recursive endpoint
 */
async function getRecursivePreview(request: Request, response: Response, next: NextFunction) {
	try {
		const inscriptionUrl = `${process.env.RECURSIVE_ENDPOINT as string}${request.path}`
		return response.redirect(inscriptionUrl)

	} catch (error) {
		next(error);
	}

}

export { pin, unpin, upload, uploadFile, serve, getRecursivePreview };
