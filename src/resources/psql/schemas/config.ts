import { CONFIG_OPTION_CHOICES } from "../../../constants.js";
import { get } from "../util.js";

const createConfigRow = async (guildID: string) => {
	await get(`
            INSERT INTO config."${guildID}" (id)
            VALUES ('${guildID}')
            ON CONFLICT (id) DO NOTHING;
        `);
};

const createConfigTable = async (guildID: string) => {
	await get(`
            CREATE TABLE IF NOT EXISTS config."${guildID}"
                (
                    id bigint PRIMARY KEY,
                    ${CONFIG_OPTION_CHOICES.map((e) => `${e.value} bigint`).join(",\n")}
                );
        `);
};

const check = async (table: string, id: string) => {
	await createConfigTable(table);
	await createConfigRow(table);
};

export const setValue = async (key: string, value: string, guildID: string) => {
	await check(guildID, guildID);

	await get(`
        UPDATE config."${guildID}"
        SET ${key} = ${value}
    `);
};

export const viewValue = async (key: string, guildId: string) => {
	await check(guildId, guildId);

	return await get(`
        SELECT ${key}
        FROM config."${guildId}"
    `).then((res) => (res ? res[key] ?? null : null));
};

export const removeValue = async (key: string, guildID: string) => {
	await setValue(key, "NULL", guildID);
};

export const viewConfig = async (guildID: string) => {
	await check(guildID, guildID);

	return await get(`
        SELECT *
        FROM config."${guildID}"
    `);
};
