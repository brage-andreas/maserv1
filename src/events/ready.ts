import chalk from "chalk";
import { Collection, GuildEmoji } from "discord.js";

import { fCols } from "../resources/colours.js";
import { time } from "../resources/automaton.js";
import { DaClient } from "../resources/definitions.js";
const { fYellow, fGreen } = fCols;


export async function run(client: DaClient) {
    const [sec, min, hour] = time();
    const channels: number = client.channels.cache.size;
    const guilds: number = client.guilds.cache.size;
    const tag: (string | undefined) = client.user?.tag;
    const id: (string | undefined) = client.user?.id;

    const privateEmojis: Collection<`${bigint}`, GuildEmoji> = client.emojis.cache.each(emoji => emoji.guild.id === "349183996040577025");
    privateEmojis.forEach((emoji: GuildEmoji) => {
        if (!emoji.name) return;
        client.moji.set(emoji.name, emoji.toString());
    });

    console.log(chalk `  ${hour}:${min}:${sec} {grey =>} {${fGreen} Started}\n`);
    console.log(chalk `  {grey Alias} {${fYellow} ${tag}} {grey (${id})}`);
    console.log(chalk `  {grey In} ${guilds} {grey guilds and} ${channels} {grey channels}`);

    console.log("\n");
}