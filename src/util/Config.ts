import type { Collection, Guild, GuildChannel, Role, ThreadChannel } from "discord.js";
import { ID_REGEX } from "../constants.js";

import { viewConfig, viewValue } from "../resources/psql/schemas/config.js";

export class Config {
	public guild: Guild;

	private channels: Collection<string, GuildChannel | ThreadChannel>;
	private roles: Collection<string, Role>;

	constructor(guild: Guild) {
		this.guild = guild;

		this.channels = guild.channels.cache;
		this.roles = guild.roles.cache;
	}

	public getNameFromId(id: string) {
		id = id.replace(/\D+/g, "");
		return this.channels.get(id)?.toString() ?? this.roles.get(id)?.toString() ?? "unknown";
	}

	public getIdFromName(name: string) {
		return (
			this.channels.find((ch) => ch.name.toLowerCase().startsWith(name)) ??
			this.roles.find((roles) => roles.name.toLowerCase().startsWith(name)) ??
			null
		);
	}

	public async view(key?: string) {
		let response: any;
		if (key) {
			response = await viewValue(key, this.guild.id);
		} else {
			response = await viewConfig(this.guild.id);
		}

		const msg = response
			? ID_REGEX.test(response)
				? `Is set to ${this.getNameFromId(response)} (${response})`
				: ` Is set to ${response}`
			: "Not set";

		return msg;
	}
}
