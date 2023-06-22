import { MAXIMUM_FILE_SIZE, ONE_KB_IN_BYTES } from "../config";

const ERRORS = {
	UNAUTHORIZED: "Unauthorized",
	INVALID_REQUEST: "Invalid request",
	MISSING_FILE: "File is missing",
	UNSUPPORTED_FILE: "File type not supported",
	FILE_SIZE_OVER_LIMIT: `File size exceeds the maximum limit of ${MAXIMUM_FILE_SIZE / ONE_KB_IN_BYTES}kb`,
	INVALID_CID: "Invalid CID/content identifier",
	TOO_MANY_REQUESTS: "Rate limit exceeded",
	SERVER_ERROR: "Unable to process request. Try again later",
	INVALID_BASE64_CONTENT: "Invalid base64 content. Ensure the string starts with: data:<mime-type>;base64,",
};

export default ERRORS;
