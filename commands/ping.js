const {getGuild} = require("../assets");

module.exports = {
    help: "Atreve-te",
    usage: "fdp ping",

    en: {
        cmd: "ping",
        help: "I dare you to do it",
        usage: "fdp ping"
    },
    pt: {
        cmd: "ping",
        help: "Atreve-te",
        usage: "fdp ping",
    },

    async execute(message, _props) {
        const lang = getGuild(message.guild.id).language

        try {
            await message.reply(lang === "pt" ? "nem te atrevas" : "...no")
        } catch (err) {
            console.log(err)
        }
    },
};