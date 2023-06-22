import { type CID, create as createNode, type IPFSHTTPClient } from "kubo-rpc-client";

export default class IPFSCore {
	protected readonly loaded: Promise<boolean>;
	private instance!: IPFSHTTPClient;

	private readonly encoder = new TextEncoder();
	private readonly decoder = new TextDecoder();

	private loadedResolve: (value: boolean | PromiseLike<boolean>) => void = () => {};

	constructor() {
		this.loaded = new Promise((resolve) => {
			this.loadedResolve = (value) => {
				resolve(value);
			};

			this.init();
		});
	}

	private init(): void {
		if (this.instance === undefined) {
			this.setupNode();
			this.loadedResolve(true);
		}
	}

	private setupNode(): void {
		const { IPFS_API } = process.env;
		if ((IPFS_API ?? "") === "") {
			throw new Error("Invalid API URL");
		}

		this.instance = createNode({ url: IPFS_API });
	}

	async add(buff: Buffer): Promise<CID> {
		await this.loaded;

		const { cid } = await this.instance.add(buff, {
			pin: false,
			cidVersion: 1,
		});
		return cid;
	}

	async get(cid: CID): Promise<string> {
		await this.loaded;

		const payload: string[] = [];
		for await (const chunk of this.instance.cat(cid)) {
			payload.push(
				this.decoder.decode(chunk, {
					stream: true,
				})
			);
		}

		return payload.join();
	}

	async pin(cid: CID[]): Promise<CID[]> {
		await this.loaded;

		const cids: CID[] = !Array.isArray(cid) ? [cid] : cid;
		const input = cids.map((cid) => {
			return { cid };
		});
		const pinnedCIDs: CID[] = [];

		for await (const pinnedCID of this.instance.pin.addAll(input)) {
			pinnedCIDs.push(pinnedCID);
		}

		return pinnedCIDs;
	}

	async unpin(cid: CID[]): Promise<CID[]> {
		await this.loaded;

		const cids: CID[] = !Array.isArray(cid) ? [cid] : cid;
		const input = cids.map((cid) => {
			return { cid };
		});
		const unpinned: CID[] = [];

		// unpinning a CID that's not already pinned throws error
		try {
			for await (const unpinnedCID of this.instance.pin.rmAll(input)) {
				unpinned.push(unpinnedCID);
			}
		} catch (error) {}

		return unpinned;
	}
}

export const ipfsCore = new IPFSCore();
