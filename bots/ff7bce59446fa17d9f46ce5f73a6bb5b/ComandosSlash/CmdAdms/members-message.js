const Discord = require("discord.js");
const {
    ButtonBuilder,
    EmbedBuilder,
    ActionRowBuilder,
} = require('discord.js');
const { ConfigPage } = require("../../Functions/RobloxSystem");

module.exports = {
    name: "members-message",
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
        
   
        let embed = new EmbedBuilder()
        .setAuthor({name: `Venda de M3mbr0s R3a1s (Promisse Applications)`, iconURL: `https://cdn.discordapp.com/emojis/1249245160571797505.webp?size=96&quality=lossless`})
        .setFields(
            {name: `Preço: `, value: `\`${formattedPrice} - 100 Membros\``, inline: true},
            {name: `Descrição: `, value: `- Nossos membros são entregues instantaneamente após a confirmação do pagamento!\n- Por favor, note que a remoção do BOT de autenticação resultará na interrupção da função de adição de membros. A responsabilidade pela gestão dos membros adicionados é do cliente.\n- Os membros são usuários recentemente registrados em serviços de autenticação aprovados pelo Discord. Garantimos que todos são 100% pessoas reais.`, inline: false},
			{name: `Nicho dos membros:`, value: `- Lojas de variados produtos dentro do Discord.\n- A maioria dos membros são ativos e estão frequentemente online, proporcionando ótimos resultados para nossos clientes.`}
        )
        .setColor(`#5865F2`)
		.setImage(`https://media.discordapp.net/attachments/1251015885997604938/1252454849065259008/promisse-mem.png?ex=667246f9&is=6670f579&hm=4ad0ba18cdd50270d89d23252a67ad7dbabbf0c604d8a8719a486d48ef33e72b&=&format=webp&quality=lossless&width=1014&height=676`)

        let buttons = new ButtonBuilder()
        .setStyle(2)
        .setLabel('Comprar M3mbr0s')
        .setCustomId('buy-members')
        .setEmoji('<:8916shoppingcart1:1249247593775763557>')
		
	   // let image = 'https://cdn.discordapp.com/attachments/1240822970595938397/1250965437106225222/membro.png?ex=666cdbda&is=666b8a5a&hm=1a6708a678277853c4e7c76d92deb91838bfce6d9011c43adc85c8a1b76fd053&'

    //     const attachment = new Discord.AttachmentBuilder(image, { name: 'banner.png' });
        
        interaction.channel.send({embeds: [embed], components: [new ActionRowBuilder().addComponents(buttons)]})

        interaction.reply({content: `Mensagem de membros enviada com sucesso.`, ephemeral: true});
        

       


    }
}