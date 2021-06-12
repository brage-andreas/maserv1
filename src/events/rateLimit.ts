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
        `  <RATE LIMITED>:`,
        `      Timeout: ${limitObject.timeout}`,
        `      ..Limit: ${limitObject.limit}`,
        `      .Method: ${limitObject.method}`,
        `      ...Path: ${limitObject.path}`,
        `      ..Route: ${limitObject.route}`,
        `      .Global: ${limitObject.global}`,
        `\n\n`
    ].join("\n"));
}