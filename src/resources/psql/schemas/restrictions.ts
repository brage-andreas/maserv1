import { RESTRICTIONS_BIT, RESTRICTIONS_STR } from "../../../constants.js";
import { get } from "../util.js";
import { viewConfig } from "./config.js";

const createRestrictRow = async (guildId: string, userId: string) => {
	await get(`
        INSERT INTO restrictions."${guildId}" (id)
        VALUES ('${userId}');
    `);
};

const createRestrictTable = async (guildId: string) => {
	await get(`
        CREATE TABLE IF NOT EXISTS restrictions."${guildId}"
            (
                id bigint PRIMARY KEY,
                restricts integer
            );
    `);
};

const check = async (table: string, userId: string) => {
	await createRestrictTable(table);
	await createRestrictRow(table, userId);
};

type Obj = { [index: string]: number | string };
const getKey = (object: Obj, value: number | string) => {
	const keys = Object.keys(object);
	const key = keys.find((key) => object[key] === value);
	return key ?? null;
};

export class Restriction {
	public gid: string;
	public uid: string;
	public bit: number;
	private _roles: { [index: string]: string | null };

	constructor(userId: string, guildId: string) {
		this.gid = guildId;
		this.uid = userId;
		this.bit = 0;
		this._roles = {};
	}

	public async init() {
		await this._updateBit();
		this._roles = await viewConfig(this.gid);
	}

	private async _updateBit() {
		this.bit = (await this._get(this.gid, this.uid)) ?? 0;
	}

	public getRoleId(restriction: RESTRICTIONS_STR) {
		const rolesObj = this._roles;

		const keys = Object.keys(rolesObj);
		const key = keys.find((key) => key.toLowerCase().includes(restriction.toLowerCase()));

		if (key) return rolesObj[key] ?? null;
		return null;
	}

	public bitflags(bit: number) {
		const vals = Object.values(RESTRICTIONS_BIT);
		const flags = new Set<number>();

		for (let i = vals.length - 1; i >= 0; i--) {
			const n = 1 << i;
			if (bit - n >= 0) {
				flags.add(vals[i]);
				bit -= n;
			}
		}

		return flags;
	}

	public has(restriction: RESTRICTIONS_STR) {
		const flags = this.bitflags(this.bit);
		const restrictionBit = RESTRICTIONS_BIT[restriction];

		return flags.has(restrictionBit);
	}

	public toFlags(bit?: number) {
		const vals = Object.values(RESTRICTIONS_BIT);

		bit = bit ? bit : this.bit;

		const flags: string[] = [];

		for (let i = vals.length - 1; i >= 0; i--) {
			const n = 1 << i;

			if (bit - n >= 0) {
				const key = getKey(RESTRICTIONS_BIT, n);
				if (key) flags.push(key);
				bit -= n;
			}
		}

		return flags;
	}

	private _flagToBit(restriction: RESTRICTIONS_STR, add: boolean) {
		const faultyAdd = this.has(restriction) && add;
		const faultyDel = !this.has(restriction) && !add;
		if (faultyAdd || faultyDel) return 0;

		return RESTRICTIONS_BIT[restriction];
	}

	public async add(restriction: RESTRICTIONS_STR, push = true) {
		await this._updateBit();

		const bitToAdd = this._flagToBit(restriction, true);
		const next = this.bit + bitToAdd;

		if (this.bit === next) return null;

		if (push) await this._set(next);
		return next;
	}

	public async remove(restriction: RESTRICTIONS_STR, push = true) {
		await this._updateBit();

		const difference = this._flagToBit(restriction, false);
		const next = this.bit - difference;

		if (difference === 0) return null;

		if (push) await this._set(next);
		return difference;
	}

	private async _set(value: number) {
		await check(this.gid, this.uid);

		await get(`
            UPDATE restrictions."${this.gid}"
            SET restricts = '${value}'
            WHERE id = ${this.uid};
        `);
	}

	private async _get(guildId: string, userId: string) {
		await check(guildId, userId);

		return await get(`
            SELECT restricts
            FROM restrictions."${guildId}" 
            WHERE id = ${userId};
        `).then((res) => res?.restricts ?? null);
	}
}
