import { Client, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import type { QuickBotzOptions } from "./types";

class QuickBotz {
    client: Client;
    commands: Collection<string, any>;
    private token: string;

    constructor({ token, intents }: QuickBotzOptions) {
        this.token = token;
        this.client = new Client({ intents });
        this.commands = new Collection();
    };

    useCommandsFolder(pathStr: string) {
        const foldersPath = path.join(process.cwd(), pathStr);
        const commandFolders = fs.readdirSync(foldersPath);
        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js') || file.endsWith('.ts'));

            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                if ('data' in command && 'execute' in command) {
                    this.commands.set(command.data.name, command);
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
        }
        return this.commands.size;
    }

    useEventsFolder(path: string) {

    }

    login = () => this.client.login(this.token)
};

export default QuickBotz;