require('dotenv').config()
const { Client } = require('discord.js')
const client = new Client()
const calendar = require('./calendar')

client.once('ready', () => {
    console.log(`${client.user.tag} has logged in.`)
    sendMessage()
})

client.login(process.env.DISCORD_BOT_TOKEN)

async function sendMessage() {
    try {
        const channel = await client.channels.cache.get(process.env.CHANNEL_ID)
        // console.log(channel)
        const event = await calendar.getNextEvent()
        if (!event) return channel.send("No event found").catch((e) => {
            console.log("Unable to send message")
        })
        console.log(event)
        console.log(event.start.date)
        if (checkTomorrow(event.start.date)) {
            await channel.send(`Garbage day is tomorrow! This week is ${event.summary.toLowerCase()}.`)
        }
        //await channel.send(event.summary)
    }
    catch (err) {
        console.log(err)
    }
}

// Takes the date from the calendar event, splits it into year/month/day, turns it into a Date object, then compares to the current date.
// Returns true if the date is tomorrow or false if it's not.
function checkTomorrow(event) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const eventArray = event.split('-')
    const eventDate = new Date(eventArray[0], eventArray[1] - 1, eventArray[2])

    console.log(tomorrow)
    console.log(eventDate)


    if (tomorrow.getFullYear() == eventDate.getFullYear() && tomorrow.getMonth() == eventDate.getMonth() &&
        tomorrow.getDate() == eventDate.getDate()) {
        console.log("Matching Date")
        console.log(tomorrow, eventDate)
        return true
    }
    return false
}
