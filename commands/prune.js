import { MessageActionRow, MessageButton } from "discord.js";

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
 
    await interaction.reply("Jobber...", { ephemeral: true });

    const amount = allowedAmount(args.get("antall"));
    const targetID = args.get("kar");
    const channelID = args.get("kanal");

    const target = targetID ? await client.users.fetch(targetID) : null;
    const channel = channelID ? guild.channels.cache.get(channelID) : interaction.channel;

    channel.messages.fetch({ limit: amount }).then(async messages => {
        const msgsToDelete = target ? messages.filter(msg => msg.author.id === target.id) : messages;

        const targetStr = target ? ` fra ${target}` : "";
        const channelStr = channelID ? ` i kanalen ${channel}` : "";
        
        const row = new MessageActionRow().addComponents(
            [ new MessageButton().setCustomID("ja").setLabel("Ja").setStyle("SUCCESS") ],
            [ new MessageButton().setCustomID("nei").setLabel("Nei").setStyle("DANGER") ]
        );

        const query = await interaction.editReply(`Sikker på at du vil slette ${msgsToDelete.size} meldinger${targetStr}${channelStr}`, { components: [row], ephemeral: true });

        const filterPositive = interaction => interaction.customID === "ja";
        const filterNegative = interaction => interaction.customID === "nei";
        const collectorPositive = query.createMessageComponentInteractionCollector(filterPositive, { time: 15000, maxProcessed: 1 });
        const collectorNegative = query.createMessageComponentInteractionCollector(filterNegative, { time: 15000, maxProcessed: 1 });
        
        collectorPositive.on("collect", () => { 
            channel.bulkDelete(msgsToDelete, true).then(() => {
                interaction.editReply("Gjort!", { ephemeral: true, components: [] });
            });
            return;
        });

        collectorNegative.on("collect", () => {
            interaction.editReply("Okay!", { ephemeral: true, components: [] });
            return;
        });

        collectorPositive.on("end", () => {
            interaction.editReply("Okay!", { ephemeral: true, components: [] });
            return;
        });

        collectorNegative.on("end", () => {
            interaction.editReply("Okay!", { ephemeral: true, components: [] });
            return;
        });
    });
};