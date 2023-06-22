import { CID } from "kubo-rpc-client";

import ERRORS from "../errors";

export function parseCID(str: string): CID {
	try {
		return CID.parse(str);
	} catch (_error) {
		throw new Error(ERRORS.INVALID_CID);
	}
}

export function getBase64SizeInBytes(content: string): number {
	if (content.startsWith("data:") && content.includes("base64,")) {
		content = content.split("base64,")[1];
	}

	return Buffer.from(content, "base64").byteLength;
}
