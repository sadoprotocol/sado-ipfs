import { CID } from "kubo-rpc-client";

import { ACCEPTED_MIME_TYPES, MAXIMUM_FILE_SIZE } from "../config";
import ERRORS from "../errors";
import { type Base64MetadataAttributes, type MIME_TYPE } from "./types";

export function parseCID(str: string): CID {
	try {
		return CID.parse(str);
	} catch (_error) {
		throw new Error(ERRORS.INVALID_CID);
	}
}

export function getBase64Metadata(content: string): Base64MetadataAttributes {
	if (!content.startsWith("data:") || !content.includes("base64,")) {
		throw new Error(ERRORS.INVALID_BASE64_CONTENT);
	}

	const [fileData, data] = content.split("base64,");
	const buff = Buffer.from(data, "base64");
	const metadata = {
		buff,
		byteSize: buff.byteLength,
		mimetype: fileData.substring(fileData.indexOf(":") + 1, fileData.lastIndexOf(";")) as MIME_TYPE,
	};

	validateBase64Content(metadata);

	return metadata;
}

export function validateBase64Content(metadata: Base64MetadataAttributes): void {
	if (metadata.byteSize > MAXIMUM_FILE_SIZE) {
		throw new Error(ERRORS.FILE_SIZE_OVER_LIMIT);
	}

	if (!ACCEPTED_MIME_TYPES.includes(metadata.mimetype)) {
		throw new Error(ERRORS.UNSUPPORTED_FILE);
	}
}

export function generateGatewayURL(cid: CID | string): string {
	return `${process.env.IPFS_GATEWAY as string}/ipfs/${cid.toString()}`;
}

export function cidArrayDifference(arrayOne: CID[], arrayTwo: CID[]): CID[] {
	const arrayOfStringsTwo = arrayTwo.map((cid) => cid.toString());
	const diff = arrayOne.filter((v) => !arrayOfStringsTwo.includes(v.toString()));

	return diff;
}
