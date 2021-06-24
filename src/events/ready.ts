import chalk from "chalk";

import { fCols } from "../resources/colours.js";
import { time } from "../resources/automaton.js";
import { DaClient } from "../resources/definitions.js";
const { fYellow, fGreen } = fCols;


export async function run(client: DaClient) {
    const [sec, min, hour] = time();
    const channels = client.channels.cache.size;
    const guilds = client.guilds.cache.size;
    const tag = client.user?.tag;
    const id = client.user?.id;

    console.log(chalk `  ${hour}:${min}:${sec} {grey =>} {${fGreen} Started}\n`);
    console.log(chalk `  {grey Alias} {${fYellow} ${tag}} {grey (${id})}`);
    console.log(chalk `  {grey In} ${guilds} {grey guilds and} ${channels} {grey channels}`);

    console.log("\n");
}