import { ApplicationCommandData, Client, Collection, CommandInteraction } from "discord.js";

class DaClient extends Client {
    commands = new Collection<string, CommandInterface>();
}

interface CommandOptionsInterface {
    name: string;
    type: "SUB_COMMAND" | "SUB_COMMAND_GROUP" | "STRING" | "INTEGER" | "BOOLEAN" | "USER" | "CHANNEL" | "ROLE" | "MENTIONABLE";
    description: string;
    required?: boolean;
    choices?: { name: string, value: string }[] 
}

interface CommandDataInterface {
    name: string;
    description: string;
    options?: CommandOptionsInterface[];
}

interface CommandInterface extends CommandDataInterface {
    default: ApplicationCommandData;
    run(interaction: CommandInteraction, args: Collection<string, any>): void;
}

interface BotLogNamesInterface {
    guildName?: string;
    channelName?: string;
    authorName?: string;
    authorID?: string;
}

export { DaClient, CommandOptionsInterface, CommandDataInterface, CommandInterface, BotLogNamesInterface }
