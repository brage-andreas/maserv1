const data = {
    name: "say",
    description: "halalutrrh",
    options: [
        {
            name: "input",
            type: "STRING",
            description: "hva jeg skal sende #iol",
            required: true
        }
    ]
}

export default data;
export async function run(interaction, args) {
    await interaction.reply(args.get("input"));
};