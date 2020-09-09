require('dotenv').config()
const { google } = require('googleapis')
const { OAuth2 } = google.auth
const oAuth2Client = new OAuth2(
    process.env.GOOGLE_CALENDAR_API_CLIENT,
    process.env.GOOGLE_CALENDAR_API_SECRET
)

oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_CALENDAR_API_TOKEN
})

const calendar = google.calendar({
    version: 'v3',
    auth: oAuth2Client
})

async function getNextEvent() {
    try {
        const event = await calendar.events.list({
            calendarId: process.env.GARBAGE_CALENDAR_ID,
            timeMin: (new Date()).toISOString(),
            maxResults: 1,
            singleEvents: true,
            orderBy: 'startTime',
        })
        return event.data.items[0]
    }
    catch (e) {
        console.log("Error getting event", e)
    }
}

module.exports.getNextEvent = getNextEvent