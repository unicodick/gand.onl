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

DROP TABLE players;
ALTER TABLE players_new RENAME TO players;

CREATE TABLE link_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  discord_id TEXT NOT NULL,
  key TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX link_requests_discord_idx ON link_requests (discord_id);
