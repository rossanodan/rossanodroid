import Discord from "discord.js";
import dotenv from "dotenv";

import configuration from "./configuration";
import Logger from "./logger";

dotenv.config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN || "";

if (!DISCORD_TOKEN || DISCORD_TOKEN === "") {
  Logger.log({
    level: "error",
    message: "Discord token not provided. Cannot create the bot.",
  });
}

const client: Discord.Client = new Discord.Client();

client.on("ready", () => {
  Logger.log({
    level: "info",
    message: "Online, let's get started!",
  });

  if (client.user) {
    client.user.setPresence({
      activity: {
        name: `${configuration.COMMAND_PREFIX}help for help`,
        type: "WATCHING",
      },
      status: "online",
    });
  }
});

client.on("message", (message: Discord.Message) => {
  if (message.content === "ping") {
    message.reply("Pong!");
  }
});

client.login(DISCORD_TOKEN);
