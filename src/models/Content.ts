import { type CID } from "kubo-rpc-client";

import { prisma } from "../db/client";

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
	await prisma.content.upsert({
		create: {
			cid: cid.toString(),
			metadata,
			pinned,
		},
		update: {
			pinned,
		},
		where: {
			cid: cid.toString(),
		},
	});
}

export { saveContentData };
