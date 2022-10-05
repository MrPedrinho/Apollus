const {getGuild} = require("../assets");

module.exports = {
    en: {
        cmd: "die",
        help: "The music is annoying you? Kill the bot!",
        usage: "fdp die"
    },
    pt: {
        cmd: "morre",
        help: "A música está-te a irritar? Mata o bot",
        usage: "fdp morre",
    },

    async execute(message, _props) {

        const guild = getGuild(message.guild.id)
        const lang = guild.language
        if (message.member.voice.channel !== message.guild.me.voice.channel) return message.reply(lang === "pt" ? "Tens de estar no mesmo voice chat" : "You need to be in the same voice chat")
        try {
            message.reply("Okok")
            await guild.kill()
        } catch (err) {
            throw (err)
        }
    }
}