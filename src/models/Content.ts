import { type CID } from "kubo-rpc-client";
import mongoose, { Schema, Document } from "mongoose";

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

interface IContent extends Document {
	cid: string;
	pinned?: boolean;
	metadata?: Record<string, unknown>;
	createdAt?: Date;
	updatedAt?: Date;
}

async function saveContentData({ cid, pinned, metadata }: SaveDataArgs): Promise<void> {
	// each cid should have only one record
	await ContentModel.findOneAndUpdate(
		{ cid: cid.toString() },
		{ $set: { cid: cid.toString(), metadata, pinned } },
		{ upsert: true }
	);
}

async function getContentData(cid: CID): Promise<IContent | null> {
	return ContentModel.findOne({ cid:cid.toString() });
}

export { ContentModel, saveContentData, getContentData };
