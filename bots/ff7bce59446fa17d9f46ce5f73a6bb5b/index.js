const { GatewayIntentBits, Client, Collection } = require("discord.js")
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
    ]
});
const events = require('./Handler/events')
const slash = require('./Handler/slash');


slash.run(client)
events.run(client)

//teste.js

client.slashCommands = new Collection();

process.on('unhandRejection', (reason, promise) => {
    console.log(`🚫 Erro Detectado:\n\n` + reason, promise)
});
process.on('uncaughtException', (error, origin) => {
    console.log(`🚫 Erro Detectado:\n\n` + error, origin)
});
process.on('uncaughtExceptionMonitor', (error, origin) => {
    console.log(`🚫 Erro Detectado:\n\n` + error, origin)
});

client.on('messageCreate', (message) => {

console.log(message.content)

})


//client.login(config.token);
client.login('MTM0MTM4NTk0MzM2NTQ1MTg3Ng.GqAzb-.pYo6FLpL96xrfPvjtOdBC4fp1eXp8zTZ4tfbgI')