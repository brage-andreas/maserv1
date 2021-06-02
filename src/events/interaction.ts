import { Collection, Interaction } from "discord.js";
import { DaClient } from "../resources/definitions.js"

export async function run(client: DaClient, interaction: Interaction) {
    if (interaction.isCommand()) {
        const { options, commandName } = interaction;
    
        const args: Collection<string, any> = new Collection();
        options.forEach(option => {
            args.set(option.name, option.value);
        });
    
        const cmd = client.commands.get(commandName);
        if (cmd) cmd.run(interaction, args);
    } //else

    // if (interaction.isMessageComponent() && interaction.componentType === "BUTTON") { }
}