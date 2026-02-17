import type { Interaction } from "discord.js";
import type { Context } from "./Context";

export default interface Action {
    name: string,
    execute: (ctx: Context, interaction: Interaction) => void | Promise<void>,
}