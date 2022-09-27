const cron = require("node-cron");
const axios = require("axios").default;
const cheerio = require("cheerio");
const config = require("./config.json");

const { Webhook } = require("simple-discord-webhooks");
const postman = new Webhook(config.discordWebhookURL);

const request = async (method, url, data = {}) => {
    let options = {
        method,
        url: url,
        headers: {
            Accept: "*/*",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; rv:104.0) Gecko/20100101 Firefox/104.0",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: new URLSearchParams(data).toString(),
    };

    return axios(options)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response || error;
        });
};

const dateYMD = (date) => {
    var d = date.getDate();
    var m = date.getMonth() + 1; // Month from 0 to 11
    var y = date.getFullYear();
    return `${y}-${m < 10 ? `0${m}` : m}-${d <= 9 ? `0${d}` : d}`;
};

const capitalize = (word) => {
    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
};

cron.schedule(config.cronDelay, async () => {
    const date = dateYMD(new Date());

    try {
        const embed = {
            title: "CROUS menu tracker",
            color: 0xe30512,
            thumbnail: {
                url: "https://www.etudiant.gouv.fr/sites/default/files/2020-09/Logo_Les_Crous_1_0.png",
            },
            footer: {
                text: "CROUS menu tracker © LockBlock-dev",
            },
        };
        const res = await request("POST", config.endpoint, {
            ru: config.crousId,
            dt: date, // YYYY-MM-DD
        });
        const resultHTML = cheerio.load(res.data);
        const menu = {
            period: capitalize(resultHTML(".menuRu > h2").text()), // todo: handle evening meal (when we have 2 periods)
            self: {
                entrees: [],
                plat: [], // HTML DOES NOT INCLUDE AN S FOR SOME REASONS >:(
                desserts: [],
            },
            brasserie: {
                entrees: [],
                plats: [],
                desserts: [],
            },
        };

        resultHTML(".menuRu > ul").each((idx, ul) => {
            // for each <ul> of .menuRu
            resultHTML(ul)
                .children("li")
                .each((_, li) => {
                    // for each <li> of <ul>
                    const prev = resultHTML(ul).prev().text();
                    let [category, type] = prev.split(" "); // from "Entrées Self"
                    category = category.toLowerCase().replace("é", "e"); // Entrées ; Plat(s) ; Desserts
                    type = type.toLowerCase(); // self ; brasserie

                    menu[type][category].push(resultHTML(li).text()); // append the meal to the correct list
                });
        });

        /*
        Parsing HTML:
        <div class="menuRu">
            <h2>midi</h2>
            <h4>CATEGORY TYPE</h4>
            <ul class="liste-plats">
                <li>Something 1</li>
                <li>Something 2</li>
                <li>Something 3</li>
            </ul>
            ...
        </div>
        */

        if (res.status != 200) return;

        embed.description = `Menu pour le ${date}`;

        embed.fields = [
            {
                name: "CROUS",
                value: config.crousList[config.crousId],
            },
            {
                name: "Période",
                value: menu.period,
            },
            {
                name: "Self",
                value: `• Entrées :
\`\`\` - ${menu.self.entrees.join("\n - ")}\`\`\`
• Plats :
\`\`\` - ${menu.self.plat.join("\n - ")}\`\`\`
• Desserts :
\`\`\` - ${menu.self.desserts.join("\n - ")}\`\`\`
`,
            },
            {
                name: "Brasserie",
                value: `• Entrées :
\`\`\` - ${menu.brasserie.entrees.join("\n - ")}\`\`\`
• Plats :
\`\`\` - ${menu.brasserie.plats.join("\n - ")}\`\`\`
• Desserts :
\`\`\` - ${menu.brasserie.desserts.join("\n - ")}\`\`\`
`,
            },
        ];

        postman.send(`${config.ownerId ? `<@${config.ownerId}>` : ""}`, [embed]);
        console.log(`${date} - menu sent!`);
    } catch (e) {
        console.error(`${date} - ${e}`);
    }
});
