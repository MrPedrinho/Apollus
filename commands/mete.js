const {getGuild} = require("../assets");
const {sp_validate} = require("play-dl");

module.exports = {
    en: {
        cmd: "play",
        help: "Adds a song to the queue. Supports Youtube search and playlists; and Spotify albums, tracks, and playlists.",
        usage: "fdp play <search query or URL>"
    },
    pt: {
        cmd: "mete",
        help: "Adiciona uma música à playlist. Suporta pesquisa e playlists do Youtube; e albums, músicas e playlists do Spotify.",
        usage: "fdp mete <pesquisa ou URL>",
    },


    async execute(message, props) {

        const guild = getGuild(message.guild.id)
        const lang = guild.language

        const vc = message.member.voice.channel;

        if (!vc) return message.reply(lang === "pt" ? "Tens de estar num voice chat" : "You need to be in a voice chat");

        if (message.guild.me.voice.channel) {
            if (vc !== message.guild.me.voice.channel) return message.reply(lang === "pt" ? "Tens de estar no mesmo voice chat" : "You need to be in the same voice chat")
        }

        if (!props.length) return message.reply(lang === "pt" ? "Tens de dizer uma música..." : "You need to say a song...");

        await guild.setConnection(message, vc)

        let spotify = sp_validate(props[0])

        if (spotify) {
            await require("../spotify-loader").execute(message, props)
            return
        }

        await require("../youtube-loader").execute(message, props)

    },
};