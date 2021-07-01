import { GuildMember } from "discord.js";
import { DaClient } from "../resources/definitions.js";
import { addNick } from "../resources/psql/nicks/nicks.js";

export async function run(client: DaClient, oldMember: GuildMember, newMember: GuildMember) {
	if (oldMember.displayName !== newMember.displayName) {
		console.log("  new name");
		await addNick(newMember.displayName, newMember.user.id, newMember.guild.id);
	}
}
