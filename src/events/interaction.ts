import { Collection, Interaction } from "discord.js";
import { DaClient, CommandInterface, ArgsInterface } from "../resources/definitions.js"

export async function run(client: DaClient, interaction: Interaction) {
    if (interaction.isCommand()) {
        const { options, commandName } = interaction;
    
        const args: Collection<string, ArgsInterface> = new Collection();
        options.each(option => {
            args.set(option.name, option.value as typeof option.value);
        });
    
        const cmd: (CommandInterface | undefined) = client.commands.get(commandName);
        if (cmd) cmd.run(client, interaction, args);
    } /*else

    if (interaction.isMessageComponent()) { }*/
}   