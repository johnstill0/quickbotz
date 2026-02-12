import { Client, type ClientEvents } from "discord.js";
import type { EventContext, QuickBotzOptions } from "./types";

class QuickBotz {
  public client: Client;
  // commands: Collection<string, any>;
  private token: string;

  constructor({ token, intents }: QuickBotzOptions) {
    this.token = token;
    this.client = new Client({ intents });
    // this.commands = new Collection();
  }

  registerEvent = <K extends keyof ClientEvents>(
    event: K,
    once: boolean = false,
    callback: (
      ctx: EventContext,
      ...args: ClientEvents[K]
    ) => void | Promise<void>,
  ) => {
    once
      ? this.client.once(event, (...args: ClientEvents[K]) => {
          const ctx: EventContext = {
            client: this.client,
          };

          return callback(ctx, ...args);
        })
      : this.client.on(event, (...args: ClientEvents[K]) => {
          const ctx: EventContext = {
            client: this.client,
          };

          return callback(ctx, ...args);
        });
  };

  start = () => this.client.login(this.token);
}

export default QuickBotz;
