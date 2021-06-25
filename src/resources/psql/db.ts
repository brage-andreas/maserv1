import pgpImport from "pg-promise";
import dotenv from "dotenv"

const pgp = pgpImport()

dotenv.config();
const conStr = process.env.CONNECTIONSTR;

const db = pgp({ connectionString: conStr });

export default db;
