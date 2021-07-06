import db from "./db.js";

const get = async (query: string) => {
	try {
		return await db.one(query);
	} catch (err) {
		return err;
	}
};

const existsRow = async (guildID: string, userID: string, table: string) => {
	try {
		const ans = await get(`SELECT EXISTS (
            SELECT 1 FROM ${table}."${guildID}" 
            WHERE id = ${userID});`);

		return ans?.exists ? true : false;
	} catch (err) {
		return err;
	}
};

const existsTable = async (table: string) => {
	try {
		const ans = await get(`
        SELECT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_catalog='bigbot' AND 
                table_schema='public' AND 
                table_name='${table}'
        );`);

		return ans?.exists ? true : false;
	} catch (err) {
		return err;
	}
};

export { get, existsRow, existsTable };
