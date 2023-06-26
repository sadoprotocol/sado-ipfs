import { type CID } from "kubo-rpc-client";
import mongoose, { Schema } from "mongoose";

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

const ContentModel = mongoose.model("Content", ContentSchema, "content");

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
