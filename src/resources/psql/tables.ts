import db from "./db.js";

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

export { get, existsRow, existsTable, createRow, createTable };
