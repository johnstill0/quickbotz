# QuickBotz ⚡

A minimal, modern Discord bot framework focused on simplicity and speed.

## Install

```bash
bun add quickbotz
# or
npm install quickbotz
```

## Quick Start

```ts
import { QuickBotz } from "quickbotz";
import { SlashCommandBuilder } from "discord.js";

const bot = QuickBotz.single({
  token: process.env.TOKEN!,
});

bot.registerCommand({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong"),
  execute: async (ctx, interaction) => {
    await interaction.reply("Pong!");
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
