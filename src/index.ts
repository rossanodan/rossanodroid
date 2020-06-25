import Discord from "discord.js";
import dotenv from "dotenv";

import configuration from "./configuration";
import Logger from "./logger";

dotenv.config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN || "";

const client = new Discord.Client();

client.on("ready", () => {
  Logger.log({
    level: "info",
    message: "Bot is online.",
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
  if (
    !message.content.startsWith(configuration.COMMAND_PREFIX) ||
    message.author.bot
  )
    return;

  const args = message.content
    .slice(configuration.COMMAND_PREFIX.length)
    .split(" ");
  const command = args.shift()?.toLowerCase();

  Logger.log({
    level: "info",
    message: `${message.author.username} sent a message with command ${configuration.COMMAND_PREFIX}${command}.`,
  });
});

client.login(DISCORD_TOKEN);

// APIs Error handling
process.on("unhandledRejection", (error: Error) => {
  Logger.log({
    level: "error",
    message: error.message || "",
  });
});
