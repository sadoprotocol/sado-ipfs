import fs from "node:fs/promises";

import { CID } from "kubo-rpc-client";

import { ACCEPTED_MIME_TYPES, MAXIMUM_FILE_SIZE } from "../config";
import ERRORS from "../errors";
import { type MetadataAttributes, type StringCheckArgs } from "./types";

export function parseCID(str: string): CID {
	try {
		return CID.parse(str);
	} catch (_error) {
		throw new Error(ERRORS.INVALID_CID);
	}
}

export function isBase64String({ content, throwError }: StringCheckArgs): boolean {
	if (!content.startsWith("data:") || !content.includes("base64,")) {
		if (!throwError) {
			return false;
		}

		throw new Error(ERRORS.INVALID_BASE64);
	}

	return true;
}

export function isJSONString({ content, throwError }: StringCheckArgs): boolean {
	try {
		JSON.parse(content);
	} catch (error) {
		if (!throwError) {
			return false;
		}

		throw new Error(ERRORS.INVALID_JSON);
	}

	return true;
}

export function getJSONMetadata(content: string): MetadataAttributes {
	const buff = Buffer.from(content);

	const metadata = {
		buff,
		byteSize: buff.byteLength,
		mimetype: "application/json",
	};

	if (metadata.byteSize > MAXIMUM_FILE_SIZE) {
		throw new Error(ERRORS.CONTENT_TOO_LARGE);
	}

	return metadata;
}

export function getBase64Metadata(content: string): MetadataAttributes {
	const [fileData, data] = content.split("base64,");
	const buff = Buffer.from(data, "base64");
	const metadata = {
		buff,
		byteSize: buff.byteLength,
		mimetype: fileData.substring(fileData.indexOf(":") + 1, fileData.lastIndexOf(";")),
	};

	if (metadata.byteSize > MAXIMUM_FILE_SIZE) {
		throw new Error(ERRORS.CONTENT_TOO_LARGE);
	}

	if (!ACCEPTED_MIME_TYPES.includes(metadata.mimetype)) {
		throw new Error(ERRORS.UNSUPPORTED_FILE);
	}

	return metadata;
}

export function getContentMetadata(content: string): MetadataAttributes {
	if (isBase64String({ content })) {
		return getBase64Metadata(content);
	}

	if (isJSONString({ content })) {
		return getJSONMetadata(content);
	}

	throw new Error(ERRORS.INVALID_REQUEST);
}

export function generateGatewayURL(cid: CID | string): string {
	return `${process.env.IPFS_GATEWAY as string}/ipfs/${cid.toString()}`;
}

export function cidArrayDifference(arrayOne: CID[], arrayTwo: CID[]): CID[] {
	const arrayOfStringsTwo = arrayTwo.map((cid) => cid.toString());
	const diff = arrayOne.filter((v) => !arrayOfStringsTwo.includes(v.toString()));

	return diff;
}

export async function deleteFile(path: string): Promise<void> {
	try {
		await fs.unlink(path);
	} catch (error) {
		console.log("Unable to delete file:", path);
	}
}
