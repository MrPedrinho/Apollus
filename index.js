const { Client } = require("discord.js")
const fs = require("fs")
const {createGuild, getGuild, deleteGuild, selectLanguage, connectMongo, Server} = require("./assets");
require("dotenv").config()
const play = require("play-dl")

//https://discord.com/oauth2/authorize?client_id=894845421380337684&scope=bot&permissions=36809984

const client = new Client({intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]})
module.exports = client
// Mongoose

connectMongo().catch(err => console.log(err))

// Discord.js

const cmdIdx = {en: {}, pt: {}}

const commandFiles = fs.readdirSync(__dirname + "/commands").filter(file => file.endsWith(".js"));
commandFiles.forEach(file => {
    const path = `${__dirname}/commands/${file.toLowerCase()}`
    const cmd = require(path)

    cmdIdx.en[cmd.en.cmd] = path
    cmdIdx.pt[cmd.pt.cmd] = path
})

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (!message.guild.me.permissionsIn(message.channel)?.has("SEND_MESSAGES")) return;

    const guild = getGuild(message.guild.id)

    if (message.content.toLowerCase().trim() === "fdp help") {
        try {
            const cmd = require("./commands/ajuda")
            await cmd.execute(message, [], "en")
        } catch (e) {
            console.log(e)
        }
        return
    } else if (message.content.toLowerCase().trim() === "fdp ajuda") {
        try {
            const cmd = require("./commands/ajuda")
            await cmd.execute(message, [], "pt")
        } catch (e) {
            console.log(e)
        }
        return
    }

    if (message.content === "fdp português" || message.content === "fdp portugues" || message.content === "fdp english" && !guild) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return;
        let language
        switch(message.content.toLowerCase().trim()) {
            case "fdp english": {
                language = "en"
                break
            }
            case "fdp portugues": {
                language = "pt"
                break
            }
            case "fdp português": {
                language = "pt"
                break
            }
            default: {
                language = "en"
            }
        }

        const newMsg = message.guild.me.permissions.has("READ_MESSAGE_HISTORY") && await message.reply(language === "pt" ? "Espera..." : "Wait...")

        await Server
            .create({guild_id: message.guild.id, language})

        createGuild(message.guild.id, language)

        message.guild.me.permissions.has("READ_MESSAGE_HISTORY") && await newMsg.edit(language === "pt" ? "Pronto, já está feito" : "There, it's done")
        return
    }

    const [prefix, cmd, ...props] = message.content.split(" ")

    if (prefix !== "fdp") return

    if (!cmd) return;

    if (!guild) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return;
        await selectLanguage(message.guild)
        return
    }

    const lang = guild.language

    if (prefix !== "fdp") return

    const indexedCmd = cmdIdx[lang][cmd.toLowerCase()]

    guild.setPlayer()

    try {
        if (!indexedCmd) {
            if (lang === "en") return await message.reply("Yeah... that's not a command")
            return await message.reply("Pois... isso nâo é um comando")
        }
    } catch (e) {
        console.log(e)
    }

    try {
        const command = require(indexedCmd);
        await command.execute(message, props.filter(p => p.length > 0))
    } catch (err){
        try {
            console.log(err)
            await message.reply(lang === "pt" ? "Partiste o bot, bacano" : "You broke the bot, cool")
        } catch (e) {
            console.log(e)
        }
    }

})

client.on("guildCreate", async (guild) => {
    const server = await Server.findOne({guild_id: guild.id})
    if (server) {
        createGuild(guild.id, server.language)
    } else {
        await selectLanguage(guild)
    }
})

client.on("guildDelete", async (guild) => {
    deleteGuild(guild.id)
    await Server.deleteOne({guild_id: guild.id})
})

client.on("ready", async () => {
    await play.setToken({
        youtube : {
            cookie : process.env.YT_COOKIE
        },
        spotify: {
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET,
            refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
            market: process.env.SPOTIFY_MARKET
        }
    })
    console.log("ready bitch")
})

client.login(process.env.TOKEN).then(async _r => {
    let servers = client.guilds.cache
    
    setInterval(() => client.user.setActivity("musica para " + servers.size + " servidores", {type: "PLAYING"}), 15000)
    
    let guildsInfo = await Server.find({}).exec()
    for (const guildInfo of guildsInfo) {
        const guild = client.guilds.cache.get(guildInfo.guild_id)
        if (!guild) continue;
        createGuild(guild.id, guildInfo.language)
    }
})
