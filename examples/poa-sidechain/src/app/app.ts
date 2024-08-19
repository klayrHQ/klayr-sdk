import { Application, Types } from 'klayr-sdk';
import { registerModules } from './modules';
import { registerPlugins } from './plugins';

export const getApplication = (config: Types.PartialApplicationConfig): Application => {
	const app = registerModules(config);
	registerPlugins(app);

	return app;
};
