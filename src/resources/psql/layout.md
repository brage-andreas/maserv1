# Databases
**Maser**
```
Schemas
├── config
├── nicks
├── history
├── cases
└── restrictions
```


# Schemas
**config**
```
guild_id -> Columns
├── member_log        (bigint)
├── log               (bigint)
├── mute              (bigint)
├── bot_restrict      (bigint)
├── emoji_restrict    (bigint)
├── embed_restrict    (bigint)
└── reaction_restrict (bigint)
```

**nicks**
```
guild_id -> Columns
├── id    (bigint)
└── nicks (text[])
```

**history**
```
guild_id -> Columns
├── id       (bigint)    user id
├── bot      (integer[]) case ids
├── mutes    (integer[])
├── emoji    (integer[])
├── embed    (integer[])
└── reaction (integer[])
```

**cases**
```
guild_id -> Columns
├── id     (integer) case id
├── msg    (bigint)  message id
├── author (bigint)
├── target (bigint)
├── reason (string)
└── nsfw   (integer) 0/1
```

**restrictions**
```
guild_id -> Columns
├── id       (bigint)  user id
├── mute     (integer) 0/1
├── bot      (integer)
├── emoji    (integer)
├── embed    (integer)
└── reaction (integer)
```
