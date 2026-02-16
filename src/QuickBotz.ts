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
import type { Command, Event, Context, QuickBotzOptions } from "./types";
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
  registerEvent = <T extends keyof ClientEvents>({
    name,
    once,
    execute,
  }: Event<T>) => {
    once
      ? this.client.once(name, (...args) => {
          return execute(this.ctx, ...args);
        })
      : this.client.on(name, (...args) => {
          return execute(this.ctx, ...args);
        });
  };

  registerCommand({ data, execute, autocomplete }: Command) {
    this.commands.set(data.name, { data, execute, autocomplete });
  }

  #setupInteractionHandler = () => {
    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (interaction.isChatInputCommand()) {
        const command: Command = this.commands.get(interaction.commandName);

        if (!command) {
          return await interaction.reply({
            content: `This command cannot be found.`,
            flags: MessageFlags.Ephemeral,
          });
        }

        if (interaction.isAutocomplete() && command.autocomplete) {
          try {
            await command.autocomplete(this.ctx, interaction);
          } catch (error) {
            console.error(error);
          }
          return;
        }

        try {
          await command.execute(this.ctx, interaction);
        } catch (error) {
          console.error(error);
          const content = "There was an error while executing this command";
          if (interaction.replied || interaction.deferred) {
            return await interaction.followUp({
              content,
              flags: MessageFlags.Ephemeral,
            });
          }

          await interaction.reply({
            content,
            flags: MessageFlags.Ephemeral,
          });
        }
      }
    });
  };

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
    console.log(`(⚡) QuickBotz Initialized Successfully`);
  };
}

export default QuickBotz;
