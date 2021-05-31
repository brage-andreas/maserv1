import chalk from "chalk";
import { time } from "../resources/automaton.js";
import { formatted } from "../resources/colours.js";
const { yellow, green } = formatted;


export async function run(client) {
    const [sec, min, hour] = time();
    const channels = client.channels.cache.size;
    const guilds = client.guilds.cache.size;
    const tag = client.user.tag;
    const id = client.user.id;

    console.log(chalk `  {${yellow} ┌────────────────────┐}`)
    console.log(chalk `  {${yellow} │} ${hour}:${min}:${sec} • {${green} Started} {${yellow} │}`);
    console.log(chalk `  {${yellow} └────────────────────┘}\n`)
    
    console.log(chalk `  {${yellow} │} {grey Alias} ${tag} {grey (${id})}`);
    console.log(chalk `  {${yellow} │} {grey In} ${guilds} {grey guilds and} ${channels} {grey channels}`);

    console.log("\n");
}