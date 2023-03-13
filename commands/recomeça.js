const {getGuild} = require("../assets");
module.exports = {
    en: {
        cmd: "restart",
        help: "Restarts the current song.",
        usage: "fdp restart"
    },
    pt: {
        cmd: "recomeça",
        help: "Recomeça a música atual.",
        usage: "fdp recomeça",
    },

    async execute (message, _props) {
        const guild = getGuild(message.guild.id)
        const lang = guild.language
        if (message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply(lang === "pt" ? "Tens de estar no mesmo voice chat" : "You need to be in the same voice chat")
        message.reply(getGuild(message.guild.id).language === "pt" ? "Feito, chefe" : "Aye Sir!")
        await getGuild(message.guild.id).restartSong(message.guild.id)
    }
}