
const {getGuild} = require("../assets")

module.exports = {
    en: {
        cmd: "skip",
        help: "Unlimited skips, for free.",
        usage: "fdp skip"
    },
    pt: {
        cmd: "salta",
        help: "Skips ilimitados, sem premium",
        usage: "fdp salta",
    },

    async execute (message, _props) {
        const guild = getGuild(message.guild.id)
        if (message.member.voice.channel !== message.guild.me.voice.channel) return message.reply(guild.language === "pt" ? "Tens de estar no mesmo voice chat" : "You need to be in the same voice chat")
        try {
            await guild.skipSong(message)
        } catch (err) {
            console.log(err)
        }
    }
}