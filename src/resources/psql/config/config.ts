import { get, existsRow, existsTable } from "../util.js";

const createConfigRow = async (guildID: string, userID: string) => {
	try {
		await get(`
            INSERT INTO nicks."${guildID}" (id)
            VALUES ('${userID}');
        `);
	} catch (err) {
		return err;
	}
};

const createConfigTable = async (guildID: string) => {
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

const check = async (guildID: string, userID: string) => {
	if (!(await existsTable(guildID))) await createConfigTable(guildID);
	if (!(await existsRow(guildID, userID, "config"))) await createConfigRow(guildID, userID);
};
