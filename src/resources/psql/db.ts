import pgpImport from "pg-promise";
import dotenv from "dotenv";
dotenv.config();

const pgp = pgpImport();

const { DB_USER, DB_PASS, DB_PORT, DB_HOST, DB_BASENAME } = process.env;

const username = DB_USER;
const password = DB_PASS;
const name = DB_BASENAME;
const port = DB_PORT;
const host = DB_HOST;

const connectionString = `postgres://${username}:${password}@${host}:${port}/${name}`;

const db = pgp({ connectionString });

export default db;
