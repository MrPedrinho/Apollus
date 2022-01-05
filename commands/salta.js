
const {getGuild} = require("../assets")

module.exports = {
    en: {
        cmd: "skip",
        help: "Unlimited skips, for free.",
        usage: "mofo skip"
    },
    pt: {
        cmd: "salta",
        help: "Skips ilimitados, sem premium",
        usage: "fdp salta",
    },

    async execute (message, _props) {
        const guild = getGuild(message.guild.id)
        const lang = guild.language
        if (message.member.voice.channel !== message.guild.me.voice.channel) return message.reply(guild.language === "pt" ? "Tens de estar no mesmo voice chat, cabrão" : "You need to be in the same voice chat, fuckwit")
        try {
            await guild.skipSong(message)
        } catch (err) {
            console.log(err)
        }
    }
}