const {playPrevious} = require("../assets");

module.exports = {
    help: "Mete a música anterior",
    usage: "fdp anterior",

    async execute (message, _props) {

        try {
            const success = await playPrevious(message.guild.id)
            if (!success) return message.reply("Tentei, mas não deu")
            message.reply("Feito")
        } catch (err) {
            console.log(err)
        }
    }
}