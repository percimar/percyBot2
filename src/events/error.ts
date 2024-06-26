import { Events } from 'discord.js';
import type { Event } from './index.js';

export default {
	name: Events.Error,
	once: true,
	async execute(error) {
		console.error(error);
	},
} satisfies Event<Events.Error>;
