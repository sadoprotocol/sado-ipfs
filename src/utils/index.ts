import { CID } from "kubo-rpc-client";

import { ACCEPTED_MIME_TYPES, MAXIMUM_FILE_SIZE } from "../config";
import ERRORS from "../errors";

export function parseCID(str: string): CID {
	try {
		return CID.parse(str);
	} catch (_error) {
		throw new Error(ERRORS.INVALID_CID);
	}
}

export function getBase64Metadata(content: string): Record<string, any> {
	if (!content.startsWith("data:") || !content.includes("base64,")) {
		throw new Error(ERRORS.INVALID_BASE64_CONTENT);
	}

	const [metadata, data] = content.split("base64,");
	const mimetype = metadata.substring(metadata.indexOf(":") + 1, metadata.lastIndexOf(";"));
	const buff = Buffer.from(data, "base64");

	return {
		buff,
		byteSize: buff.byteLength,
		mimetype,
	};
}

export function validateBase64Content(content: string): Record<string, any> {
	const metadata = getBase64Metadata(content);
	if (metadata.byteSize > MAXIMUM_FILE_SIZE) {
		throw new Error(ERRORS.FILE_SIZE_OVER_LIMIT);
	}

	if (!ACCEPTED_MIME_TYPES.includes(metadata.mimetype)) {
		throw new Error(ERRORS.UNSUPPORTED_FILE);
	}

	return metadata;
}
