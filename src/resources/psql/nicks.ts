import { get, existsRow, existsTable, createRow, createTable } from "./tables.js";

const addNick = async (nick: string, userID: string, guildID: string) => {
	if (!(await existsTable(guildID))) await createTable(guildID);
	if (!(await existsRow(guildID, userID))) await createRow(guildID, userID);

	await get(`
        UPDATE nicks.${guildID}
        SET nicks = array_append(nicks, ${nick})
        WHERE id = ${userID};
    `);
};

const getNick = async (userID: string, guildID: string) => {
	if (!(await existsTable(guildID))) await createTable(guildID);
	if (!(await existsRow(guildID, userID))) await createRow(guildID, userID);

	return (
		await get(`
        SELECT nicks
        FROM nicks.${guildID} 
        WHERE id = ${userID};
    `)
	)?.nicks as string[] | undefined;
};

export { addNick, getNick };
