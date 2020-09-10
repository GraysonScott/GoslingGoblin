const moment = require('moment')
require('dotenv').config()
const { Client } = require('discord.js')
const client = new Client()
const calendar = require('./calendar')

client.once('ready', () => {
    console.log(`${client.user.tag} has logged in.`)
    sayHello()
    waitUntilTime(21)
})

async function sayHello() {
    try {
        const channel = await client.channels.cache.get(process.env.CHANNEL_ID)
        await channel.send("Hello")
    }
    catch (err) {
        console.log(err)
    }
}

// Gets the next event in the calendar and then sends the message if garbage day is tomorrow.
async function sendMessage() {
    try {
        const channel = await client.channels.cache.get(process.env.CHANNEL_ID)
        const event = await calendar.getNextEvent()
        if (!event) return channel.send("No event found").catch((e) => {
            console.log("Unable to send message", e)
        })

        if (checkTomorrow(event.start.date)) {
            await channel.send(`Garbage day is tomorrow! This week is ${event.summary.toLowerCase()}.`)
        }
    }
    catch (err) {
        console.log(err)
    }
}

// Takes the date from the calendar event then compares to the current date plus one day.
// Returns true if the dates match or false if they don't.
function checkTomorrow(event) {
    const tomorrow = moment()
    tomorrow.add(1, 'days')
    const eventDate = moment(event, 'YYYY-MM-DD')

    if (tomorrow.isSame(eventDate, 'days')) {
        return true
    }

    return false
}

// Compares the current time to the desired time and sets a timeout until that time is reached.
// At the desired time, calls sendMessage and then sets an interval to call it at the same time every day.
function waitUntilTime(time) {
    const now = moment()
    const target = moment(`${now.year()}-${now.month() + 1}-${now.date()} ${time}:${00}`, 'YYYY-MM-DD HH:mm')
    let milliSecTillTime = target.diff(now)

    if (milliSecTillTime < 0) {
        milliSecTillTime += 86400000
    }

    setTimeout(() => {
        sendMessage()
        setInterval(() => {
            sendMessage()
        }, 24 * 60 * 60 * 1000)
    }, milliSecTillTime)
}

client.login(process.env.DISCORD_BOT_TOKEN)

