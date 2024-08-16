/*
 * Copyright © 2020 Lisk Foundation
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
import { isIPv4 } from 'net';
import { Netmask } from 'netmask';
import { Request, Response, NextFunction } from 'express';
import { ErrorWithStatus } from './errors';

const defualtOption = { whiteList: [] };

const checkIpInList = (list: ReadonlyArray<string>, addr: string): boolean => {
	for (const value of list) {
		let entry = value;
		if (isIPv4(entry)) {
			entry += '/32';
		}
		const block = new Netmask(entry);
		if (block.contains(addr)) {
			return true;
		}
	}
	return false;
};

export const whiteListMiddleware =
	({ whiteList }: { whiteList: ReadonlyArray<string> } = defualtOption) =>
	(req: Request, _res: Response, next: NextFunction): void => {
		if (whiteList.length === 0 || checkIpInList(whiteList, req.ip)) {
			next();
			return;
		}

		next(new ErrorWithStatus('Access Denied', 401));
	};
