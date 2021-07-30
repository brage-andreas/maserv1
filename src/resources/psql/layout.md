Database
> Maser -> Schemas
> ├── config
> ├── nicks
> ├── mutes
> └── restrictions

config
> guild_id -> Columns
> ├── id (bigint)
> ├── mute_role (bigint)
> ├── member_log_channel (bigint)
> └── log_channel (bigint)

nicks
> guild_id -> Columns
> ├── id (bigint)
> └── nicks (text[])

mutes
> guild_id -> Columns
> ├── id (bigint)
> └── end (string)

restrictions
> guild_id -> Columns
> ├── id (bigint)
> └── bitfield (integer)
