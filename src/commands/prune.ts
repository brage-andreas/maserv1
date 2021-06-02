import { Channel, Collection, CommandInteraction, MessageActionRow, MessageButton, MessageComponentInteraction, TextChannel } from "discord.js";
import { CommandDataInterface } from "../resources/definitions.js";

const data: CommandDataInterface = {
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
export async function run(interaction: CommandInteraction, args: Collection<string, any>) {
    const { client, guild } = interaction;

    const allowedAmount = (n: number) => Math.ceil(n) > 100 ? 100 : Math.ceil(n) < 0 ? 0 : Math.ceil(n);
    const getChannel = (id?: string) => {
        let ch: Channel | null | undefined;
        if (id) ch = guild?.channels.cache.get(channelID)
        if (!id) ch = interaction.channel;
        return ch as TextChannel;
    }

    await interaction.reply("Jobber...", { ephemeral: true });

    const amount = allowedAmount(args.get("antall"));
    const targetID = args.get("kar");
    const channelID = args.get("kanal");

    const target = targetID ? await client.users.fetch(targetID) : null;
    const channel = getChannel(channelID);

    channel.messages.fetch({ limit: amount }).then(async messages => {
        const msgsToDelete = target ? messages.filter(msg => msg.author.id === target.id) : messages;

        const targetStr = target ? ` fra ${target}` : "";
        const channelStr = channelID ? ` i kanalen ${channel}` : "";
        
        const row = new MessageActionRow().addComponents(
            [ new MessageButton().setCustomID("ja").setLabel("Ja").setStyle("SUCCESS") ],
            [ new MessageButton().setCustomID("nei").setLabel("Nei").setStyle("DANGER") ]
        );

        const query = await interaction.editReply(`Sikker på at du vil slette ${msgsToDelete.size} meldinger${targetStr}${channelStr}`, { components: [row] });

        const filter = (interaction: MessageComponentInteraction) => interaction.customID === "ja" || interaction.customID === "nei";
        const collector = query.createMessageComponentInteractionCollector(filter, { time: 15000, maxProcessed: 1 });
        
        collector.on("collect", (interaction: MessageComponentInteraction) => {
            if (interaction.customID === "ja") {
                channel.bulkDelete(msgsToDelete, true).then(() => {
                    interaction.editReply("Gjort!", { components: [] });
                });
            } else
            
            if (interaction.customID === "nei") {
                collector.stop("nei")
            }

            return;
        });

        collector.on("end", (collected: Collection<string, MessageComponentInteraction>, reason: string) => {
            if (reason === "nei") {
                interaction.editReply("Okay!", { components: [] });
            }
            
            else {    
                interaction.editReply("Tidsavbrudt", { components: [] });
            }

            return;
        });
    });
};