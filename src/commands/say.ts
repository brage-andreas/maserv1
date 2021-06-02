import { Collection, CommandInteraction } from "discord.js";

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
export async function run(interaction: CommandInteraction, args: Collection<string, any>) {
    await interaction.reply(args.get("input"));
};