import { mkdir, readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';
import { get, set } from 'lodash-es';
import type { PathValue, Paths } from '../types/paths.js';
import type { State } from '../types/state.js';

// Simple in-memory persistent db, will move to an actual db when scale requires.
const initialState: State = {
	featureToggles: { spawnCamp: false },
	spawnCamps: [],
};
let db: State;

export const Repository = {
	async bootstrap() {
		const file = await readFile('dump/state.json', { encoding: 'utf8' }).catch(() => undefined);
		if (file) {
			// TODO: validate
			db = JSON.parse(file);
		} else {
			console.warn('No starting state found');
			db = initialState;
		}

		console.log({ db });
	},

	async close(this: void) {
		console.log('Saving db...');
		await mkdir('dump', { recursive: true });
		await writeFile('dump/state.json', JSON.stringify(db), { encoding: 'utf8', flag: 'w' });
		console.log('DB saved.');
		process.exit(0);
	},

	set<PATH extends Paths<State>>(path: PATH, value: PathValue<State, PATH>) {
		set(db, path, value);
	},

	get<PATH extends Paths<State>>(path: PATH) {
		return get(db, path) as PathValue<State, PATH>;
	},
};

process.on('SIGTERM', Repository.close);
process.on('SIGINT', Repository.close);
