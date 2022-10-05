const {getGuild} = require("../assets");

module.exports = {
    en: {
        cmd: "pause",
        help: "Pauses the music.",
        usage: "fdp pause"
    },
    pt: {
        cmd: "para",
        help: "Para a música",
        usage: "fdp para",
    },

    async execute(message, _props) {
        const guild = getGuild(message.guild.id)
        const lang = guild.language
        if (message.member.voice.channel !== message.guild.me.voice.channel) return message.reply(lang === "pt" ? "Tens de estar no mesmo voice chat" : "You need to be in the same voice chat")
        message.reply(guild.language === "pt" ? "Então querem ou não querem música?" : "k")
        guild.getPlayer().pause()
    }
}