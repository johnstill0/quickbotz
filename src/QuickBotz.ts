import {
  Client,
  Collection,
  Events,
  MessageFlags,
  REST,
  Routes,
  type ClientEvents,
  type RESTPostAPIApplicationCommandsResult,
} from "discord.js";
import type { CommandOptions, Context, QuickBotzOptions } from "./types";
import type {
  MultiGuildConfig,
  SingleGuildConfig,
} from "./types/QuickBotzOptions";

class QuickBotz {
  public client: Client;
  public ctx: Context;
  public commands: Collection<string, any>;
  #config: QuickBotzOptions;

  private constructor(config: QuickBotzOptions) {
    this.#config = config;
    this.client = new Client({ intents: config.intents });
    this.commands = new Collection();
    this.ctx = {
      client: this.client,
    };
  }

  static multi(config: Omit<MultiGuildConfig, "mode">) {
    return new QuickBotz({ ...config, mode: "multi" });
  }

  static single(config: Omit<SingleGuildConfig, "mode">) {
    return new QuickBotz({ ...config, mode: "single" });
  }

  registerEvent = <K extends keyof ClientEvents>(
    event: K,
    once: boolean = false,
    callback: (ctx: Context, ...args: ClientEvents[K]) => void | Promise<void>,
  ) => {
    once
      ? this.client.once(event, (...args: ClientEvents[K]) => {
          return callback(this.ctx, ...args);
        })
      : this.client.on(event, (...args: ClientEvents[K]) => {
          return callback(this.ctx, ...args);
        });
  };

  registerCommand({ data, execute, autocomplete }: CommandOptions) {
    this.commands.set(data.name, { data, execute, autocomplete });
  }

  #setupInteractionHandler = () => {
    this.client.on(Events.InteractionCreate, async (interaction) => {
      try {
        if (interaction.isChatInputCommand()) {
          const command: CommandOptions = this.commands.get(interaction.commandName);
          if (!command ) {
            interaction.reply({ content: `This command cannot be found.`, flags: MessageFlags.Ephemeral});
            return
          };

          if (interaction.isAutocomplete()) {
            return await command.autocomplete?.(this.ctx, interaction)
          }

          return await command.execute(this.ctx, interaction)
        }
      } catch (error) {
         console.error("Error in base interaction create", error);
      }
    })
  }

  #deployCommands = async () => {
    const commandsToRegister = this.commands.map((cmd) => cmd.data.toJSON());
    const rest = new REST().setToken(this.#config.token);

    try {
      console.log(
        `(ℹ) Started refreshing ${commandsToRegister.length} application (/) commands.`,
      );

      let data;
      if (this.#config.mode === "multi") {
        data = (await rest.put(
          Routes.applicationCommands(this.#config.clientId),
          { body: commandsToRegister },
        )) as RESTPostAPIApplicationCommandsResult[];
      } else {
        data = (await rest.put(
          Routes.applicationGuildCommands(
            this.#config.clientId,
            this.#config.guildId,
          ),
          { body: commandsToRegister },
        )) as RESTPostAPIApplicationCommandsResult[];
      }

      console.log(
        `(✅) Successfully reloaded ${data.length} application (/) commands.`,
      );
    } catch (error) {
      console.error(error);
    }
  };

  start = async () => {
    await this.#deployCommands();
    this.#setupInteractionHandler();
    this.client.login(this.#config.token);
    console.log(`(⚡) QuickBotz Initialized Successfully`)
  };
}

export default QuickBotz;
