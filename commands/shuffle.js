const {getGuild} = require("../assets");
const {EmbedBuilder} = require("discord.js");

module.exports = {
    en: {
        cmd: "shuffle",
        help: "Shuffles the queue",
        usage: "fdp shuffle"
    },
    pt: {
        cmd: "shuffle",
        help: "Dá shuffle à playlist",
        usage: "fdp shuffle",
    },

    async execute (message, _props) {
        const date = new Date()
        const guild = getGuild(message.guild.id)
        const lang = guild.language
        if (message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply(lang === "pt" ? "Tens de estar no mesmo voice chat" : "You need to be in the same voice chat")
        const {language, queue} = guild
        if (queue.length <= 2) {
            const embed = new EmbedBuilder({
                "title": "Shuffle",
                "color": 15158332,
                "timestamp": date,
                "description": language === "pt" ? "Erro, tens de ter mais que 2 músicas na playlist" : "Error, you must have 2 or more songs in the queue",
                "footer": {
                    "icon_url": message.author.displayAvatarURL(),
                    "text": `${message.author.username}#${message.author.discriminator}`
                }
            })

            message.channel.send({embeds: [embed]})

            return
        }
        queue.shift()
        const current = queue[0]
        const shuffledQueue = guild.shuffleArray(queue)
        shuffledQueue.unshift(current)
        guild.setQueue(shuffledQueue)

        const embed = new EmbedBuilder({
            "title": "Shuffle",
            "color": 15158332,
            "timestamp": date,
            "description": language === "pt" ? "Sucesso, usa `fdp playlist` para ver o resultado" : "Success, use `fdp queue` to see the result",
            "footer": {
                "icon_url": message.author.displayAvatarURL(),
                "text": `${message.author.username}#${message.author.discriminator}`
            }
        })

        message.channel.send({embeds: [embed]})
    }
}