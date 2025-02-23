const Discord = require("discord.js");
const {
    ButtonBuilder,
    EmbedBuilder,
    ActionRowBuilder,
} = require('discord.js');
const { ConfigPage } = require("../../Functions/RobloxSystem");

module.exports = {
    name: "members-message2",
    description: "[🔥] Configurar mensagem de membros",
    type: Discord.ApplicationCommandType.ChatInput,
    defaultMemberPermissions: Discord.PermissionFlagsBits.Administrator,
    exclusive: true,
    
    

    run: async (client, interaction) => {

        let infos = client.db.settings.get('TokenAPI')
        let prico = client.db.settings.get('PriceOne')
        if(!infos) return interaction.reply({content: `Você precisa configurar o token da API.`, ephemeral: true});
        let precoPor100Membros = Number(prico) * 100;
        let formattedPrice = precoPor100Membros.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
        
    
        let buttons = new ButtonBuilder()
        .setStyle(2)
        .setLabel('Realizar Compra')
        .setCustomId('buy-members')
        .setEmoji('<:dinheiro_branco:1239066113673793627>')
        let image = 'https://cdn.discordapp.com/attachments/1240822970595938397/1250965437106225222/membro.png?ex=666cdbda&is=666b8a5a&hm=1a6708a678277853c4e7c76d92deb91838bfce6d9011c43adc85c8a1b76fd053&'

        const attachment = new Discord.AttachmentBuilder(image, { name: 'banner.png' });
        
        interaction.channel.send({files: [attachment], content: `# <:8b52fa64b3cb498f903082eca0ba1c2e:1244724284925018113> Membros Reais\n- Fortaleça sua comunidade com membros autênticos!\n- A maioria dos membros é adicionada quase instantaneamente.\n- Zero risco de queda do servidor, entrega discreta e eficiente.\n- **Entrega instantânea**, com garantia de qualidade, mesmo em casos de atrasos técnicos.`, components: [new ActionRowBuilder().addComponents(buttons)]})

        interaction.reply({content: `Mensagem de membros enviada com sucesso.`, ephemeral: true});
        

       


    }
}