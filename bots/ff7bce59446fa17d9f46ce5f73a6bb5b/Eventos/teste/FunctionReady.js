const { JsonDatabase } = require("wio.db");
const fs = require('fs');
const Checkout = require("../../Functions/Checkout");
const { EditMessage } = require("../../Functions/RobloxSystem");
const { set } = require("mongoose");



module.exports = {
    name: 'ready',

    run: async (client) => {

        console.log(`\x1b[36m[INFO]\x1b[32m ${client.user.tag} Foi iniciado - Atualmente ${client.guilds.cache.size} servidores! - Tendo acesso a ${client.channels.cache.size} canais! - Contendo ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} usuarios!\x1b[0m`);



        const botId = client.user.id;
//a
        const databasePath = `./DataBaseJson/${botId}`;

        if (!fs.existsSync(databasePath)) {
            fs.mkdirSync(databasePath, { recursive: true });
        }

        client.db = {
            settings: new JsonDatabase({
                databasePath: `${databasePath}/settings.json`
            }),
            carrinhos: new JsonDatabase({
                databasePath: `${databasePath}/carrinhos.json`
            })
        };

        // setInterval(() => {
        //     Checkout(client);
        // }, 20000);

        setInterval(() => {

            Checkout(client);
        }, 10000);


        setInterval(() => {
            EditMessage(client);
        }, 10000);
        EditMessage(client);

    }
}
