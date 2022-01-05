const {getGuild} = require("../assets");

module.exports = {
    en: {
        cmd: "pause",
        help: "Pauses the music.",
        usage: "mofo pause"
    },
    pt: {
        cmd: "para",
        help: "Para a música",
        usage: "fdp para",
    },

    async execute(message, _props) {
        const guild = getGuild(message.guild.id)
        const lang = guild.language
        if (message.member.voice.channel !== message.guild.me.voice.channel) return message.reply(lang === "pt" ? "Tens de estar no mesmo voice chat, cabrão" : "You need to be in the same voice chat, fuckwit")
        message.reply(guild.language === "pt" ? "Então querem ou não querem música? Decidam-se porra" : "Fuckin' hell. Do you want music or not?")
        guild.getPlayer().pause()
    }
}