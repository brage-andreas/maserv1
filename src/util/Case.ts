import type { GuildMember, User } from "discord.js";
import { get } from "../resources/psql/util";

export class Case {
	/*
        caseId  | userId | authorId | reason | nsfw    | duration
        integer | bigint | bigint   | text   | integer | timestamp without time zone

        * handle caseId
        * handle log
        * handle role ids
        * handle edit of case 
    */

	private id?: number;
	private uId?: string;
	private aId?: string;
	private duration?: number;
	private reason?: string;
	private nsfw?: number;

	public from(id: string) {
		// get from db by id
	}

	public setTarget(user: GuildMember | User | string) {
		if (typeof user === "string") this.uId = user;
		else this.uId = user.id;
	}

	public setAuthor(user: GuildMember | User | string) {
		if (typeof user === "string") this.aId = user;
		else this.aId = user.id;
	}

	public setReason(reason: string) {
		this.reason = reason;
	}

	public setDuration(timestamp: number) {
		this.duration = timestamp;
	}

	public setNSFW(bool: boolean) {
		this.nsfw = bool ? 1 : 0;
	}

	public async set() {
		//
		await get(`
            INSERT INTO cases."table" (id)
            VALUES ('123')
            ON CONFLICT (id) DO NOTHING;
        `);
	}
}
