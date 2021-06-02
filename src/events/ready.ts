import chalk from "chalk";

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

    console.log(chalk `  {grey ┌────────────────────┐}`)
    console.log(chalk `  {grey │} ${hour}:${min}:${sec} • {${fGreen} Started} {grey │}`);
    console.log(chalk `  {grey └────────────────────┘}\n`)
    
    console.log(chalk `  {grey │} {grey Alias} {${fYellow} ${tag}} {grey (${id})}`);
    console.log(chalk `  {grey │} {grey In} ${guilds} {grey guilds and} ${channels} {grey channels}`);

    console.log("\n");
}