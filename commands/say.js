import { MessageActionRow, MessageButton } from "discord.js";

const data = {
    name: "say",
    description: "halalutrrh",
    options: [
        {
            name: "input",
            type: "STRING",
            description: "hva jeg skal sende #iol",
            required: true
        }
    ]
}

export default data;
export async function run(interaction, args) {
    const row = new MessageActionRow().addComponents(
        new MessageButton()
        .setCustomID("primary")
        .setLabel("lolbanan")
        .setStyle("PRIMARY")
    );
    await interaction.reply(args.get("input"), { components: [row] });
};