import chalk from "chalk";

import { formatted } from "../resources/colours.js";
import { time } from "../resources/automaton.js";
const { yellow, green } = formatted;


export async function run(client) {
    const [sec, min, hour] = time();
    const channels = client.channels.cache.size;
    const guilds = client.guilds.cache.size;
    const tag = client.user.tag;
    const id = client.user.id;

    console.log(chalk `  {grey ┌────────────────────┐}`)
    console.log(chalk `  {grey │} ${hour}:${min}:${sec} • {${green} Started} {grey │}`);
    console.log(chalk `  {grey └────────────────────┘}\n`)
    
    console.log(chalk `  {grey │} {grey Alias} {${yellow} ${tag}} {grey (${id})}`);
    console.log(chalk `  {grey │} {grey In} ${guilds} {grey guilds and} ${channels} {grey channels}`);

    console.log("\n");
}