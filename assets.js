const {Guild} = require("./Guild");
const {EmbedBuilder, PermissionsBitField, ChannelType } = require("discord.js");
const mongoose = require("mongoose");

let guildList = {}

function getGuild(id) {
    return guildList[id]
}

function createGuild(id, language) {
    guildList[id] = new Guild(language, id)
    return guildList[id]
}

function deleteGuild(id) {
    guildList[id] = undefined
}

async function selectLanguage(guild) {
    let defaultChannel = "";
    guild.channels.cache.forEach((channel) => {
        if(channel.type === ChannelType.GuildText && defaultChannel === "") {
            if(channel.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.SendMessages)) {
                defaultChannel = channel;
            }
        }
    })

    const date = new Date()

    const embed = new EmbedBuilder({
        "title": `Apollus Setup`,
        "description": "Before you start using Apollus, you need to select a language.\n\nAntes de começares a utilizar o Apollus, tens de escolher um idioma",
        "color": 15158332,
        "timestamp": date,
        "fields": [
            {
                "name": "English",
                "value": "Say `fdp english` for English",
            }, {
                "name": "Português",
                "value": "Diz `fdp português` para Português",
            }
        ]
    })

    try {
        const reminderMessage = await defaultChannel.send(`<@!${guild.ownerId}>`)
        const sentMsg = await defaultChannel.send({embeds: [embed]})

        defaultChannel.awaitMessages({filter: m => (m.content === "fdp português" || m.content === "fdp english") && m.member.permissions.has("ADMINISTRATOR"), max: 1})
            .then(async (collected) => {
                if (Server.findOne({guild_id: guild.id})) return
                const content = collected.map(d => d.content)[0]
                const language = content === "fdp english" ? "en" : "pt"

                const newMsg = guild.members.me.permissions.has(PermissionsBitField.Flags.ReadMessageHistory) && await defaultChannel.send(language === "pt" ? "Aguarda..." : "Please wait...")


                await Server
                    .create({guild_id: guild.id, language})

                if (guild.members.me.permissions.has(PermissionsBitField.Flags.ReadMessageHistory)) {
                    await newMsg.edit(language === "pt" ? "Sucesso, o Apollus está pronto para utilizar" : "Success, Apollus is now ready to use!")
                    await sentMsg.delete()
                    await reminderMessage.delete()
                }
            })
            .catch(err => console.log(err))

    } catch (e) {
        console.log(e)
    }



}

const Server = new mongoose.model("Server", new mongoose.Schema({
    guild_id: String,
    language: String
}))

async function connectMongo() {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}

module.exports = {getGuild, createGuild, deleteGuild, selectLanguage, Server, connectMongo}
