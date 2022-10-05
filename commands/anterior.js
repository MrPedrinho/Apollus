const {getGuild} = require("../assets");

module.exports = {
    pt: {
        cmd: "anterior",
        help: "Mete a música anterior",
        usage: "fdp anterior"
    },
    en: {
        cmd: "previous",
        help: "Play the previous music",
        usage: "fdp previous"
    },

    async execute (message, _props) {
        const guild = getGuild(message.guild.id)
        const lang = guild.language

        try {
            if (message.member.voice.channel !== message.guild.me.voice.channel) return message.reply(lang === "pt" ? "Tens de estar no mesmo voice chat" : "You need to be in the same voice chat")

            const success = guild.playPrevious()
            if (!success) return message.reply(lang === "pt" ? "Tentei, mas não deu" : "I tried, but I failed")
            message.reply(lang === "pt" ? "Feito" : "Done")
        } catch (err) {
            console.log(err)
        }
    }
}