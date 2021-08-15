import { GuildMember } from "discord.js";
import { DaClient } from "../resources/definitions.js";
import { addNick, getNick } from "../resources/psql/schemas/nicks.js";

export async function run(client: DaClient, oldMember: GuildMember, newMember: GuildMember) {
	if (oldMember.displayName !== newMember.displayName) {
		// TODO real system for current name on first timers
		await getNick(newMember.guild.id, newMember.user.id, oldMember.displayName); // to set current name
		await addNick(newMember.guild.id, newMember.user.id, newMember.displayName);
	}
}
