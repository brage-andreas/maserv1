import { Collection, CommandInteraction } from "discord.js";
import { DaClient } from "../resources/definitions";

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
export async function run(client: DaClient, interaction: CommandInteraction, args: Collection<string, any>) {
    await interaction.reply(args.get("input"));
};