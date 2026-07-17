// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { D1Database, R2Bucket } from "@cloudflare/workers-types";

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user?: {
        discordId: string;
        username: string;
      };
    }
    // interface PageData {}
    // interface PageState {}
    interface Platform {
      env: {
        DB: D1Database;
        NEWS_MEDIA: R2Bucket;
        DISCORD_REDIRECT_URI: string;
        DISCORD_CLIENT_ID: string;
        DISCORD_CLIENT_SECRET: string;
        ADMIN_DISCORD_IDS: string;
        MOD_SECRET: string;
      };
    }
  }
}

export {};
