import { JSONObject } from 'klayr-sdk';

export interface ModuleConfig {
	maxMessageLength: number;
	minMessageLength: number;
	blacklist: string[];
}

export type ModuleConfigJSON = JSONObject<ModuleConfig>;
