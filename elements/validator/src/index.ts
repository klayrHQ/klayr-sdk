/*
 * Copyright © 2019 Lisk Foundation
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
 *
 */
import { validator, klayrschemaIdentifier, KlayrValidator } from './klayr_validator';
// To keep backward compatibility
import { KlayrerrorObject as ErrorObject } from './types';

export * from './validation';
export * from './errors';
export * from './constants';
export { validator, klayrschemaIdentifier, ErrorObject, KlayrValidator };
