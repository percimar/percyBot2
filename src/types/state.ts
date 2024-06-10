import type { SpawnCamp } from './spawn-camp.js';

export type State = {
	featureToggles: {
		spawnCamp: boolean;
	};
	spawnCamps: SpawnCamp[];
};
