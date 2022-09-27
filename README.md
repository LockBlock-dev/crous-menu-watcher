# crous-menu-watcher

[![axios](https://img.shields.io/github/package-json/dependency-version/LockBlock-dev/crous-menu-watcher/axios)](https://www.npmjs.com/package/axios) [![cheerio](https://img.shields.io/github/package-json/dependency-version/LockBlock-dev/crous-menu-watcher/cheerio)](https://www.npmjs.com/package/cheerio) [![node-cron](https://img.shields.io/github/package-json/dependency-version/LockBlock-dev/crous-menu-watcher/node-cron)](https://www.npmjs.com/package/node-cron) [![simple-discord-webhooks](https://img.shields.io/github/package-json/dependency-version/LockBlock-dev/crous-menu-watcher/simple-discord-webhooks)](https://www.npmjs.com/package/simple-discord-webhooks)

[![GitHub stars](https://img.shields.io/github/stars/LockBlock-dev/crous-menu-watcher.svg)](https://github.com/LockBlock-dev/crous-menu-watcher/stargazers)

A bot that monitors Crous menu and sends it to a Discord webhook

## Installation

-   Install [NodeJS](https://nodejs.org).
-   Download or clone the project.
-   Run `npm install`.
-   Edit the [config.json](./index.json):

```json
{
    "discordWebhookURL": "https://discord.com/api/webhooks/XXXXXXXXXXX", // the Discord webhook URL
    "cronDelay": "0 10 */1 * *", // cronjob, default is each day at 10:00
    "ownerId": "DISCORD_ID", // your Discord ID (to ping you)
    "endpoint": "https://www.example.com/getMenu.php", // menu endpoint
    "crousId": "rXXX", // the CROUS you want to track
    "crousList": {} // some CROUS IDs
}
```

-   Run `node index.js` OR `npm start`.

## Copyright

See the [license](/LICENSE)
