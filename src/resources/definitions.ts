import { ApplicationCommandData, Client, Collection, CommandInteraction } from "discord.js";
import { cols, fCols } from "./colours.js";

class DaClient extends Client {
    commands = new Collection<string, CommandInterface>();
    moji = new Collection<string, string>();
    colours = cols;
    formattedColours = fCols;
    
    mojis(...mojis: string[]): string[] {
        const emojiArray: string[] = [];
        mojis.forEach(emoji => {
            const em = this.emojis.cache.find(em => em.name === emoji);
            if (em) emojiArray.push(em.toString());
        });

        return emojiArray;
    }
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
    category: string;
    run(client: DaClient, interaction: CommandInteraction, args: Collection<string, ArgsInterface>): void;
}

interface BotLogNamesInterface {
    guildName?: string;
    channelName?: string;
    authorName?: string;
    authorID?: string;
}

type ArgsInterface = (string | number | boolean | undefined);

export { DaClient, CommandOptionsInterface, CommandDataInterface, CommandInterface, BotLogNamesInterface, ArgsInterface }
