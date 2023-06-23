/*
 * Copyright © 2022 Lisk Foundation
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

import { BaseCCMethod } from '../interoperability/base_cc_method';
import { CrossChainMessageContext } from '../interoperability/types';
import { InteroperabilityMethod, ModuleConfig, TokenMethod } from './types';
import { NamedRegistry } from '../named_registry';
import { CONTEXT_STORE_KEY_AVAILABLE_CCM_FEE } from './constants';
import { getContextStoreBigInt } from '../../state_machine';
import { RelayerFeeProcessedEvent } from './events/relayer_fee_processed';
import { getEncodedCCMAndID } from '../interoperability/utils';

// https://github.com/LiskHQ/lips/blob/main/proposals/lip-0048.md#cross-chain-update-processing
export class FeeInteroperableMethod extends BaseCCMethod {
	private readonly _moduleName: string;

	private _interopMethod!: InteroperabilityMethod;
	private _tokenMethod!: TokenMethod;
	private _feePoolAddress?: Buffer;

	public constructor(stores: NamedRegistry, events: NamedRegistry, moduleName: string) {
		super(stores, events);
		this._moduleName = moduleName;
	}

	public init(config: ModuleConfig): void {
		this._feePoolAddress = config.feePoolAddress;
	}

	public addDependencies(interoperabilityMethod: InteroperabilityMethod, tokenMethod: TokenMethod) {
		this._interopMethod = interoperabilityMethod;
		this._tokenMethod = tokenMethod;
	}

	public async beforeCrossChainCommandExecute(ctx: CrossChainMessageContext): Promise<void> {
		const messageTokenID = await this._interopMethod.getMessageFeeTokenID(
			ctx,
			ctx.ccm.sendingChainID,
		);
		await this._tokenMethod.lock(
			ctx.getMethodContext(),
			ctx.transaction.senderAddress,
			this._moduleName,
			messageTokenID,
			ctx.ccm.fee,
		);
		ctx.contextStore.set(CONTEXT_STORE_KEY_AVAILABLE_CCM_FEE, ctx.ccm.fee);
	}

	public async afterCrossChainCommandExecute(ctx: CrossChainMessageContext): Promise<void> {
		const messageTokenID = await this._interopMethod.getMessageFeeTokenID(
			ctx,
			ctx.ccm.sendingChainID,
		);
		await this._tokenMethod.unlock(
			ctx.getMethodContext(),
			ctx.transaction.senderAddress,
			this._moduleName,
			messageTokenID,
			ctx.ccm.fee,
		);

		const availableFee = getContextStoreBigInt(
			ctx.contextStore,
			CONTEXT_STORE_KEY_AVAILABLE_CCM_FEE,
		);
		const burntAmount = ctx.ccm.fee - availableFee;

		if (
			this._feePoolAddress &&
			(await this._tokenMethod.userAccountExists(ctx, this._feePoolAddress, messageTokenID))
		) {
			await this._tokenMethod.transfer(
				ctx.getMethodContext(),
				ctx.transaction.senderAddress,
				this._feePoolAddress,
				messageTokenID,
				burntAmount,
			);
		} else {
			await this._tokenMethod.burn(
				ctx.getMethodContext(),
				ctx.transaction.senderAddress,
				messageTokenID,
				burntAmount,
			);
		}

		const { ccmID } = getEncodedCCMAndID(ctx.ccm);

		this.events.get(RelayerFeeProcessedEvent).log(ctx, {
			burntAmount,
			relayerAddress: ctx.transaction.senderAddress,
			relayerAmount: availableFee,
			ccmID,
		});
		ctx.contextStore.delete(CONTEXT_STORE_KEY_AVAILABLE_CCM_FEE);
	}
}
