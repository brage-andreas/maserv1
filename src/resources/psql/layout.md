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
├── id         (bigint)
├── member_log (bigint)
├── log        (bigint)
├── mute       (bigint)
├── bot        (bigint)
├── emoji      (bigint)
├── embed      (bigint)
└── reaction   (bigint)
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
├── id       (bigint)
├── bot      (integer[]) case IDs
├── mutes    (integer[])
├── emoji    (integer[])
├── embed    (integer[])
└── reaction (integer[])
```

**cases**
```
guild_id -> Columns
├── id     (integer)
├── msg    (bigint) message ID
├── author (bigint)
├── target (bigint)
├── reason (string)
└── nsfw   (integer) 0/1
```

**restrictions**
```
guild_id -> Columns
├── id       (bigint)
├── mute     (integer) 0/1
├── bot      (integer)
├── emoji    (integer)
├── embed    (integer)
└── reaction (integer)
```
