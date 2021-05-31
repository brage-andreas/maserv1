export async function run(client) {
    console.log(`  >> READY <<\n  ${client.user.tag} (${client.user.id})\n  in ${client.guilds.cache.size} guilds\n\n`);
}