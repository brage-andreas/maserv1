export async function run(client, msg) {
    const { content, author, guild, channel } = msg;
    const botOwner = (query) => content.toLowerCase() === query && author.id === client.application?.owner.id;

    if (!client.application?.owner) await client.application?.fetch();

	if (botOwner("?deploy")) {
		const data = client.commands.map(cmd => cmd.default);
		await guild.commands.set(data);
    }

    if (botOwner("?clear")) {
        await guild.commands.set([]);
    }

    if (content === "lol") {
        channel.send("iolbanan", { allowedMentions: { repliedUser: false }, reply: { messageReference: msg.id } })
    }
}