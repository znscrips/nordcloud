const Discord = require("discord.js");
const {
    ButtonBuilder,
    EmbedBuilder,
    ActionRowBuilder,
} = require('discord.js');
const { ConfigPage } = require("../../Functions/RobloxSystem");

module.exports = {
    name: "members-config",
    description: "[🔥] Configurar venda de membros",
    type: Discord.ApplicationCommandType.ChatInput,
    defaultMemberPermissions: Discord.PermissionFlagsBits.Administrator,
    exclusive: true,

    run: async (client, interaction) => {

if(interaction.user.id !== '852603072026247220') return interaction.reply({content: `Negado!`})

        ConfigPage(client, interaction, 1)
           


    }
}