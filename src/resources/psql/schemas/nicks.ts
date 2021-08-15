import { get } from "../util.js";

const createNickRow = async (guildId: string, userId: string, nick?: string) => {
	await get(`
        INSERT INTO nicks."${guildId}" (id ${nick ? ", nicks" : ""} )
        VALUES ('${userId}' ${nick ? ", ARRAY ['${nick}']" : ""})
        ON CONFLICT (id) DO NOTHING;
    `);
};

const createNickTable = async (guildId: string) => {
	await get(`
        CREATE TABLE IF NOT EXISTS nicks."${guildId}"
            (
                id bigint PRIMARY KEY,
                nicks text[]
            );
    `);
};

const check = async (guildId: string, userId: string, currentNick?: string) => {
	await createNickTable(guildId);
	await createNickRow(guildId, userId, currentNick);
};

export const addNick = async (guildId: string, userId: string, nick: string) => {
	await check(guildId, userId);

	await get(`
        UPDATE nicks."${guildId}"
        SET nicks = array_append(nicks, '${nick}')
        WHERE id = ${userId};
    `);
};

export const getNick = async (guildId: string, userId: string, currentNick?: string) => {
	await check(guildId, userId, currentNick);

	return (
		await get(`
        SELECT nicks
        FROM nicks."${guildId}" 
        WHERE id = ${userId};
    `)
	)?.nicks as string[] | undefined;
};

export const clearNick = async (guildId: string, userId: string) => {
	const hasNick = !!(await get(`
        SELECT nicks
        FROM nicks."${guildId}" 
        WHERE id = ${userId};
    `));

	if (hasNick) {
		await get(`
            DELETE FROM nicks."${guildId}"
            WHERE id = ${userId};
        `);
	}
};
