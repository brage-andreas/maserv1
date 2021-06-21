import chalk from "chalk";
import { Collection, CommandInteraction, Message, MessageActionRow,
         MessageButton, MessageComponentInteraction, TextChannel, User } from "discord.js";

import { ArgsInterface, CommandDataInterface, DaClient } from "../../resources/definitions.js";
import { botLog } from "../../resources/automaton.js";
import { fCols } from "../../resources/colours.js";

const { fGreen } = fCols;

const data: CommandDataInterface = {
    name: "prune",
    description: "Slett opptil 100 meldinger i en kanal fra samme server",
    options: [
        {
            name: "antall",
            type: "INTEGER",
            description: "Hvor mange meldinger",
            required: true
        },
        {
            name: "kar",
            type: "USER",
            description: "Hvem å slette meldinger til"
        },
        {
            name: "kanal",
            type: "CHANNEL",
            description: "Hvor å slette meldinger"
        }
    ]
}

export { data };
export async function run(client: DaClient, interaction: CommandInteraction, args: Collection<string, ArgsInterface>) {
    const { guild, user } = interaction;

    const allowedAmount = (n: number): number => Math.ceil(n) > 100 ? 100 : Math.ceil(n) < 0 ? 0 : Math.ceil(n);
    const getChannel = (id?: `${bigint}`) => {
        let ch: unknown;
        if (id) ch = guild?.channels.cache.get(id)
        if (!id) ch = interaction.channel;
        return ch as TextChannel;
    }

    await interaction.reply({ content: "Jobber...", ephemeral: true });

    const amount: number = allowedAmount(args.get("antall") as number);
    const targetID: `${bigint}` = args.get("kar") as `${bigint}`;
    const channelID: `${bigint}` = args.get("kanal") as `${bigint}`;

    const target: User | null = targetID ? await client.users.fetch(targetID) : null;
    const channel: TextChannel = getChannel(channelID);
    
    channel.messages.fetch({ limit: amount }).then(async (messages: Collection<`${bigint}`, Message>) => {
        const msgsToDelete: Collection<`${bigint}`, Message> = target ? messages.filter(msg => msg.author.id === target.id) : messages;

        const targetStr: string = target ? ` fra ${target}` : "";
        const channelStr: string = channelID ? ` i kanalen ${channel}` : "";
        
        const row: MessageActionRow = new MessageActionRow().addComponents(
            [ new MessageButton().setCustomID("ja").setLabel("Ja").setStyle("SUCCESS") ],
            [ new MessageButton().setCustomID("nei").setLabel("Nei").setStyle("DANGER") ]
        );

        const query: Message = await interaction.editReply({ content: `Sikker på at du vil slette ${msgsToDelete.size} meldinger${targetStr}${channelStr}`, components: [row] }) as Message;

        const filter = (interaction: MessageComponentInteraction) => interaction.customID === "ja" || interaction.customID === "nei";
        const collector = query.createMessageComponentInteractionCollector(filter, { time: 15000 });
        
        collector.on("collect", (collectedInteraction: MessageComponentInteraction) => {
            if (collectedInteraction.customID === "ja") {
                channel.bulkDelete(msgsToDelete, true).then((messages: Collection<`${bigint}`, Message>) => {
                    interaction.editReply({ content: "Gjort!", components: [] });
                    
                    botLog(chalk `{${fGreen} PRUNE} {grey > Deleted} ${messages.size} {grey messages}`,
                    { authorName: user.tag, authorID: user.id, channelName: channel.name, guildName: guild?.name });
                });
                collector.stop("fromCollected")
            } else
            
            if (collectedInteraction.customID === "nei") {
                collector.stop("fromCollected")
            }
        });

        collector.on("end", (collected: Collection<string, MessageComponentInteraction>, reason: string) => {
            if (reason === "fromCollected") interaction.editReply({ content: "Okay!", components: [] });

            else interaction.editReply({ content: "Tidsavbrudt", components: [] });
        });
    });
};