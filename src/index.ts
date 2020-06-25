import Discord from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const client: Discord.Client = new Discord.Client();

client.on("ready", () => {
  if (client) console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("message", (message: Discord.Message) => {
  if (message.content === "ping") {
    message.reply("Pong!");
  }
});

client.login(process.env.DISCORD_TOKEN || "");
