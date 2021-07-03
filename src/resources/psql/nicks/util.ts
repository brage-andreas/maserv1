import db from "../db.js";

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
            SELECT 1 FROM nicks."${guildID}" 
            WHERE id = ${userID});`);

		return ans?.exists ? true : false;
	} catch (err) {
		return err;
	}
};

const existsTable = async (guildID: string) => {
	try {
		const ans = await get(`
        SELECT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_catalog='bigbot' AND 
                table_schema='public' AND 
                table_name='${guildID}'
        );`);

		return ans?.exists ? true : false;
	} catch (err) {
		return err;
	}
};

const createRow = async (guildID: string, userID: string) => {
	try {
		await get(`
            INSERT INTO nicks."${guildID}" (id)
            VALUES ('${userID}');
        `);
	} catch (err) {
		return err;
	}
};

const createTable = async (guildID: string) => {
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

export { get, existsRow, existsTable, createRow, createTable };
