import db from "./db.js";

export const get = async (query: string) => await db.one(query).catch(() => null);

export const existsRow = async (table: string, id: string, schema: string) => {
	const ans = await get(`
        SELECT EXISTS (
            SELECT 1 FROM ${schema}."${table}" 
            WHERE id = ${id}
        );
        `).catch(() => null);

	return ans?.exists ? true : false;
};

export const existsTable = async (table: string) => {
	const ans = await get(`
        SELECT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_catalog='maser' AND 
                table_schema='public' AND 
                table_name='${table}'
        );
        `).catch(() => null);

	return ans?.exists ? true : false;
};
