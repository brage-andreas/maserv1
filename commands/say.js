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
export function run(interaction, args) {
    interaction.reply(args.get("input"));
};