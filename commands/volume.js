const {getGuild} = require("../assets");

module.exports = {
    en: {
        cmd: "volume",
        help: "Changes the volume of the bot",
        usage: "fdp volume <value>"
    },
    pt: {
        cmd: "volume",
        help: "Altera o volume do bot",
        usage: "fdp volume <value>",
    },

    async execute (message, props) {
        const guild = getGuild(message.guild.id)
        const lang = guild.language
        const {language} = guild
        if (message.member.voice.channel !== message.guild.me.voice.channel) return message.reply(lang === "pt" ? "Tens de estar no mesmo voice chat" : "You need to be in the same voice chat")
        const volume = props[0]
        if (volume >= 0.1 && volume <= 2) {
            guild.setVolume(volume)
            message.reply(language === "pt" ? "É para já" : "Comin' right up")
            return
        }
        message.reply(language === "pt" ? "Tem de ser um valor entre 0.1 e 2, inclusive" : "Must be a value between 0.1 and 2, inclusive")
    }
}