import type { GatewayIntentBits } from "discord.js";

export interface MultiGuildConfig {
  mode: "multi";
  clientId: string;
  token: string;
  intents: GatewayIntentBits[];
}

export interface SingleGuildConfig {
  mode: "single";
  clientId: string;
  guildId: string;
  token: string;
  intents: GatewayIntentBits[];
}

export type QuickBotzOptions = MultiGuildConfig | SingleGuildConfig;
