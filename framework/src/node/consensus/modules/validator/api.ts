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

import { BaseAPI } from '../../../../modules/base_api';
import { APIContext } from '../../../state_machine';

export class ValidatorAPI extends BaseAPI {
	// eslint-disable-next-line @typescript-eslint/require-await
	public async getGenerator(_apiContext: APIContext, _timestamp: number): Promise<Buffer> {
		return Buffer.alloc(0);
	}

	public getSlotNumber(_apiContext: APIContext, _timestamp: number): number {
		return 0;
	}

	public getSlotTime(_apiContext: APIContext, _slot: number): number {
		return 0;
	}
}
