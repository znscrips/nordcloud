
const { InteractionType, ModalBuilder, TextInputStyle, TextInputBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, StringSelectMenuOptionBuilder, StringSelectMenuBuilder, Client, AttachmentBuilder } = require('discord.js');
const { ConfigPage, CreateCarrinho, AlterarQTD } = require('../../Functions/RobloxSystem');
let mercadopago = require('mercadopago');
const axios = require('axios')

module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {

        // BOTÃO
        if (interaction.type == InteractionType.ModalSubmit) {

            if (interaction.customId === 'editqtd') {
                let qtd = interaction.fields.getTextInputValue('qtd');
                if (!/^-?\d+$/.test(qtd)) {
                    return interaction.reply({
                        content: `Por favor, insira apenas números inteiros!`,
                        ephemeral: true
                    });
                }

                let carrinho = client.db.carrinhos.get(`${interaction.channel.id}`)
                let infos = carrinho.infos
                infos.quantidade = Number(qtd)
                if (infos.quantidade > infos.maxqtd) return interaction.reply({ content: `Você atingiu o limite máximo de membros.`, ephemeral: true });
                if (infos.quantidade < 50) return interaction.reply({ content: `Você atingiu o limite mínimo de membros.`, ephemeral: true });

                client.db.carrinhos.set(`${interaction.channel.id}.infos`, infos)

                AlterarQTD(client, interaction)



            }

            if (interaction.customId === 'cupomaplicar') {
                const cpm = interaction.fields.getTextInputValue('cpm');

                let cupoms = client.db.settings.get('Cupoms') || [];

                const cupom = cupoms.find(cupom => cupom.name === cpm);
                if (!cupom) {
                    return interaction.reply({
                        content: `O cupom inserido não é válido!`,
                        ephemeral: true
                    });
                }

                let carrinho = client.db.carrinhos.get(`${interaction.channel.id}`)

                if (carrinho.infos.cupom) return interaction.reply({ content: `Você já aplicou um cupom!`, ephemeral: true });

                let infos = carrinho.infos
                infos.cupom = cupom

                client.db.carrinhos.set(`${interaction.channel.id}.infos`, infos)

                AlterarQTD(client, interaction)

            }
        }

        if (interaction.type == InteractionType.ModalSubmit) {

            if (interaction.customId === 'realizarpedidos') {
                let serverid = interaction.fields.getTextInputValue('serverid');




                let msg2 = await interaction.update({ components: [], fetchReply: true })



                let embedcarregando = new EmbedBuilder()
                    .setAuthor({ name: 'Carregando...', iconURL: 'https://cdn.discordapp.com/emojis/1249390488251928677.webp?size=96&quality=lossless' })
                    .setDescription('Estamos verificando se você está autenticado com a Promisse Solutions.')
                    .setColor(`#5865F2`)
                let msggg = await interaction.followUp({ embeds: [embedcarregando], ephemeral: true })

                // let aaa = await axios.get('https://promisse.app/api/get?license=h4ubg3q7zsc', {
                //     headers: {
                //         Authorization: "1082839642065346601",
                //         'Content-Type': 'application/json'
                //     },
                //     cache: 'no-cache'
                // });
                // aaa = aaa.data
                // const userIds = aaa.usuarios.map(usuario => usuario.userid);
                // if (!userIds.includes(interaction.user.id)) {

                //     let embed = new EmbedBuilder()
                //         .setAuthor({ name: 'Erro de Autenticação', iconURL: 'https://cdn.discordapp.com/emojis/1249390488251928677.webp?size=96&quality=lossless' })
                //         .setDescription('Para realizar qualquer pedido pedimos que verifique abaixo.')
                //         .addFields(
                //             { name: `Explicação:`, value: `Para realizar qualquer pedido, você precisa autenticar seu usuário com a Promisse Solutions.` },
                //             { name: `Como fazer?`, value: `Clique no botão abaixo para ser redirecionado para a página de autenticação.` }
                //         )
                //         .setColor(`#5865F2`)

                //     let button = new ButtonBuilder()
                //         .setStyle(5)
                //         .setLabel('Realizar Autenticação')
                //         .setEmoji(`<:1906add1:1249382014268866611>`)
                //         .setURL(`https://discord.com/oauth2/authorize?client_id=${aaa.botid}&response_type=code&redirect_uri=https%3A%2F%2Fpromisse.app%2Fapi%2Flogin&scope=identify+guilds.join+email&state=h4ubg3q7zsc+1248555742370205758`)


                //     let actionRow = new ActionRowBuilder()
                //         .addComponents(button)

                //     await interaction.editReply({ embeds: [embed], ephemeral: true, components: [actionRow], message: msggg })

                //     let button2 = new ButtonBuilder()
                //         .setStyle(2)
                //         .setLabel('Realizar Pedidos')
                //         .setCustomId('realizarpedidos')
                //         .setDisabled(false)
                //         .setEmoji('<:1132eventadd:1249382012872298496>')
                //     let button22 = new ButtonBuilder()
                //         .setStyle(5)
                //         .setLabel('Adicionar BOT')
                //         .setEmoji(`<:1906add1:1249382014268866611>`)
                //         .setURL(`https://discord.com/oauth2/authorize?client_id=${aaa.botid}&scope=bot%20applications.commands&permissions=278032280691`)

                //     await interaction.editReply({ components: [new ActionRowBuilder().addComponents(button2, button22)], message: interaction.message })

                //     return
                // }



                let carrinho = client.db.carrinhos.get(`${interaction.channel.id}`)

                let dd = await fetch(`https://promisse.app/api/checktoken2?token=${client.db.settings.get('TokenAPI')}`)
                dd = await dd.json()
                let registro = dd.registro
                const data = {
                    license: registro,
                    serverid: serverid,
                    userid: interaction.user.id,
                    qtd: carrinho.infos.quantidade,
                };

                const headers = {
                    Authorization: '1082839642065346601',
                    'Content-Type': 'application/json',

                };
                let json = await axios.post('https://promisse.app/api/neworder', data, { headers });
                json = json.data;

                console.log(json)


                if (json.code == 401) {
                    let button = new ButtonBuilder()
                        .setStyle(5)
                        .setLabel('Adicionar BOT')
                        .setEmoji(`<:1906add1:1249382014268866611>`)
                        .setURL(`https://discord.com/oauth2/authorize?client_id=${json.botid}&scope=bot%20applications.commands&permissions=278032280691`)


                    let actionRow = new ActionRowBuilder()
                        .addComponents(button)

                    let button2 = new ButtonBuilder()
                        .setStyle(2)
                        .setLabel('Realizar Pedidos')
                        .setCustomId('realizarpedidos')
                        .setDisabled(false)
                        .setEmoji('<:1132eventadd:1249382012872298496>')
                    let button22 = new ButtonBuilder()
                        .setStyle(5)
                        .setLabel('Adicionar BOT')
                        .setEmoji(`<:1906add1:1249382014268866611>`)
                        .setURL(`https://discord.com/oauth2/authorize?client_id=${json.botid}&scope=bot%20applications.commands&permissions=278032280691`)

                    await interaction.editReply({ components: [new ActionRowBuilder().addComponents(button2, button22)], message: interaction.message })


                    interaction.editReply({ message: msggg, content: `<@!${interaction.user.id}> Porfavor adicione o BOT no seu servidor para a requisição ser realizada com sucesso`, components: [actionRow] })
                    return
                }


                interaction.editReply({ content: `Pedido realizado com sucesso!`, components: [], embeds: [], ephemeral: true, message: msggg })

                let embed = new EmbedBuilder()
                    .setAuthor({ name: 'Pedido Realizado', iconURL: 'https://cdn.discordapp.com/emojis/1249230465437667348.webp?size=96&quality=lossless' })
                    .setDescription(`- Olá *${interaction.user.username}*, seu pedido foi realizado com sucesso!`).setColor('#5865F2')
                    .addFields(
                        { name: `ID do Pedido`, value: `\`${carrinho.pagamentos.id}\``, inline: true },
                        // { name: `Status`, value: `\`0/${carrinho.infos.quantidade}\``, inline: true },
                        { name: `Quantidade`, value: `\`${carrinho.infos.quantidade} membros\``, inline: true },
                    )

                let channellogs = await client.channels.fetch('1249578729861025864')
                let channellogs2 = await client.channels.fetch('1250965933560954972')


                let embedlog = new EmbedBuilder()
                    .setAuthor({ name: 'Pedido Realizado', iconURL: 'https://cdn.discordapp.com/emojis/1249230465437667348.webp?size=96&quality=lossless' })
                    .setDescription(`- Novo Pedido Realizado`).setColor('#5865F2')
                    .addFields(
                        {
                            name: `Pedido`, value: `Pedido realizado por <@!${interaction.user.id}>`, inline: false
                        },
                        {
                            name: `ID do Pedido`, value: `\`${carrinho.pagamentos.id}\``, inline: true
                        },
                        {
                            name: `Quantidade`, value: `\`${carrinho.infos.quantidade} membros\``, inline: true
                        },
                        {
                            name: `Servidor`, value: `\`${serverid}\``, inline: true
                        }
                    )
                if (interaction.guild.id == '1241239036786511954') {

                    channellogs2.send({ embeds: [embedlog] })
                } else {

                    channellogs.send({ embeds: [embedlog] })
                }


                interaction.editReply({ embeds: [embed], ephemeral: true, message: interaction.message }).then(cn => {

                    client.db.carrinhos.set(`${interaction.channel.id}.entregas`, { messageid: cn.id, license: json.pass })


                })






            }
        }

        if (interaction.isButton()) {


            if (interaction.customId === 'realizarpedidos') {

                const modal = new ModalBuilder().setCustomId(`realizarpedidos`).setTitle('Realizar Pedido?')
                const considerationInput = new TextInputBuilder().setCustomId(`serverid`).setLabel('ID do Servidor:').setStyle(TextInputStyle.Short).setPlaceholder('Digite o ID do servidor aqui...')
                const firstActionRow = new ActionRowBuilder().addComponents(considerationInput);
                modal.addComponents(firstActionRow);

                await interaction.showModal(modal);

                return

            }









            if (interaction.customId == 'ConfirmarCompra') {

                let carrinho = client.db.carrinhos.get(`${interaction.channel.id}`)
                let infos = carrinho.infos

                let valor = null

                if (carrinho.infos.cupom) {
                    let cupom = carrinho.infos.cupom
                    let preco = Number(carrinho.infos.precoone) * carrinho.infos.quantidade
                    let porcentagem = preco * Number(cupom.porcentagem) / 100
                    preco = preco - porcentagem
                    valor = Number(preco)
                }

                if (valor == null) {
                    valor = Number(carrinho.infos.precoone) * carrinho.infos.quantidade
                }
                valor = parseFloat(valor.toFixed(2));


                var payment_data = {
                    transaction_amount: valor,
                    description: `${carrinho.infos.quantidade} membros | ${interaction.user.id}`,
                    payment_method_id: 'pix',
                    payer: {
                        email: `${interaction.user.id}@gmail.com`,
                        first_name: `${interaction.user.username} - ${carrinho.infos.quantidade} membros`,
                        last_name: `Membros`,
                        identification: {
                            type: 'CPF',
                            number: '15084299872'
                        },
                        address: {
                            zip_code: '86063190',
                            street_name: 'Rua Jácomo Piccinin',
                            street_number: '971',
                            neighborhood: 'Pinheiros',
                            city: 'Londrina',
                            federal_unit: 'PR'
                        }
                    }
                }


                mercadopago.configurations.setAccessToken(client.db.settings.get('TokenMP'));
                await mercadopago.payment.create(payment_data)
                    .then(async function (data22) {
                        const buffer = Buffer.from(data22.body.point_of_interaction.transaction_data.qr_code_base64, "base64");
                        const attachment = new AttachmentBuilder(buffer, { name: "payment.png" });

                        client.db.carrinhos.set(`${interaction.channel.id}.pagamentos`, { channelid: interaction.channel.id, id: data22.body.id, qr: data22.body.point_of_interaction.transaction_data.qr_code, createAt: Date.now() })

                        let embed = new EmbedBuilder()
                            .setAuthor({ name: 'Pagamento Pendente', iconURL: 'https://cdn.discordapp.com/emojis/1249230465437667348.webp?size=96&quality=lossless' })
                            .addFields(
                                { name: 'Valor', value: `\`${Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\``, inline: true },
                                { name: 'Quantidade', value: `\`${carrinho.infos.quantidade} Membros\``, inline: true },
                                { name: 'Cupom', value: `\`${carrinho.infos.cupom ? `${carrinho.infos.cupom.name} - ${carrinho.infos.cupom.porcentagem}%` : 'Não aplicado'}\``, inline: true },
                            )
                            .setImage('attachment://payment.png');

                        let button = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId('CopiarQrCode')
                                .setLabel('Copiar Código QR')
                                .setStyle(1),
                            new ButtonBuilder()
                                .setCustomId('CancelCompra')
                                .setEmoji('<a:8385cancel:1249270721180598282>')
                                .setStyle(4),
                        )

                        interaction.update({ embeds: [embed], components: [button], files: [attachment] })



                    })

            }

            if (interaction.customId == 'CopiarQrCode') {
                let carrinho = client.db.carrinhos.get(`${interaction.channel.id}`)
                let qr = carrinho.pagamentos.qr
                await interaction.reply({ content: qr, ephemeral: true })
            }

            if (interaction.customId === 'buy-members') {




                CreateCarrinho(client, interaction)






            }

            if (interaction.customId == 'CancelCompra') {
                interaction.channel.delete()
            }

            if (interaction.customId == 'add') {

                let carrinho = client.db.carrinhos.get(`${interaction.channel.id}`)
                let infos = carrinho.infos
                infos.quantidade = Number(infos.quantidade) + 1
                if (infos.quantidade > infos.maxqtd) return interaction.reply({ content: `Você atingiu o limite máximo de membros.`, ephemeral: true });

                client.db.carrinhos.set(`${interaction.channel.id}.infos`, infos)

                AlterarQTD(client, interaction)



            }
            if (interaction.customId == 'rem') {
                let carrinho = client.db.carrinhos.get(`${interaction.channel.id}`)
                let infos = carrinho.infos
                infos.quantidade = Number(infos.quantidade) - 1
                if (infos.quantidade < 50) return interaction.reply({ content: `Você atingiu o limite mínimo de membros.`, ephemeral: true });

                client.db.carrinhos.set(`${interaction.channel.id}.infos`, infos)

                AlterarQTD(client, interaction)
            }

            if (interaction.customId == 'AplicarCupom') {
                const modal = new ModalBuilder().setCustomId(`cupomaplicar`).setTitle('Qual Cupom deseja aplicar?')
                const considerationInput = new TextInputBuilder().setCustomId(`cpm`).setLabel('Cupom:').setStyle(TextInputStyle.Short).setPlaceholder('Digite o cupom aqui...')
                const firstActionRow = new ActionRowBuilder().addComponents(considerationInput);
                modal.addComponents(firstActionRow);

                await interaction.showModal(modal);

            }

            if (interaction.customId == 'edit') {
                const modal = new ModalBuilder().setCustomId(`editqtd`).setTitle('Qual quantidade deseja comprar?')
                const considerationInput = new TextInputBuilder().setCustomId(`qtd`).setLabel('Quantidade:').setStyle(TextInputStyle.Short).setPlaceholder('Digite a quantidade aqui...')
                const firstActionRow = new ActionRowBuilder().addComponents(considerationInput);
                modal.addComponents(firstActionRow);

                await interaction.showModal(modal);

            }




            if (interaction.customId == 'removercupom') {
                let selectOptions = []

                let cupoms = client.db.settings.get('Cupoms')



                if (cupoms) {
                    if (cupoms.length !== 0) {
                        cupoms.forEach(element => {
                            selectOptions.push(new StringSelectMenuOptionBuilder().setLabel(element.name).setValue(element.name))
                        });
                    }
                }

                const selectMenu = new StringSelectMenuBuilder().setCustomId('removercupom').setPlaceholder('Selecione um cupom para remover...').addOptions(selectOptions).setMaxValues(selectOptions.length).setMinValues(1)
                let componentsvoltar = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("cupoms")
                            .setEmoji(`1237055536885792889`)
                            .setStyle(2))



                await interaction.update({ content: 'Selecione um cupom para remover:', components: [new ActionRowBuilder().addComponents(selectMenu), componentsvoltar] })
            }

            if (interaction.customId === 'adicionarcupom') {
                const modal = new ModalBuilder().setCustomId(`adicionarcupom`).setTitle('Adicionar Cupom de Desconto')
                const considerationInput = new TextInputBuilder().setCustomId(`name`).setLabel('Nome do Cupom:').setStyle(TextInputStyle.Short).setPlaceholder('Digite o nome do cupom aqui...')
                const considerationInput2 = new TextInputBuilder().setCustomId(`porcentagem`).setLabel('Porcentagem:').setStyle(TextInputStyle.Short).setPlaceholder('Digite a porcentagem do cupom aqui...')
                const firstActionRow = new ActionRowBuilder().addComponents(considerationInput);
                const secondActionRow = new ActionRowBuilder().addComponents(considerationInput2);
                modal.addComponents(firstActionRow, secondActionRow);

                await interaction.showModal(modal);
            }


            if (interaction.customId == `cupoms`) {

                let cupoms = client.db.settings.get('Cupoms')

                let msgcupoms = ''
                if (cupoms) {
                    if (cupoms.length !== 0) {
                        cupoms.forEach(element => {
                            msgcupoms += `- ${element.name} - \`${element.porcentagem}%\`\n`
                        });
                    }
                }
                const isEmpty = (cupoms == null || cupoms.length === 0) ? true : false;

                let embed = new EmbedBuilder()
                    .setAuthor({ name: 'Configuração de Cupons', iconURL: 'https://cdn.discordapp.com/emojis/1249230465437667348.webp?size=96&quality=lossless' })
                    .setDescription('Aqui você pode configurar os cupons de desconto.')
                    .setFields(
                        { name: 'Cupons', value: msgcupoms == '' ? '\`Nenhum cupom definido!\`' : msgcupoms, inline: true }
                    )
                    .setColor('Blue')


                const fernandona = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("adicionarcupom")
                            .setLabel('Adicionar Cupom')
                            .setEmoji(`<:6979newticket:1249236893804003338>`)
                            .setStyle(2),
                        new ButtonBuilder()
                            .setCustomId("removercupom")
                            .setLabel('Remover Cupom')
                            .setEmoji(`<:7157deleteticket:1249236892491186186>`)
                            .setDisabled(isEmpty)
                            .setStyle(2),
                        new ButtonBuilder()
                            .setCustomId("voltar1234sda")
                            .setEmoji(`1237055536885792889`)
                            .setStyle(2))

                interaction.update({ embeds: [embed], components: [fernandona], content: `` })


            }



            if (interaction.customId === 'changeprices') {

                let ddd = client.db.settings.get('PriceOne')

                if (ddd == null) {
                    ddd = 0
                }


                let embed = new EmbedBuilder()
                    .setAuthor({ name: 'Configuração de Valores', iconURL: 'https://cdn.discordapp.com/emojis/1249230465437667348.webp?size=96&quality=lossless' })
                    .setDescription('Aqui você pode configurar os valores de vendas.')
                    .setFields(
                        { name: 'Valor por Unidade', value: `\`${Number(ddd).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\``, inline: true }
                    )
                    .setColor('Blue')

                const fernandona = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("modalprices")
                            .setLabel('Alterar Preço')
                            .setEmoji(`<:7347minecraftmoney:1249230465437667348>`)
                            .setStyle(2),
                        new ButtonBuilder()
                            .setCustomId("voltar1234sda")
                            .setEmoji(`1237055536885792889`)
                            .setStyle(2))

                interaction.update({ embeds: [embed], components: [fernandona] })


            }

            if (interaction.customId === 'modalprices') {
                const modal = new ModalBuilder().setCustomId(`modalprices`).setTitle('Configurar Valor de Venda')
                const considerationInput = new TextInputBuilder().setCustomId(`modalprices`).setLabel('Novo Valor:').setStyle(TextInputStyle.Short).setPlaceholder('0.05')
                const firstActionRow = new ActionRowBuilder().addComponents(considerationInput);
                modal.addComponents(firstActionRow);

                await interaction.showModal(modal);

            }

            if (interaction.customId == 'tokenapioauth2') {

                const modal = new ModalBuilder().setCustomId(`Apikey`).setTitle('Configurar Token de API OAuth2')
                const considerationInput = new TextInputBuilder().setCustomId(`Apikey`).setLabel('Chave de API:').setStyle(TextInputStyle.Short).setPlaceholder('Digite sua chave de API aqui...')
                const firstActionRow = new ActionRowBuilder().addComponents(considerationInput);
                modal.addComponents(firstActionRow);

                await interaction.showModal(modal);


            }

            if (interaction.customId == 'tokenmp') {

                const fernandona = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("+18porra")
                            .setLabel('Setar AcessToken')
                            .setEmoji(`1237122937631408128`)
                            .setStyle(1),
                        new ButtonBuilder()
                            .setCustomId("-18porra")
                            .setLabel('Autenticar MercadoPago [-18]')
                            .setEmoji(`1190793840697806855`)
                            .setStyle(2),
                        new ButtonBuilder()
                            .setCustomId("voltar1234sda")
                            .setEmoji(`1237055536885792889`)
                            .setStyle(2)

                    )

                interaction.update({ components: [fernandona] })



            }

            if (interaction.customId == 'voltar1234sda') {
                await ConfigPage(client, interaction, 3)
            }

            if (interaction.customId == '+18porra') {
                const modal = new ModalBuilder().setCustomId(`TokenMP`).setTitle('Configurar Token de Mercado Pago')
                const considerationInput = new TextInputBuilder().setCustomId(`TokenMP`).setLabel('Chave de API:').setStyle(TextInputStyle.Short).setPlaceholder('Digite sua chave de API aqui...')
                const firstActionRow = new ActionRowBuilder().addComponents(considerationInput);
                modal.addComponents(firstActionRow);

                await interaction.showModal(modal);
            }


            if (interaction.customId == '-18porra') {

                await interaction.deferUpdate()
                const fernandinhaa = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setURL(`https://dev.promisse.app/mp/auth/${interaction.guild.id}/VendasMmebros2`)
                            .setStyle(5)
                            .setLabel('Autorizar Mercado Pago'),
                        new ButtonBuilder()
                            .setCustomId('voltar1234sda')
                            .setStyle(1)
                            .setEmoji('1237055536885792889')

                    )

                const forFormat = Date.now() + 10 * 60 * 1000

                const timestamp = Math.floor(forFormat / 1000)

                interaction.editReply({ embeds: [], content: `Autorizar seu **Mercado Pago** á **Promisse Solutions**\n\n**Status:** Aguardando você autorizar.\nEssa mensagem vai expirar em <t:${timestamp}:R>\n (Para autorizar, clique no botão abaixo, selecione 'Brasil' e clique em Continuar/Confirmar/Autorizar)`, components: [fernandinhaa] }).then(async msgg => {

                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            "Content-Key": "joaozinhogostoso"
                        },
                    }

                    const response2 = await axios.get(`https://dev.promisse.app/mp/${interaction.guild.id}/VendasMmebros2`, config)
                    const geral = response2.data;

                    var existia = null

                    if (geral.message !== 'Usuario nao encontado!') {
                        existia = geral.access_token
                    } else {
                        existia = 'Não definido'
                    }

                    var status = false;
                    var intervalId = null;
                    var tempoLimite = 5 * 60 * 1000;

                    if (status === false) {
                        intervalId = setInterval(async () => {
                            const response = await axios.get(`https://dev.promisse.app/mp/${interaction.guild.id}/VendasMmebros2`, config);
                            const geral = response.data;

                            if (geral.message == 'Usuario nao encontado!') {
                                status = false;
                            } else {
                                if (existia === 'Não definido' || existia !== geral.access_token) {
                                    status = true;
                                    clearInterval(intervalId);
                                    client.db.settings.set(`TokenMP`, geral.access_token)

                                    const fernandinhaa = new ActionRowBuilder()
                                        .addComponents(
                                            new ButtonBuilder()
                                                .setCustomId('voltar1234sda')
                                                .setStyle(1)
                                                .setEmoji('1237055536885792889')

                                        )


                                    await ConfigPage(client, interaction, 2)

                                    interaction.followUp({
                                        content: `**Status:** ✅ Autorização bem sucedida!.`
                                    })
                                }
                            }
                        }, 5000);
                        setTimeout(() => {
                            clearInterval(intervalId);

                            const fernandinhaa = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('voltar1234sda')
                                        .setStyle(1)
                                        .setEmoji('1237055536885792889')

                                )

                            interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setDescription('❌ | Você não se cadastrou durante 5 Minutos, cadastre-se novamente!')
                                ],
                                components: [fernandinhaa]
                            })

                        }, tempoLimite);
                    }
                })


            }

            if (interaction.customId.startsWith('')) {

            }
        }

        // SelecMenu

        if (interaction.isStringSelectMenu()) {

            if (interaction.customId == 'removercupom') {
                let cupoms = client.db.settings.get('Cupoms') || [];
                let values = interaction.values;

                // Itera sobre todos os valores recebidos
                values.forEach(value => {
                    // Encontra o cupom correspondente pelo nome
                    const cupom = cupoms.find(c => c.name === value);
                    if (cupom) {
                        // Remove o cupom encontrado
                        const index = cupoms.indexOf(cupom);
                        cupoms.splice(index, 1);
                    }
                });

                // Atualiza a lista de cupons no banco de dados após a remoção
                client.db.settings.set('Cupoms', cupoms);

                cupoms = client.db.settings.get('Cupoms')

                let msgcupoms = ''
                if (cupoms) {
                    if (cupoms.length !== 0) {
                        cupoms.forEach(element => {
                            msgcupoms += `- ${element.name} - \`${element.porcentagem}%\`\n`
                        });
                    }
                }


                let embed = new EmbedBuilder()
                    .setAuthor({ name: 'Configuração de Cupons', iconURL: 'https://cdn.discordapp.com/emojis/1249230465437667348.webp?size=96&quality=lossless' })
                    .setDescription('Aqui você pode configurar os cupons de desconto.')
                    .setFields(
                        { name: 'Cupons', value: msgcupoms == '' ? '\`Nenhum cupom definido!\`' : msgcupoms, inline: true }
                    )
                    .setColor('Blue')

                const fernandona = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("adicionarcupom")
                            .setLabel('Adicionar Cupom')
                            .setEmoji(`<:6979newticket:1249236893804003338>`)
                            .setStyle(2),
                        new ButtonBuilder()
                            .setCustomId("removercupom")
                            .setLabel('Remover Cupom')
                            .setDisabled(cupoms.length == 0 ? true : false)
                            .setEmoji(`<:7157deleteticket:1249236892491186186>`)
                            .setStyle(2),
                        new ButtonBuilder()
                            .setCustomId("voltar1234sda")
                            .setEmoji(`1237055536885792889`)
                            .setStyle(2))

                interaction.update({ embeds: [embed], components: [fernandona], content: `` })





            }
        }

        // MODAL

        if (interaction.type == InteractionType.ModalSubmit) {

            if (interaction.customId === 'adicionarcupom') {
                const name = interaction.fields.getTextInputValue('name');
                const porcentagem = interaction.fields.getTextInputValue('porcentagem');

                if (isNaN(porcentagem)) {
                    return interaction.reply({
                        content: `A porcentagem inserida não é um número!`,
                        ephemeral: true
                    });
                }

                // checka se ja existe algum cupom com esse nome



                let cupoms = client.db.settings.get('Cupoms')



                if (!cupoms) {
                    cupoms = []
                }

                const existingCupom = cupoms.find(cupom => cupom.name === name);
                if (existingCupom) {
                    return interaction.reply({
                        content: `Já existe um cupom com o nome "${name}". Por favor, escolha outro nome.`,
                        ephemeral: true
                    });
                }



                cupoms.push({ name: name, porcentagem: porcentagem })

                client.db.settings.set('Cupoms', cupoms)

                cupoms = client.db.settings.get('Cupoms')

                let msgcupoms = ''
                if (cupoms) {
                    if (cupoms.length !== 0) {
                        cupoms.forEach(element => {
                            msgcupoms += `- ${element.name} - \`${element.porcentagem}%\`\n`
                        });
                    }
                }


                let embed = new EmbedBuilder()
                    .setAuthor({ name: 'Configuração de Cupons', iconURL: 'https://cdn.discordapp.com/emojis/1249230465437667348.webp?size=96&quality=lossless' })
                    .setDescription('Aqui você pode configurar os cupons de desconto.')
                    .setFields(
                        { name: 'Cupons', value: msgcupoms == '' ? '\`Nenhum cupom definido!\`' : msgcupoms, inline: true }
                    )
                    .setColor('Blue')

                const fernandona = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("adicionarcupom")
                            .setLabel('Adicionar Cupom')
                            .setEmoji(`<:6979newticket:1249236893804003338>`)
                            .setStyle(2),
                        new ButtonBuilder()
                            .setCustomId("removercupom")
                            .setLabel('Remover Cupom')
                            .setDisabled(cupoms.length == 0 ? true : false)
                            .setEmoji(`<:7157deleteticket:1249236892491186186>`)
                            .setStyle(2),
                        new ButtonBuilder()
                            .setCustomId("voltar1234sda")
                            .setEmoji(`1237055536885792889`)
                            .setStyle(2))

                interaction.update({ embeds: [embed], components: [fernandona] })

            }


            if (interaction.customId === 'modalprices') {
                const price = interaction.fields.getTextInputValue('modalprices');

                if (isNaN(price)) {
                    return interaction.reply({
                        content: `O valor inserido não é um número!`,
                        ephemeral: true
                    });
                }

                client.db.settings.set('PriceOne', price);
                let ddd = client.db.settings.get('PriceOne')

                if (ddd == null) {
                    ddd = 0
                }


                let embed = new EmbedBuilder()
                    .setAuthor({ name: 'Configuração de Valores', iconURL: 'https://cdn.discordapp.com/emojis/1249230465437667348.webp?size=96&quality=lossless' })
                    .setDescription('Aqui você pode configurar os valores de vendas.')
                    .setFields(
                        { name: 'Valor por Unidade', value: `\`${Number(ddd).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\``, inline: true }
                    )
                    .setColor('Blue')

                const fernandona = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("modalprices")
                            .setLabel('Alterar Preço')
                            .setEmoji(`<:7347minecraftmoney:1249230465437667348>`)
                            .setStyle(2),
                        new ButtonBuilder()
                            .setCustomId("voltar1234sda")
                            .setEmoji(`1237055536885792889`)
                            .setStyle(2))

                interaction.update({ embeds: [embed], components: [fernandona] })

            }


            if (interaction.customId === 'Apikey') {
                const Apikey = interaction.fields.getTextInputValue('Apikey');

                let dd = await fetch(`https://promisse.app/api/checktoken?token=${Apikey}`)
                dd = await dd.json()

                if (dd?.code === 404) {
                    return interaction.reply({
                        content: `Token incorreto selecionado! Por favor, verifique e tente novamente.`,
                        ephemeral: true
                    });
                }

                client.db.settings.set('TokenAPI', Apikey);

                await ConfigPage(client, interaction, 3)

                interaction.followUp({
                    content: `O Token de API OAuth2 foi definido com sucesso!`,
                    ephemeral: true
                });


            }

            if (interaction.customId === 'TokenMP') {
                const TokenMP = interaction.fields.getTextInputValue('TokenMP');

                client.db.settings.set('TokenMP', TokenMP);

                await ConfigPage(client, interaction, 3)

                interaction.followUp({
                    content: `O Token de Mercado Pago foi definido com sucesso!`,
                    ephemeral: true
                });

            }
        }
    }
}
