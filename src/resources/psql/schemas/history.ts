/*
CREATE TABLE IF NOT EXISTS history."836889391602860052"
(
    id integer SERIAL PRIMARY KEY,
    ${RESTRICTIONS.map((e) => `${e} integer[]`).join(",\n")}
);
*/
