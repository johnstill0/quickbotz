import type { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { Context } from "./Context";

export default interface CommandOptions {
    data: SlashCommandBuilder,
    execute: (ctx: Context, interaction: ChatInputCommandInteraction) => void | Promise<void>
    autocomplete?: (ctx: Context, interaction: AutocompleteInteraction) => void | Promise<void>
}