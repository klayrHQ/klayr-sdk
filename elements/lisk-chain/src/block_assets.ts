/*
 * Copyright © 2021 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 */

import { codec } from '@liskhq/lisk-codec';
import { MerkleTree } from '@liskhq/lisk-tree';
import { blockAssetSchema } from './schema';

export interface BlockAsset {
	moduleID: number;
	data: Buffer;
}

export class BlockAssets {
	private readonly _assets: BlockAsset[] = [];
	private _assetRoot!: Buffer;

	public constructor(assets: BlockAsset[] = []) {
		this._assets = assets;
	}

	public static fromBytes(values: ReadonlyArray<Buffer>): BlockAssets {
		const assets = values.map(val => codec.decode<BlockAsset>(blockAssetSchema, val));
		const blockAssets = new BlockAssets(assets);
		return blockAssets;
	}

	public static fromJSON(values: Record<string, unknown>[]): BlockAssets {
		const assets = values.map(val => codec.fromJSON<BlockAsset>(blockAssetSchema, val));
		return new BlockAssets(assets);
	}

	public async getRoot(): Promise<Buffer> {
		this._assetRoot = await this._calculateRoot();

		return this._assetRoot;
	}

	public getBytes(): Buffer[] {
		return this._assets.map(asset => codec.encode(blockAssetSchema, asset));
	}

	public getAsset(moduleID: number): Buffer | undefined {
		return this._assets.find(a => a.moduleID === moduleID)?.data;
	}

	public getAll(): BlockAsset[] {
		return [...this._assets];
	}

	public setAsset(moduleID: number, value: Buffer): void {
		const asset = this.getAsset(moduleID);
		if (asset) {
			throw new Error(`Module asset for "${moduleID}" is already set.`);
		}

		this._assets.push({ moduleID, data: value });
	}

	public sort(): void {
		this._assets.sort((a1, a2) => a1.moduleID - a2.moduleID);
	}

	private async _calculateRoot(): Promise<Buffer> {
		const merkleTree = new MerkleTree();
		await merkleTree.init(this.getBytes());

		return merkleTree.root;
	}
}
