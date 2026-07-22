PRAGMA defer_foreign_keys = ON;

CREATE TABLE players_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  username_lower TEXT UNIQUE NOT NULL,
  owner_discord_id TEXT UNIQUE,
  bio TEXT,
  skin_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO players_new (id, username, username_lower, owner_discord_id, bio, created_at, updated_at)
SELECT id, username, username_lower, owner_discord_id, bio, created_at, updated_at FROM players;

CREATE TABLE player_socials_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL REFERENCES players_new(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

INSERT INTO player_socials_new (id, player_id, platform, url, sort_order)
SELECT id, player_id, platform, url, sort_order FROM player_socials;

DROP TABLE player_socials;
DROP TABLE players;
ALTER TABLE players_new RENAME TO players;
ALTER TABLE player_socials_new RENAME TO player_socials;

CREATE INDEX player_socials_player_idx ON player_socials (player_id, sort_order);

CREATE TABLE link_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  discord_id TEXT NOT NULL,
  key TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX link_requests_discord_idx ON link_requests (discord_id);

PRAGMA defer_foreign_keys = OFF;
