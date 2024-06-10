import type { Channel, Client } from 'discord.js';
import { Events } from 'discord.js';
import { Repository } from '../util/db.js';
import type { Event } from './index.js';

export default {
	name: Events.PresenceUpdate,
	async execute(oldPresence, newPresence) {
		if (!Repository.get('featureToggles.spawnCamp')) return;
		if (oldPresence?.status !== 'offline') return;
		if (!newPresence) return;

		const spawnCamps = Repository.get('spawnCamps');
		for (const spawnCamp of spawnCamps.filter((spawnCamp) => spawnCamp.targetId === newPresence?.userId)) {
			const channel = await getChannel(newPresence.client, spawnCamp.channelId);
			if (channel.isTextBased()) {
				await channel.send(spawnCamp.messages[0]); // TODO: grab random message
			}
		}
	},
} satisfies Event<Events.PresenceUpdate>;

async function getChannel(client: Client, channelId: string): Promise<Channel> {
	const cachedChannel = client.channels.cache.get(channelId);
	if (cachedChannel) return cachedChannel;

	const fetchedChannel = await client.channels.fetch(channelId);
	return fetchedChannel!;
}
