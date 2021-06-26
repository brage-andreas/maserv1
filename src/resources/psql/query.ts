import db from "./db.js";

/*
UPDATE nicks.guild_GUILDID
SET nicks = array_append(nicks, NICK)
WHERE id = USERID;
*/

/*
SELECT nicks FROM nicks.guild_486548195137290265 
*/

const get = async (query: string) => {
	try {
		return await db.one(query);
	} catch (err) {
		return err;
	}
};

const existsRow = async (guildID: string, userID: string) => {
	try {
		const ans = await get(`SELECT EXISTS (
            SELECT * 
            FROM nicks.guild_${guildID} 
            WHERE id = ${userID});`);

		return ans?.exists ? true : false;
	} catch (err) {
		return err;
	}
};

const existsTable = async (guildID: string) => {
	try {
		const ans = await get(`SELECT EXISTS (
            SELECT * 
            FROM nicks.tables 
            WHERE table_name = guild_${guildID});`);

		return ans?.exists ? true : false;
	} catch (err) {
		return err;
	}
};

const createRow = async (guildID: string, userID: string) => {
	if (await existsRow(guildID, userID)) return;
	try {
		await get(`
            INSERT INTO nicks.guild_${guildID} (id, nicks)
            VALUES (${userID}, {});
        `);
	} catch (err) {
		return err;
	}
};

const createTable = async (guildID: string) => {
	if (await existsTable(guildID)) return;
	try {
		await get(`
            CREATE TABLE nicks.guild_${guildID}
                (
                    id bigint NOT NULL,
                    nicks text[] COLLATE pg_catalog."default",
                    CONSTRAINT guild_${guildID}_pkey PRIMARY KEY (id)
                )

            TABLESPACE pg_default;

            ALTER TABLE nicks.guild_${guildID} OWNER to postgres;
        `);
	} catch (err) {
		return err;
	}
};

const addNick = async (nick: string, userID: string, guildID: string) => {
	if (!(await existsTable(guildID))) await createTable(guildID);
	if (!(await existsRow(guildID, userID))) await createRow(guildID, userID);

	await get(`
        UPDATE nicks.guild_${guildID}
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
        FROM nicks.guild_${guildID} 
        WHERE id = ${userID};
    `)
	)?.nicks;
};

export { get, existsRow, existsTable, createRow, createTable, addNick, getNick };
