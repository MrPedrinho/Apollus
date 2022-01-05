const {getGuild} = require("../assets");

module.exports = {
    en: {
        cmd: "clear",
        help: "Clears the queue",
        usage: "mofo clear"
    },
    pt: {
        cmd: "limpa",
        help: "Limpa a playlist",
        usage: "fdp limpa",
    },

    async execute (message, _props) {

        const guild = getGuild(message.guild.id)
        const lang = guild.language
        if (message.member.voice.channel !== message.guild.me.voice.channel) return message.reply(lang === "pt" ? "Tens de estar no mesmo voice chat, cabrão" : "You need to be in the same voice chat, fuckwit")
        message.reply("Okok")
        guild.cleanQueue()
    }
}