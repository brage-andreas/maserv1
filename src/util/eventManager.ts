import type { DaClient } from "../resources/definitions";
import { getEventFiles } from "./getJSFiles.js";

export class EventManager {
	private _client: DaClient;

	constructor(client: DaClient) {
		this._client = client;
	}

	public async init() {
		const events = await getEventFiles("./events/");

		events.forEach((event, name) => {
			this._client.on(name, (...args: unknown[]) => event.run(this._client, ...args));
		});
	}
}
