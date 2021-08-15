import type { DaClient } from "../resources/definitions";
import { getEventFiles } from "./getJSFiles.js";
import { EventLogger } from "./Logger.js";

export default class EventManager {
	private _client: DaClient;
	public logger: EventLogger;

	constructor(client: DaClient) {
		this._client = client;
		this.logger = new EventLogger();
	}

	public async init() {
		const events = await getEventFiles();

		events.forEach((event, name) => {
			this._client.on(name, (...args: unknown[]) => event.run(this._client, ...args));
		});
	}
}
