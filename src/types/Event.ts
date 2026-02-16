import type { ClientEvents } from "discord.js";
import type { Context } from "./Context";

export default interface Event<T extends keyof ClientEvents> {
  name: T;
  once: boolean;
  execute: (
    ...args: [ctx: Context, ...ClientEvents[T]]
  ) => void | Promise<void>;
}
