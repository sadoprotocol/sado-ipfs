import { type CID, create as createNode, type IPFSHTTPClient } from "kubo-rpc-client";

import ERRORS from "../errors";

export default class IPFSCore {
	protected readonly loaded: Promise<boolean>;
	private instance!: IPFSHTTPClient;

	private loadedResolve: (value: boolean | PromiseLike<boolean>) => void = () => {};

	constructor() {
		this.loaded = new Promise((resolve) => {
			this.loadedResolve = (value) => {
				resolve(value);
			};

			this.init();
		});
	}

	private validateEnvVariables(): void {
		if (!process.env.IPFS_GATEWAY) {
			throw new Error(ERRORS.IPFS_GATEWAY_NOT_CONFIGURED);
		}

		if (!process.env.IPFS_API) {
			throw new Error(ERRORS.IPFS_API_NOT_CONFIGURED);
		}
	}

	private init(): void {
		if (this.instance) return;

		this.validateEnvVariables();
		this.setupNode();
		this.loadedResolve(true);
	}

	private setupNode(): void {
		this.instance = createNode({ url: process.env.IPFS_API });
	}

	async add(buff: Buffer, pin: boolean = false): Promise<CID> {
		await this.loaded;

		const { cid } = await this.instance.add(buff, {
			pin,
			cidVersion: 1,
		});
		return cid;
	}

	async pin(cid: CID[]): Promise<CID[]> {
		await this.loaded;

		const pinned: CID[] = [];
		const cids: CID[] = !Array.isArray(cid) ? [cid] : cid;
		const input = cids.map((cid) => {
			return { cid };
		});

		for await (const pinnedCID of this.instance.pin.addAll(input)) {
			pinned.push(pinnedCID);
		}

		return pinned;
	}

	async unpin(cid: CID[]): Promise<CID[]> {
		await this.loaded;

		const unpinned: CID[] = [];
		const cids: CID[] = !Array.isArray(cid) ? [cid] : cid;
		const input = cids.map((cid) => {
			return { cid };
		});

		// unpinning a CID that's not already pinned throws error
		try {
			for await (const unpinnedCID of this.instance.pin.rmAll(input)) {
				unpinned.push(unpinnedCID);
			}
		} catch (error) {}

		return unpinned;
	}

	async isPinned(cid: CID): Promise<boolean> {
		try {
			for await (const { cid: _cid } of this.instance.pin.ls({ paths: cid, type: "recursive" })) {
				if (_cid.equals(cid)) return true;
			}
		} catch (error) {
			return false;
		}

		return false;
	}
}

export const ipfsCore = new IPFSCore();
