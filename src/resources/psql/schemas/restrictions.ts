import { CONFIG_OPTION_CHOICES, RESTRICTIONS, RESTRICTIONS_STR } from "../../../constants.js";
import { get, existsRow, existsTable } from "../util.js";

const getFlags = (int: number) => {
	const vals = Object.values(RESTRICTIONS);
	const k = vals.length - 1;

	const flags = new Set<number>();

	if (vals.length) {
		for (let i = k; i >= 0; i--) {
			if (int - (1 << i) >= 0) {
				flags.add(vals[i]);
				int -= 1 << i;
			}
		}
	}

	return flags;
};

const hasRestriction = (restriction: RESTRICTIONS_STR, int: number) => {
	const flags = getFlags(int);
	const rst = RESTRICTIONS[restriction];

	return flags.has(rst);
};

export const updateRestriction = (restriction: RESTRICTIONS_STR, int: number, add: boolean) => {
	const faultyAdd = hasRestriction(restriction, int) && add;
	const faultyDel = !hasRestriction(restriction, int) && !add;
	if (faultyAdd || faultyDel) return int;

	const rst = RESTRICTIONS[restriction];
	return add ? int + rst : int - rst;
};

/*
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
	)?.[key];
};

export const removeValue = async (key: string, guildID: string) => {
	await setValue(key, "0", guildID);
};

export const viewConfig = async (guildID: string) => {
	await check(guildID, guildID);

	return await get(`
        SELECT *
        FROM config."${guildID}" 
        WHERE id = ${guildID};
    `);
};
*/
