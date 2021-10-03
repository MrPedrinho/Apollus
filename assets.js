require("dotenv").config()
const {createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus, joinVoiceChannel,
    VoiceConnectionStatus, entersState
} = require("@discordjs/voice");
const {MessageEmbed} = require("discord.js");
const youtube = require("play-dl")

let db = {}
/*
{
    queue
    player
    connection
    looping
    previous_music
    idler
}
 */async function play(song) {
    if (!song?.url) return
    const id = song.channel.guild.id
    const date = new Date()

    const embed = new MessageEmbed({
        "title": "Prepara-te para dançar 💃🕺, está agora a tocar",
        "color": 15158332,
        "timestamp": date,
        "description": `


                [${song.title}](${song.url})
                **Duração** - [${song.duration}](${song.url})
            `,
        "thumbnail": {
            "url": song.thumbnail_url
        },
        "footer": {
            "icon_url": song.author.displayAvatarURL(),
            "text": `Música de ${song.author.username}#${song.author.discriminator}`
        }
    })

    song.channel.send({embeds: [embed]})

    const stream = await youtube.stream(song.url, {cookie: process.env.COOKIES})
    await entersState(db[id].connection, VoiceConnectionStatus.Ready, 30_000);
    db[id].connection.subscribe(db[id].player)
    const resource = createAudioResource(stream.stream, {inputType: stream.type});
    db[id].player.play(resource);
}

async function video_player(id) {

    if (!db[id].player) setPlayer(id)

    if (!db[id].connection) return;

    const info = db[id]

    const song = info.queue[0]

    if (!song?.url) {
        return db[id].player.stop()
    }


    //ytdl quando resolverem o bug https://github.com/fent/node-ytdl-core/issues/994

    try {
        await play(song)
        // const resource = createAudioResource(stream.stream, {inputType: stream.type});
        // const resource = createAudioResource(stream.stdout, {seek:0, volume: 0.5});

    } catch (err) {
        song.channel.send('Algum fdp fez esta merda parar')
        info.connection.destroy();
        info.connection = undefined
        info.player.stop()
        info.queue = []
        throw err
    }


    /*let stream = youtubedl(song.url, {
        o: '-',
        q: '',
        f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
        r: '100K',
    }, { stdio: ['ignore', 'pipe', 'ignore'] })*/

    // let stream = ytdl(song.url, {
    //     requestOptions: {
    //         headers: {
    //             cookie: "CONSENT=YES+srp.gws-20210728-0-RC1.en+FX+460; VISITOR_INFO1_LIVE=wpCXfTzs0Eo; LOGIN_INFO=AFmmF2swRAIgbZkusEfqeGjN-FSZugvXQGno1QbdED4akJ69vfFm7OACIFhD_B8ikOghb90Atmiiw5BUriaxwG8C21XJPYvzuaPQ:QUQ3MjNmd0ZKbEJjTVI4M3h0MFBoS2t5UllrU1NLX2RIbkxySlpTaXpUVG9ucS1WT3dSYmZaaHZBcXVNeU8weFFIazdtdy12aFFseHNhSGg2YVhHNG1aaGppcmRtLTZobWptNDNMSldJbFlOaGNMZ1hwdlRXeDU4SHJhTzlDb0tuVjJ0b1czOTJFNjdtSFcwQ090b24zbEQ5M29sQUZmZk53; _gcl_au=1.1.1413043797.1628246279; NID=221=jTJQAAl-S2IKA7e841W26kNPBjOxpXeDaonYS61WjYVFWG22R3gAZXhTdbg73oF7UtVzTXoyqspnsgTAa5qPkLb0_Dd2XsBCOHrO75czEykhGRYfYbk8YTfTeFwBeUZerWM90oFr-zF2demFSSko8jQqHIdySCmt8usfeDDS6kQ; PREF=f6=480&hl=en&tz=Europe.Lisbon&volume=100; SID=BAhxd_wgAb2aQML44FR-aizdrPkmEQGA0CFzUUlUUKAPnDJaYVEb8QB75MblkT7hMqvrUw.; __Secure-1PSID=BAhxd_wgAb2aQML44FR-aizdrPkmEQGA0CFzUUlUUKAPnDJaGMC2wa_9W7LXvS5XYsNroQ.; __Secure-3PSID=BAhxd_wgAb2aQML44FR-aizdrPkmEQGA0CFzUUlUUKAPnDJaddHrTJtzqO-0PfME_gHQJQ.; HSID=AYoh8V2PO7qc5c0ks; SSID=AweXtdgTGog2yBDr_; APISID=XEIlUn6XkZcipHN1/AJz6Fhpw-wz2Dqky9; SAPISID=popoq6RzctHrINAS/A_rLJanlR8a_XIELp; __Secure-1PAPISID=popoq6RzctHrINAS/A_rLJanlR8a_XIELp; __Secure-3PAPISID=popoq6RzctHrINAS/A_rLJanlR8a_XIELp; YSC=jUHQib-A6lM; wide=1; SIDCC=AJi4QfElLZDehVrwqPAnCTuQeWk36Z9JGjMp2CnNwZBcXsSXMjUlOhl-uT4kAvVhRtlUgQzVNSQt; __Secure-3PSIDCC=AJi4QfElPqD9rTlkMQiPTTg2GkkFkbpttIg03lS-w0FBu6WhZc_C4R9yvNnTkcNdFhEAJ_ijBYY",
    //         },
    //     },
    //     filter: "audioonly"
    // });

    return true
}

function setPlayer(id) {
    db[id] = {
        queue: db[id]?.queue || [],
        player: db[id]?.player || createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        }),
        connection: db[id]?.connection || undefined,
        looping: db[id]?.looping || false,
        previous_music: db[id]?.undefined || undefined,
        ...db[id]
    }
    if (!db[id].idler) {
        db[id].idler = db[id].player.on(AudioPlayerStatus.Idle, async () => {
            if (!db[id].looping) {
                db[id].previousMusic = db[id].queue[0]
                db[id].queue.shift()
            }
            await play(db[id].queue[0])
        })
    }
}

async function setConnection (message, vc) {
    if (!db[message.guild.id]) setPlayer(message.channel.guild.id)

    try {
        db[message.guild.id].connection = await joinVoiceChannel({
            channelId: vc.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        });
    } catch (err) {
        console.log(err)
    }
    return true
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

async function playPlaylist(id, message, url, options) {

    const playlist = await youtube.playlist_info(url)
    const videos = []

    playlist.videos.forEach(v => {
        videos.push({
            title: v.title,
            url: v.url,
            duration: v.durationRaw,
            thumbnail_url: v.thumbnail.url,
            author: message.author,
            channel: message.channel
        })
    })

    if (options[0]?.toLowerCase() !== "noshuffle") {
        shuffleArray(videos)
    }

    const date = new Date()

    const embed = new MessageEmbed({
        "title": "Playlist adicionada",
        "color": 15158332,
        "timestamp": date,
        "description": options[1] === "hidden" ?
            `
                **${playlist.title}**
                Nº de Músicas: ${playlist.total_videos}
            `
            : `
                [${playlist.title}](${playlist.url})
                **Nº de Músicas**: ${playlist.total_videos}
            `,
        "thumbnail": {
            "url": playlist.thumbnail.url
        },
        "footer": {
            "icon_url": message.author.displayAvatarURL(),
            "text": `Playlist colocada por ${message.author.username}#${message.author.discriminator}`
        }
    })

    message.channel.send({embeds: [embed]})

    for (const v of videos) {
        await addToQueue(v);
    }
}

async function addToQueue(song) {
    if (!db[song.channel.guild.id]) setPlayer(song.channel.guild.id)
    db[song.channel.guild.id].queue.push(song)
    try {
        if (db[song.channel.guild.id].queue.length === 1) await video_player(song.channel.guild.id)
    } catch (err) {
        console.log(err)
    }
}

function cleanQueue(id) {
    db[id].queue = []
    db[id].player.stop()
}

module.exports = {
    setPlayer,

    getPlayer(id) {return db[id].player},

    getConnection (id) {return db[id].connection},

    setConnection,

    addToQueue,

    shuffleArray,

    getQueue(id) {
        return db[id].queue
    },

    setLooping (val, id) {
        if (!val) {
            db[id].looping = !db[id].looping
            return {newStatus: db[id].looping}
        }
        const yesValues = ["sim", "s", "yes", "true"]
        const noValues = ["nao", "não", "n", "no", "false"]

        if (yesValues.indexOf(val.toLowerCase()) > -1) {
            db[id].looping = true
        } else if (noValues.indexOf(val.toLowerCase()) > -1) {
            db[id].looping = false
        } else {
            return {notFound: true}
        }
        return {newStatus: db[id].looping}
    },

    playPlaylist,

    cleanQueue,

    removeSong(query, id) {
        let found = false
        let answer
        db[id].queue.slice(1).forEach((song, idx) => {
            if (found) return;

            if (song.title.toLowerCase().search(query.toLowerCase().trim()) > -1) {
                answer = db[id].queue.splice(idx+1, 1)
                found = true
            }
        })
        if (!found) {
            return false
        }
        return answer[0]
    },

    async playNow(id, song) {
        db[id].queue.unshift(song)

        try {
            await video_player(id)
        } catch (err) {
            console.log(err)
        }

        return true
    },

    async playPrevious(id) {
        if (!db[id].previousMusic) return false;
        db[id].queue.unshift(db[id].previousMusic)

        try {
            await video_player(id)
        } catch (err) {
            console.log(err)
        }

        return true
    },

    async restartSong(id) {
        try {
            await video_player(id)
        } catch (err) {
            console.log(err)
        }
    },

    async kill(id) {
        db[id].connection.destroy()
        db[id].connection = undefined
        db[id].queue = []
        db[id].player.stop()
        db[id].looping = false
    },

    async skipSong(message, id) {
        const song = db[id].queue[0]

        db[id].previousMusic = song

        const date = new Date()

        const embed = new MessageEmbed({
            "title": "A música vou saltar, ou porrada vou levar",
            "color": 15158332,
            "timestamp": date,
            "description": `
                Agradeçam a <@${message.author.id}> por saltar a música
                [${song.title}](${song.url})
            `,
            "thumbnail": {
                "url": song.thumbnail_url
            },
            "footer": {
                "icon_url": song.author.displayAvatarURL(),
                "text": `Música de ${song.author.username}#${song.author.discriminator}`
            }
        })

        song.channel.send({embeds: [embed]})

        db[id].queue.shift()

        try {
            await video_player(id)
        } catch (err) {
            console.log(err)
        }
    },

    video_player
};
