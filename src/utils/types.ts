import { type ACCEPTED_MIME_TYPES } from "../config";

export type MIME_TYPE = (typeof ACCEPTED_MIME_TYPES)[number];
export interface Base64MetadataAttributes {
	buff: Buffer;
	byteSize: number;
	mimetype: MIME_TYPE;
}
