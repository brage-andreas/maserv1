import { DaClient } from "../resources/definitions.js";

interface rateLimitObjectInterface {
    timeout: number;
    limit: number;
    method: string;
    path: string;
    route: string;
    global: boolean;
}

export async function run(client: DaClient, limitObject: rateLimitObjectInterface) {
    console.log([
        `\n\n`,
        `  <AVOIDING RATE LIMIT>:`,
        `      Timeout: ${limitObject.timeout} ms`,
        `      ..Limit: ${limitObject.limit}`,
        `      .Method: ${limitObject.method}`,
        `      ...Path: ${limitObject.path}`,
        `      ..Route: ${limitObject.route}`,
        `      .Global: ${limitObject.global.toString().toUpperCase()}`,
        `\n\n`
    ].join("\n"));
}