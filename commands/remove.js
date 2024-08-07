const {getGuild} = require("../assets");
const {EmbedBuilder} = require("discord.js");

module.exports = {
    en: {
        cmd: "remove",
        help: "Removes a song from the queue, only needs a small part of the title.",
        usage: "fdp remove <query>"
    },
    pt: {
        cmd: "remove",
        help: "Remove uma música da playlist. Basta uma parte do nome da música.",
        usage: "fdp remove <música>",
    },

    async execute (message, props) {

        const guild = getGuild(message.guild.id)
        const lang = guild.language
        if (message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply(lang === "pt" ? "Tens de estar no mesmo voice chat" : "You need to be in the same voice chat")
        const removedSong = guild.removeSong(props.join(" "))
        if (!removedSong) {
            return message.reply(lang === "pt" ? "Não encontrei nada" : "I found nothing")
        }
        const date = new Date()

        const embed = new EmbedBuilder({
            "title": lang === "pt" ? "Já está, descança" : "Done, you can relax now",
            "color": 15158332,
            "timestamp": date,
            "description": `
                ${lang === "pt" ? "Canção removida" : "Removed song"}\n
                [${removedSong.title}](${removedSong.url})
            `,
            "thumbnail": {
                "url": removedSong.thumbnail_url
            },
            "footer": {
                "icon_url": message.author.displayAvatarURL(),
                "text": `Música de ${message.author.username}#${message.author.discriminator}`
            }
        })

        message.channel.send({embeds: [embed]})
    }
}