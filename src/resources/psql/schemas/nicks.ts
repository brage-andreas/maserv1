import { get } from "../util.js";

const createNickRow = async (guildID: string, userID: string) => {
	await get(`
        INSERT INTO nicks."${guildID}" (id)
        VALUES ('${userID}')
        ON CONFLICT (id) DO NOTHING;
    `);
};

const createNickTable = async (guildID: string) => {
	await get(`
        CREATE TABLE IF NOT EXISTS nicks."${guildID}"
            (
                id bigint PRIMARY KEY,
                nicks text[]
            );
    `);
};

const check = async (guildID: string, userID: string) => {
	await createNickTable(guildID);
	await createNickRow(guildID, userID);
};

export const addNick = async (nick: string, userID: string, guildID: string) => {
	await check(guildID, userID);

	await get(`
        UPDATE nicks."${guildID}"
        SET nicks = array_append(nicks, '${nick}')
        WHERE id = ${userID};
    `);
};

export const getNick = async (userID: string, guildID: string) => {
	await check(guildID, userID);

	return (
		await get(`
        SELECT nicks
        FROM nicks."${guildID}" 
        WHERE id = ${userID};
    `)
	)?.nicks as string[] | undefined;
};
