import { MAXIMUM_FILE_SIZE, ONE_KB_IN_BYTES } from "../config";

const ERRORS = {
	NOT_FOUND: "Not found",
	IPFS_API_NOT_CONFIGURED: "IPFS_API not configured in .env",
	IPFS_GATEWAY_NOT_CONFIGURED: "IPFS_GATEWAY not configured in .env",
	UNAUTHORIZED: "Unauthorized",
	INVALID_REQUEST: "Invalid request",
	MISSING_FILE: "File is missing",
	UNSUPPORTED_FILE: "File type not supported",
	CONTENT_TOO_LARGE: `Content too large; Max: ${MAXIMUM_FILE_SIZE / ONE_KB_IN_BYTES}kb`,
	INVALID_CID: "Invalid CID/content identifier",
	TOO_MANY_REQUESTS: "Rate limit exceeded",
	SERVER_ERROR: "Unable to process request. Try again later",
	INVALID_BASE64: "Invalid base64 content. Ensure the string starts with: data:<mime-type>;base64,",
	INVALID_JSON: "Invalid JSON string",
};

export default ERRORS;
