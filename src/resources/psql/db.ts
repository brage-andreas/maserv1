import pgpImport from "pg-promise";
import dotenv from "dotenv";
dotenv.config();

const pgp = pgpImport();

const username = process.env.PSQL_USER;
const password = process.env.PSQL_PASS;
const port = process.env.PSQL_PORT;
const host = process.env.PSQL_HOST;
const name = process.env.PSQL_DB_NAME;

const connectionString = `postgres://${username}:${password}@${host}:${port}/${name}`;

const db = pgp({ connectionString });

export default db;
