# QuickBotz ⚡

A minimal, modern Discord bot framework focused on simplicity and speed.

## Install

```bash
bun add quickbotz
# or
npm install quickbotz
# or
yarn add quickbotz
# or
pnpm install quickbotz
```

## Environment Variables

Create a `.env` file in your project root with:

```bash
DISCORD_TOKEN=your_discord_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here # only required for single-guild bots
```

## Quick Start

```ts
import "dotenv/config";
import { QuickBotz } from "quickbotz"; // For CommonJS: const { QuickBotz } = require("quickbotz");
import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  GatewayIntentBits,
  Events,
} from "discord.js";

const bot = QuickBotz.single({
  token: process.env.DISCORD_TOKEN!,
  intents: [GatewayIntentBits.Guilds],
  clientId: process.env.CLIENT_ID!,
  guildId: process.env.GUILD_ID!,
});

// Multi-guild bot (alternative)
// const bot = QuickBotz.multi({
//   token: process.env.DISCORD_TOKEN!,
//   intents: [GatewayIntentBits.Guilds],
//   clientId: process.env.CLIENT_ID!,
// });

bot.registerEvent({
  name: Events.ClientReady,
  once: true,
  execute: (ctx, client) => {
    console.log(`Logged in as ${client.user.tag}!`);
  },
});

bot.registerCommand({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong"),
  execute: async (ctx, interaction) => {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("ping_button")
        .setLabel("Click Me")
        .setStyle(ButtonStyle.Primary),
    );

    await interaction.reply({content: "Pong!", components: [row] });
  },
});

bot.registerAction({
  name: "ping_button",
  execute: (ctx, interaction) => {
    if (!interaction.isButton()) return;
    interaction.reply({
      content: "You clicked me!",
      flags: MessageFlags.Ephemeral,
    });
  },
});

bot.start();
```

## Features

- Simple command registration
- Modular command structure
- TypeScript-first
- Works with Bun & Node

## License

MIT
