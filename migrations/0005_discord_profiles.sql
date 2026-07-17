CREATE TABLE discord_profiles (
  discord_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  global_name TEXT,
  avatar_hash TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
