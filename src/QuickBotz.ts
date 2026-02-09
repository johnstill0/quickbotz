import { Client } from "discord.js";
import type { QuickBotzOptions } from "./types";

class QuickBotz {
    client: Client;
    private token: string;

    constructor({ token, intents }: QuickBotzOptions) {
        this.token = token;
        this.client = new Client({ intents })
    };

    useCommandsFolder(path: string) {

    }

    useEventsFolder(path: string) {

    }

    login = () => this.client.login(this.token)
};

export default QuickBotz;