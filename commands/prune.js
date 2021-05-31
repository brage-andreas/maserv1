const data = {
    name: "prune",
    description: "slett halalutrrh",
    options: [
        {
            name: "antall",
            type: "INTEGER",
            description: "hvor mange meldinger",
            required: true
        },
        {
            name: "kar",
            type: "USER",
            description: "hvem å slette meldinger til"
        },
        {
            name: "kanal",
            type: "CHANNEL",
            description: "hvor å slette meldinger"
        }
    ]
}

export default data;
export async function run(interaction, args) {
    const { client, guild } = interaction;
    const allowedAmount = (n) => Math.ceil(n) > 100 ? 100 : Math.ceil(n) < 0 ? 0 : Math.ceil(n); 

    await interaction.defer({ ephemeral: true });

    const amount = allowedAmount(args.get("antall"));
    const targetID = args.get("kar");
    const channelID = args.get("kanal");

    const target = targetID ? await client.users.fetch(targetID) : null;
    const channel = channelID ? guild.channels.cache.get(channelID) : interaction.channel;

    channel.messages.fetch({ limit: amount }).then(messages => {
        const msgsToDelete = target ? messages.filter(msg => msg.author.id === target.id) : messages;

        const targetStr = target ? ` fra ${target.tag}` : "";
        const channelStr = channelID ? ` i kanalen ${channel}` : "";
        channel.bulkDelete(msgsToDelete, true).then(deleted => {
            interaction.editReply(`Sletta ${deleted.size} meldinger${targetStr}${channelStr}`, { ephemeral: true });
        });
    });
};