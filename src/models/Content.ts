import { type CID } from "kubo-rpc-client";
import { Schema } from "mongoose";

import { connection } from "../db/client";

const ContentSchema = new Schema(
	{
		cid: {
			type: "string",
			unique: true,
		},
		pinned: Boolean,
		metadata: Object,
	},
	{
		timestamps: true,
	}
);

const ContentModel = connection.model("Content", ContentSchema, "content");

interface SaveDataArgs {
	cid: CID;
	pinned: boolean;
	metadata: {
		byteSize: number;
		mimetype: string;
	};
}

async function saveContentData({ cid, pinned, metadata }: SaveDataArgs): Promise<void> {
	// each cid should have only one record
	await ContentModel.findOneAndUpdate(
		{ cid: cid.toString() },
		{ $set: { cid: cid.toString(), metadata, pinned } },
		{ upsert: true }
	);
}

export { ContentModel, saveContentData };
