import type { GatewayIntentBits } from "discord.js";

export default interface QuickBotzOptions {
    token: string;
    intents: GatewayIntentBits[]
}