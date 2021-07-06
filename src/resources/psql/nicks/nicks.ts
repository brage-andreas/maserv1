import { get, existsRow, existsTable } from "../util.js";

const createNickRow = async (guildID: string, userID: string) => {
	try {
		await get(`
            INSERT INTO nicks."${guildID}" (id)
            VALUES ('${userID}');
        `);
	} catch (err) {
		return err;
	}
};

const createNickTable = async (guildID: string) => {
	try {
		await get(`
            CREATE TABLE nicks."${guildID}"
                (
                    id bigint PRIMARY KEY,
                    nicks text[]
                );
        `);
	} catch (err) {
		return err;
	}
};

const check = async (guildID: string, userID: string) => {
	if (!(await existsTable(guildID))) await createNickTable(guildID);
	if (!(await existsRow(guildID, userID, "nicks"))) await createNickRow(guildID, userID);
};

const addNick = async (nick: string, userID: string, guildID: string) => {
	await check(guildID, userID);

	await get(`
        UPDATE nicks."${guildID}"
        SET nicks = array_append(nicks, '${nick}')
        WHERE id = ${userID};
    `);
};

const getNick = async (userID: string, guildID: string) => {
	await check(guildID, userID);

	return (
		await get(`
        SELECT nicks
        FROM nicks."${guildID}" 
        WHERE id = ${userID};
    `)
	)?.nicks as string[] | undefined;
};

export { addNick, getNick };
