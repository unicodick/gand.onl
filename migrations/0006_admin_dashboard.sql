ALTER TABLE players ADD COLUMN blocked_at TEXT;
ALTER TABLE players ADD COLUMN blocked_by_discord_id TEXT;
ALTER TABLE players ADD COLUMN block_reason TEXT;

CREATE INDEX players_blocked_idx ON players (blocked_at);

CREATE TABLE roster_status (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  last_seen_at TEXT NOT NULL,
  received_count INTEGER NOT NULL DEFAULT 0,
  added_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE admin_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_discord_id TEXT NOT NULL,
  action TEXT NOT NULL,
  player_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
  player_username TEXT,
  details TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX admin_audit_created_idx ON admin_audit_log (created_at DESC);
CREATE INDEX admin_audit_player_idx ON admin_audit_log (player_id, created_at DESC);
