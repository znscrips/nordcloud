const { ButtonBuilder, ActionRowBuilder, TextInputStyle, TextInputBuilder, ModalBuilder, EmbedBuilder, StringSelectMenuBuilder, SelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelType } = require('discord.js');
const axios = require('axios');


async function ConfigPage(client, interaction, a) {

    let tokenff = client.db.settings.get('TokenAPI')
    let tokenmp = client.db.settings.get('TokenMP')

    let ddd = client.db.settings.get('PriceOne')

    if (ddd == null) {
        ddd = 0
    }


    if (tokenff == null) {
        tokenff = '\`Nenhum token definido\`'
    } else {
        tokenff = `\`${String(tokenff).substring(0, 20)}...\``;
    }

    if (tokenmp == null) {
        tokenmp = '\`Nenhum token definido\`'
    } else {
        tokenmp = `\`${String(tokenmp).substring(0, 30)}...\``;
    }



    let embed = new EmbedBuilder()
        .setAuthor({ name: 'Configuração de Membros', iconURL: 'https://cdn.discordapp.com/emojis/1229794637846282340.png?size=2048' })
        .setDescription('Aqui você pode configurar a venda de membros do OAuth2 da promisse.')
        .setFields(
            { name: 'Token API', value: tokenff, inline: true },
            { name: 'Token Mercado Pago', value: tokenmp, inline: true },
        )
        .setColor('Blue')

    let buttons = new ButtonBuilder()
        .setCustomId('tokenapioauth2')
        .setLabel('Setar Token API (OAuth2)')
        .setStyle(2)
        .setEmoji('1224017001060499556')
        .setDisabled(false)

    let buttons2 = new ButtonBuilder()
        .setCustomId('tokenmp')
        .setLabel('Setar Mercado Pago')
        .setStyle(2)
        .setEmoji('<:4757mercadopago:1249235248261369917>')
        .setDisabled(false)

    let buttons3 = new ButtonBuilder()
        .setCustomId('changeprices')
        .setLabel('Alterar Preços de Venda')
        .setStyle(2)
        .setEmoji('<:7347minecraftmoney:1249230465437667348>')
        .setDisabled(false)

    let buttons4 = new ButtonBuilder()
        .setCustomId('cupoms')
        .setLabel('Configurar Cupons de Desconto')
        .setStyle(2)
        .setEmoji('<:8965vslticket:1249235085534822511>')
        .setDisabled(false)


    let actionRow = new ActionRowBuilder()
        .addComponents(buttons)
        .addComponents(buttons2)
        .addComponents(buttons3)

    let actionRow2 = new ActionRowBuilder()
        .addComponents(buttons4)


    if (a == 1) {
        await interaction.reply({ embeds: [embed], components: [actionRow, actionRow2], ephemeral: true, content: `` })
    } else if (a == 2) {
        await interaction.editReply({ embeds: [embed], components: [actionRow, actionRow2], ephemeral: true, content: `` })
    } else {
        await interaction.update({ embeds: [embed], components: [actionRow, actionRow2], ephemeral: true, content: `` })
    }
}

async function CreateCarrinho(client, interaction, a) {

    let embedCarregando = new EmbedBuilder()
        .setAuthor({ name: 'Criando Carrinho', iconURL: 'https://cdn.discordapp.com/emojis/1249245160571797505.webp?size=96&quality=lossless' })
        .setDescription('Aguarde, estamos criando o carrinho...')
        .setColor('#5865F2')

    await interaction.reply({ embeds: [embedCarregando], ephemeral: true, content: `` })

    let infos = client.db.settings.get('TokenAPI')
    let prico = client.db.settings.get('PriceOne')

    let puxar = await fetch(`https://promisse.app/api/checktoken?token=${infos}`)
    puxar = await puxar.json()

    if(puxar.code == 400) return interaction.editReply({ content: `Este codigo foi configurado incorretamente contate um Administrador.`, ephemeral: true });

    puxar.usuarios = puxar.usuarios.filter(x => x.access_token !== 'unauthorized');


    if (!infos) return interaction.reply({ content: `Este codigo foi configurado incorretamente contate um Administrador.`, ephemeral: true });

    let precoPor100Membros = Number(prico) * 50;
    let formattedPrice = precoPor100Membros.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const thread2222 = interaction.channel.threads.cache.find(x => x.name === `🛒・${interaction.user.username}・${interaction.user.id}`);
    if (thread2222 !== undefined) {

        let embed2 = new EmbedBuilder()
            .setAuthor({ name: `Venda de M3mbr0s R3a1s (Promisse Applications)`, iconURL: `https://cdn.discordapp.com/emojis/1249245160571797505.webp?size=96&quality=lossless` })
            .setDescription(`❌ Você já possuí um carrinho aberto.`)
            .setColor(`#5865F2`)
        interaction.editReply({ ephemeral: true, embeds: [embed2], content: `${interaction.user}`, components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setURL(`https://discord.com/channels/${interaction.guild.id}/${thread2222.id}`).setLabel('Ir para o carrinho').setStyle(5))] })

        return
    }


    const thread = await interaction.channel.threads.create({
        name: `🛒・${interaction.user.username}・${interaction.user.id}`,
        autoArchiveDuration: 60,
        type: ChannelType.PrivateThread,
        reason: 'Needed a separate thread for moderation',
        members: [interaction.user.id],
    });

    client.db.carrinhos.set(`${thread.id}`, { CreateAt: Date.now(), userid: interaction.user.id, guildid: interaction.guild.id, infos: { quantidade: 50, precoone: prico, maxqtd: puxar.usuarios.length, idbot: puxar.botid } })

    let embed = new EmbedBuilder()
        .setAuthor({ name: `Venda de M3mbr0s R3a1s (Promisse Applications)`, iconURL: `https://cdn.discordapp.com/emojis/1249245160571797505.webp?size=96&quality=lossless` })
        .setFields(
            { name: `Quantidade: `, value: `\`50 Membros\``, inline: true },
            { name: `Preço: `, value: `\`${formattedPrice}\``, inline: true },
            { name: `Membros Dísponivel: `, value: `\`${puxar.usuarios.length}\``, inline: true },
        )
        .setColor(`#5865F2`)

    let buttons = new ButtonBuilder()
        .setStyle(1)
        .setCustomId('add')
        .setEmoji('<:1240702950318542999:1249258320880205897>')
    let buttons2 = new ButtonBuilder()
        .setStyle(4)
        .setCustomId('rem')
        .setEmoji('<:1240702979301052477:1249258322918510663>')
    let buttons3 = new ButtonBuilder()
        .setStyle(2)
        .setCustomId('edit')
        .setEmoji('✏️')
    let buttons4 = new ButtonBuilder()
        .setStyle(4)
        .setLabel('Cancelar Compra')
        .setCustomId('CancelCompra')
        .setEmoji('<:4247off:1249255826602852372>')
    let buttons5 = new ButtonBuilder()
        .setStyle(3)
        .setLabel('Confirmar Compra')
        .setCustomId('ConfirmarCompra')
        .setEmoji('<:2003on:1249255825340502088>')

    let buttons6 = new ButtonBuilder()
        .setStyle(2)
        .setLabel('Aplicar Cupom')
        .setCustomId('AplicarCupom')
        .setEmoji('<:1731discordprofileactivitydark:1249255828343492638>')



    let actionRow = new ActionRowBuilder()
        .addComponents(buttons2, buttons3, buttons, buttons6)
    let actionRow2 = new ActionRowBuilder()
        .addComponents(buttons4, buttons5)

    thread.send({ embeds: [embed], components: [actionRow, actionRow2], content: `${interaction.user}` })

    let embed2 = new EmbedBuilder()
        .setAuthor({ name: `Venda de M3mbr0s R3a1s (Promisse Applications)`, iconURL: `https://cdn.discordapp.com/emojis/1249245160571797505.webp?size=96&quality=lossless` })
        .setDescription(`✅ Seu carrinho foi criado com sucesso!`)
        .setColor(`#5865F2`)

    interaction.editReply({ ephemeral: true, embeds: [embed2], content: `${interaction.user}`, components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setURL(`https://discord.com/channels/${interaction.guild.id}/${thread.id}`).setLabel('Ir para o carrinho').setStyle(5))] })



}

async function AlterarQTD(client, interaction) {

    let carrinho = client.db.carrinhos.get(`${interaction.channel.id}`)

    let preco22 = null
    if (carrinho.infos.cupom) {
        let cupom = carrinho.infos.cupom
        let preco = Number(carrinho.infos.precoone) * carrinho.infos.quantidade
        let porcentagem = preco * Number(cupom.porcentagem) / 100
        preco = preco - porcentagem
        preco = preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        preco22 = preco
    }
    let precoPor100Membros = Number(carrinho.infos.precoone) * carrinho.infos.quantidade;
    let formattedPrice = precoPor100Membros.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });



    let embed = new EmbedBuilder()
        .setAuthor({ name: `Venda de M3mbr0s R3a1s (Promisse Applications)`, iconURL: `https://cdn.discordapp.com/emojis/1249245160571797505.webp?size=96&quality=lossless` })
        .setFields(
            { name: `Quantidade: `, value: `\`${carrinho.infos.quantidade} Membros\``, inline: true },
            { name: `Preço: `, value: `${preco22 == null ? `\`${formattedPrice}\`` : `\~\~${formattedPrice}\~\~ \`${preco22}\``}`, inline: true },
            { name: `Membros Dísponivel: `, value: `\`${carrinho.infos.maxqtd}\``, inline: true },
        )
        .setColor(`#5865F2`)

    let buttons = new ButtonBuilder()
        .setStyle(1)
        .setCustomId('add')
        .setEmoji('<:1240702950318542999:1249258320880205897>')
    let buttons2 = new ButtonBuilder()
        .setStyle(4)
        .setCustomId('rem')
        .setEmoji('<:1240702979301052477:1249258322918510663>')
    let buttons3 = new ButtonBuilder()
        .setStyle(2)
        .setCustomId('edit')
        .setEmoji('✏️')
    let buttons4 = new ButtonBuilder()
        .setStyle(4)
        .setLabel('Cancelar Compra')
        .setCustomId('CancelCompra')
        .setEmoji('<:4247off:1249255826602852372>')
    let buttons5 = new ButtonBuilder()
        .setStyle(3)
        .setLabel('Confirmar Compra')
        .setCustomId('ConfirmarCompra')
        .setEmoji('<:2003on:1249255825340502088>')
    let buttons6 = new ButtonBuilder()
        .setStyle(2)
        .setLabel('Aplicar Cupom')
        .setCustomId('AplicarCupom')
        .setEmoji('<:1731discordprofileactivitydark:1249255828343492638>')



    let actionRow = new ActionRowBuilder()
        .addComponents(buttons2, buttons3, buttons, buttons6)
    let actionRow2 = new ActionRowBuilder()
        .addComponents(buttons4, buttons5)

    await interaction.update({ embeds: [embed], components: [actionRow, actionRow2] })




}





async function EditMessage(client) {

    let ddd = client.db.carrinhos.filter(x => x.data.entregas)

    for (const element in ddd) {
       try {
        let data = ddd[element].data
        let guildid = data.guildid

        let channel
        let message
        let user = null
        try {
			channel = client.channels.cache.get(data.pagamentos.channelid)
			message = await channel.messages.fetch(data.entregas.messageid)
            user = await client.users.fetch(data.userid)
        } catch (error) {

        }

        let status = await axios.get(`https://promisse.app/api/request?pass=${data.entregas.license}`, {
            method: 'GET',
            headers: {
                Authorization: "1082839642065346601",
                'Content-Type': 'application/json',
            },
        })
        status = status.data

        if (status.code == 400) return message.reply({ content: `Chame um Administrador, ocorreu um erro ao verificar o status do pedido. ${user == null ? 'Não definido' : `<@!${user.id}>`}`, ephemeral: true })

        let embed = new EmbedBuilder()
            .setAuthor({ name: 'Pedido Realizado', iconURL: 'https://cdn.discordapp.com/emojis/1249230465437667348.webp?size=96&quality=lossless' })
            .setDescription(`- Olá *${user == null ? 'Não definido' : user.username}*, seu pedido foi realizado com sucesso!`).setColor('#5865F2')
            .addFields(
                { name: `ID do Pedido`, value: `\`${data.pagamentos.id}\``, inline: true },
                //Status do Pedido { name: `Status`, value: `\`${status.qtdpuxados}/${status.quantidade}\``, inline: true },
                { name: `Quantidade`, value: `\`${status.quantidade} membros\``, inline: true },
                { name: `Status do Pedido`, value: `\`${status.status == 'Concluido Parcialmente' ? 'Concluido' : status.status}\``, inline: true },

            )


        message.edit({ embeds: [embed] })

        if (status.status !== 'Pendente') {
            client.db.carrinhos.delete(`${ddd[element].ID}`)

            let channellogs = await client.channels.fetch('1249578729861025864')
            let channellogs2 = await client.channels.fetch('1250965933560954972')

            let embedlog = new EmbedBuilder()
                .setAuthor({ name: 'Pedido Finalizado', iconURL: 'https://cdn.discordapp.com/emojis/1249230465437667348.webp?size=96&quality=lossless' })
                .setDescription(`- Um novo pedido foi finalizado`).setColor('#5865F2')
                .addFields(
                    { name: `Responsavel`, value: `<@!${user.id}> (\`${user.id}\`)`, inline: true },
                    { name: `ID do Pedido`, value: `\`${data.pagamentos.id}\``, inline: true },
                    { name: `Status`, value: `\`${status.qtdpuxados}/${status.quantidade}\``, inline: true },
                    { name: `Quantidade`, value: `\`${status.quantidade} membros\``, inline: true },
                    { name: `Status do Pedido`, value: `\`${status.status == 'Concluido Parcialmente' ? 'Concluido' : 'Concluido'}\``, inline: true },
                )

            if (guildid == '1241239036786511954') {
                channellogs2.send({ embeds: [embedlog] })
            } else {
                channellogs.send({ embeds: [embedlog] })
            }


            if (user !== null) {

                let EmbedBuilder22 = new EmbedBuilder()
                    .setAuthor({ name: 'Pedido Finalizado', iconURL: 'https://cdn.discordapp.com/emojis/1249230465437667348.webp?size=96&quality=lossless' })
                    .setDescription(`- Olá *${user.username}*, seu pedido foi finalizado com sucesso!`).setColor('#5865F2')
                    .addFields(
                        { name: `ID do Pedido`, value: `\`${data.pagamentos.id}\``, inline: true },
                        //     { name: `Status`, value: `\`${status.qtdpuxados}/${status.quantidade}\``, inline: true },
                        { name: `Quantidade`, value: `\`${status.quantidade} membros\``, inline: true },
                        { name: `Status do Pedido`, value: `\`${status.status == 'Concluido Parcialmente' ? `Concluido` : status.status}\``, inline: true },
                    )


                user.send({ embeds: [EmbedBuilder22] })

            }

            try {
                await channel.send({
                    content: `Agradecemos pela sua compra, ${user ? `<@!${user.id}>` : 'Cliente'}, sinta-se à vontade para explorar mais produtos em nossa loja! Este canal será fechado nos próximos 10 segundos.`
                })
            } catch (error) {

            }


            setTimeout(async () => {
                try {
                    await channel.delete()
                } catch (error) {

                }

            }, 10000);
        }

   } catch (error) {
       	
       }




    }

}


module.exports = {
    ConfigPage,
    CreateCarrinho,
    AlterarQTD,
    EditMessage
}
