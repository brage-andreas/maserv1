# Databases
**Maser**
```
Schemas
├── config
├── nicks
├── mutes
└── restrictions
```


# Schemas
**config**
```
guild_id -> Columns
├── id (bigint)
├── mute_role (bigint)
├── member_log_channel (bigint)
└── log_channel (bigint)
```

**nicks**
```
guild_id -> Columns
├── id (bigint)
└── nicks (text[])
```

**history**
```
guild_id -> Columns
├── id (bigint)
├── bot (integer[])
├── mutes (integer[])
├── emoji (integer[])
├── embed (integer[])
└── reaction (integer[])
```

**cases**
```
guild_id -> Columns
├── id (integer)
├── id (integer)
└── author (bigint)
```
