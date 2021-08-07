import db from "./db.js";

export const get = async (query: string): Promise<any | null> => await db.one(query).catch(() => null);

/*

INSERT INTO schema."table" (id)
VALUES ('123')
ON CONFLICT (id) DO NOTHING;


CREATE TABLE IF NOT EXISTS schema."table"
    (
        id bigint PRIMARY KEY,
        ...
    );

*/
