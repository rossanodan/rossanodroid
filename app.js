const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const dotenv = require("dotenv");
const {
  Client,
  MessageEmbed,
  MessageAttachment,
  TextChannel,
} = require("discord.js");

const axios = require("axios");

dotenv.config();

const PREFIX = process.env.PREFIX || "$";
const TOKEN = process.env.DISCORD_TOKEN;

const client = new Client();

const notifyGeneralChannel = (channel) => {
  const generalChannel = channel.client.channels.cache.find(
    (currentChannel) =>
      currentChannel.id === "719574483467370550" ||
      (currentChannel instanceof TextChannel &&
        currentChannel.name === "general")
  );
  if (!generalChannel)
    return console.error(
      `general channel not found. Make sure to setup GENERAL_CHANNEL_ID env variable.`
    );

  if (generalChannel instanceof TextChannel) {
    const message = `\:tada: A new channel was created! Check out the channel ${channel.toString()}`;
    generalChannel.send(message);
  }
};

client.once("ready", async () => {
  const botChannel = await client.channels.fetch("719601625739558944");

  if (client.user) {
    client.user.setActivity(`on ${client.guilds.size} servers`);
    client.user.setPresence({
      status: "online",
    });
  }

  const isReadyMessage = new MessageEmbed()
    .setTitle("rossanodroid is ready")
    .setColor("#0099ff")
    .setDescription(
      "Hello, folks! I am rossanodroid, rossanodan's Discord bot."
    )
    .setTimestamp();
  botChannel.send(isReadyMessage);
});

// bot actions
client.on("message", async (message) => {
  if (message.author.bot) return;

  if (message.content.indexOf(PREFIX) !== 0) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(
      `Pong! Latency is ${
        m.createdTimestamp - message.createdTimestamp
      }ms. API Latency is ${Math.round(client.ping)}ms`
    );
  }

  if (command === "rules") {
    const rules = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Code of Conduct")
      .addFields(
        {
          name: "Spamming is forbidden",
          value:
            "Flooding any channel within the server will result in a temporary mute and having your messages deleted.",
        },
        {
          name: "No hate speech",
          value:
            "Inciting hate and violence towards specific groups will result in a temporary ban. Ironic humor involving groups does not fall under this rule. Addendum: Swearing, per se, is not a bannable offense. However, excessive swearing can get you a temporary mute.",
        },
        {
          name: "No slurs",
          value:
            "Do not use slurs on other individuals. Ironic usage tolerable by the target is exempt from this rule.",
        },
        {
          name: "Keep it friendly",
          value:
            "Public arguments and fights are not allowed within the server. You may do it in DMs, as otherwise it will result in temporary mutes to all people involved. Addendum: Flame wars and organizing raids are also forbidden. People who attempt raids will be permanently banned without warning.",
        },
        {
          name: "Keep it on topic",
          value:
            "Each channel here has its own purpose, and the purpose is described by their name or described additionally in the channel description. At first, your messages will be deleted and you will get a warning. After enough warnings, you will get a temporary mute, and so on.",
        },
        {
          name: "Advertising other servers is not allowed",
          value:
            "Sending invites to your server/any other server is forbidden. Only exception being if you ask an admin about it beforehand. Without an admin's consent, your message will be deleted and you will be temporarily muted.",
        },
        {
          name: "No inappropriate profile information",
          value:
            "This includes usernames, nicknames, profile pictures, playing status and linked accounts. Such information must follow the above rules. Additionally, zalgo and other disruptive Unicode characters will not be tolerated.",
        }
      )
      .setTimestamp()
      .setFooter(
        "Repeated violations of the aforementioned rules can result in temporary mute, temporary ban or even permanent ban; depending on the severity/frequency of the violations."
      );

    message.channel.send(rules);
  }

  if (command === "help") {
    const help = new MessageEmbed()
      .setColor("#ff0000")
      .setTitle("Help")
      .addFields(
        {
          name: "$ping",
          value: "Ping command.",
        },
        {
          name: "$rules",
          value: "This command returns the Code of Conduct of this community.",
        },
        {
          name: "$meme",
          value: "This command returns a meme.",
        },
        {
          name: "$status",
          value: "This command returns the status of the bot.",
        }
      );
    message.channel.send(help);
  }

  if (command === "status") {
    const whiteCheckMark = message.channel.guild.emojis.cache.find(
      (emoji) => emoji.id === "720413004600049705"
    );
    const status = new MessageEmbed()
      .setColor("#329e2e")
      .setTitle("Status")
      .setDescription(`Hey, I'm great! Thanks for asking ${whiteCheckMark}`);
    message.channel.send(status);
    // :white_check_mark:
  }

  if (command === "meme") {
    axios
      .get("https://meme-api.herokuapp.com/gimme")
      .then((response) => {
        const meme = {
          title: response.data.title,
          image: {
            url: response.data.url,
          },
        };
        message.channel.send({ embed: meme });
      })
      .catch((error) => {
        const err = new MessageEmbed()
          .setColor("#ff0000")
          .setTitle("Ops..")
          .setDescription(error.message);
        message.channel.send(err);
      });
  }
});

client.on("channelCreate", notifyGeneralChannel);

const indexRouter = require("./routes/index");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

client.login(TOKEN);

module.exports = app;
