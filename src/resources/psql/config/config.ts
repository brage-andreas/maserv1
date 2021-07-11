import { CONFIG_OPTION_CHOICES } from "../../constants.js";
import { get, existsRow, existsTable } from "../util.js";

const createConfigRow = async (guildID: string) => {
	try {
		await get(`
            INSERT INTO config."${guildID}" (id)
            VALUES ('${guildID}');
        `);
	} catch (err) {
		return err;
	}
};

const createConfigTable = async (guildID: string) => {
	try {
		await get(`
            CREATE TABLE config."${guildID}"
                (
                    id bigint PRIMARY KEY,
                    ${CONFIG_OPTION_CHOICES.map((e) => `${e.value} bigint`).join(",\n")}
                );
        `);
	} catch (err) {
		return err;
	}
};

const check = async (table: string, id: string) => {
	if (!(await existsTable(table))) await createConfigTable(table);
	if (!(await existsRow(table, id, "config"))) await createConfigRow(table);
};

export const setValue = async (key: string, value: string, guildID: string) => {
	await check(guildID, guildID);

	await get(`
        UPDATE config."${guildID}"
        SET ${key} = ${value}
        WHERE id = ${guildID};
    `);
};

export const viewValue = async (key: string, guildID: string) => {
	await check(guildID, guildID);

	return (
		await get(`
        SELECT ${key}
        FROM config."${guildID}" 
        WHERE id = ${guildID};
    `)
	)[key];
};

export const removeValue = async (key: string, guildID: string) => {
	await setValue(key, "NULL", guildID);
};

export const viewConfig = async (guildID: string) => {
	await check(guildID, guildID);

	return await get(`
        SELECT *
        FROM config."${guildID}" 
        WHERE id = ${guildID};
    `);
};
