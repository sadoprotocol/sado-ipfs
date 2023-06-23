export interface MetadataAttributes {
	buff: Buffer;
	byteSize: number;
	mimetype: string;
}

export interface StringCheckArgs {
	content: string;
	throwError?: boolean;
}
