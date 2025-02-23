const { default: axios } = require("axios");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");

async function Checkout(client) {

    let filteredCarts = client.db.carrinhos.filter(x => Boolean(x.data.pagamentos) && x.data.status !== 'Aprovado');

    for (const element in filteredCarts) {

        let data = filteredCarts[element].data
        let guildid = data.guildid

        var res = await axios.get(`https://api.mercadopago.com/v1/payments/${data.pagamentos.id}`, {
            headers: {
                Authorization: `Bearer ${client.db.settings.get('TokenMP')}`
            }
        })


        if (res.data.status == 'pending') {
            if (data.pagamentos?.alert == false) return
            if (data.pagamentos?.alert == undefined) {
                try {


                    let channel = await client.channels.fetch(data.pagamentos.channelid)
                    let user = await client.users.fetch(data.userid)

                    let currentTime = Date.now();
                    let paymentCreationTime = new Date(data.pagamentos.createAt).getTime();
                    let fiveMinutes = 1 * 60 * 1000;

                    if (currentTime - paymentCreationTime >= fiveMinutes) {


                        let embed = new EmbedBuilder()
                            .setAuthor({ name: 'Pagamento Pendente', iconURL: 'https://cdn.discordapp.com/emojis/1249247593775763557.webp?size=96&quality=lossless' })
                            .setDescription(`- Olá *${user.username}*, percebi que você ainda não realizou o pagamento. Não se esqueça de completar o processo para garantir os itens do seu carrinho. Vou deixar os detalhes do seu carrinho aqui para facilitar a conclusão do pagamento.`)
                            .setFooter({ text: 'Obrigado por comprar conosco!' })
                            .setColor('#5865F2')



                        let msg = await channel.send({ content: `<@!${user.id}>`, embeds: [embed] })
                        client.db.carrinhos.set(`${filteredCarts[element].ID}.pagamentos.alert`, { msgid: msg.id, time: Date.now() })
                    }
                } catch (error) {

                }
            } else {
                let Minutes10 = 10 * 60 * 1000;
                let dd = data.pagamentos.alert?.time + Minutes10;

                if (Date.now() >= dd) {
                    try {


                        let channel2 = await client.channels.fetch(data.pagamentos.channelid)
                        let msg2 = await channel2.messages.fetch(data.pagamentos.alert.msgid)

                        await msg2.delete()

                        let channel = await client.channels.fetch(data.pagamentos.channelid)
                        let user = await client.users.fetch(data.userid)

                        let embed = new EmbedBuilder()
                            .setAuthor({ name: 'Pagamento Pendente', iconURL: 'https://cdn.discordapp.com/emojis/1249247593775763557.webp?size=96&quality=lossless' })
                            .setDescription(`- Olá *${user.username}*, percebi que você ainda não realizou o pagamento. Não se esqueça de completar o processo para garantir os itens do seu carrinho. Vou deixar os detalhes do seu carrinho aqui para facilitar a conclusão do pagamento.`)
                            .setFooter({ text: 'Obrigado por comprar conosco!' })
                            .setColor('#5865F2')

                        let msg = await channel.send({ content: `<@!${user.id}>`, embeds: [embed] })
                        client.db.carrinhos.set(`${filteredCarts[element].ID}.pagamentos.alert`, { msgid: msg.id, time: Date.now() })
                    } catch (error) {
                        if (error.rawError.message == 'Unknown Channel') {
                            console.log(1)
                            client.db.carrinhos.delete(filteredCarts[element].ID)
                        }
                        console.log(error)
                    }
                }

            }
        }

        if (res.data.status == 'approved') {


            client.db.carrinhos.set(`${filteredCarts[element].ID}.pagamentos.alert`, false)

            let channel
            try {

                channel = await client.channels.fetch(data.pagamentos.channelid)

            } catch (error) {
                console.log(22)
                client.db.carrinhos.delete(`${filteredCarts[element].ID}`)
                return
            }

            // delete all mensagens channels

            try {
                let messages = await channel.messages.fetch();
                await channel.bulkDelete(messages);
            } catch (error) {
                console.log(33)
            }

            // faça com bukket

          



            let user = await client.users.fetch(data.userid)

            channel.setName(`✅ ・ ${user.username} ・ Pagamento Aprovado`)

            let channellogs = await client.channels.fetch('1249577491643895888')
            let channellogs2 = await client.channels.fetch('1250965904918057061')

            let logsEmbed = new EmbedBuilder()
                .setAuthor({ name: 'Pagamento Aprovado', iconURL: 'https://cdn.discordapp.com/emojis/1249247593775763557.webp?size=96&quality=lossless' })
                .setDescription(`- Pagamento Aprovado`).setColor('#5865F2')
                .addFields(
                    { name: `User`, value: `<@!${user.id}> (\`${user.id}\`)` },
                    { name: `ID`, value: `\`${filteredCarts[element].ID}\`` },
                    { name: `Valor`, value: `\`${Number(res.data.transaction_amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`` },
                    { name: `Quantidade`, value: `\`${data.infos.quantidade}\`` },

                )

            if (guildid == '1241239036786511954') {
                channellogs2.send({ embeds: [logsEmbed] })
            } else {
                channellogs.send({ embeds: [logsEmbed] })
            }




            let embed = new EmbedBuilder()
                .setAuthor({ name: 'Pagamento Aprovado', iconURL: 'https://cdn.discordapp.com/emojis/1249247593775763557.webp?size=96&quality=lossless' })
                .setDescription(`- Olá *${user.username}*, vimos que seu pagamento foi confirmado com sucesso! Agora, siga os passos abaixo para concluir a entrega. Agradecemos por comprar conosco!`).setColor('#5865F2')
                .addFields(
                    { name: `Passo 1`, value: `Clique no botão adicionar BOT e adicione o bot ao servidor` },
                    { name: `Passo 2`, value: `Clique no botão: Realizar Pedidos e siga as instruções` },

                )


            let button2 = new ButtonBuilder()
                .setStyle(2)
                .setLabel('Realizar Pedidos')
                .setCustomId('realizarpedidos')
                .setEmoji('<:1132eventadd:1249382012872298496>')

            let button22 = new ButtonBuilder()
                .setStyle(5)
                .setLabel('Adicionar BOT')
                .setEmoji(`<:1906add1:1249382014268866611>`)
                .setURL(`https://discord.com/oauth2/authorize?client_id=${data.infos.idbot}&scope=bot%20applications.commands&permissions=278032280691`)

            let actionRow = new ActionRowBuilder()
                .addComponents(button2, button22)


            let msg = await channel.send({ content: `<@!${user.id}>`, embeds: [embed], components: [actionRow] })

           
            client.db.carrinhos.set(`${filteredCarts[element].ID}.status`, `Aprovado`)




        }



    }


}

module.exports = Checkout;