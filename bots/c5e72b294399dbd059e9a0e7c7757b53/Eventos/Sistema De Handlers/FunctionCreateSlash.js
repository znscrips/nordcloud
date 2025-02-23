
module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {
        if (interaction.isChatInputCommand()) {

            const cmd = client.slashCommands.get(interaction.commandName);

            if (!cmd) return interaction.reply({content: `Ocorreu algum erro amigo.`, ephemeral: true});

            if (interaction.guild) {
                interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);
            }

            if(cmd.exclusive) {
                if(interaction.user.id !== '852603072026247220'){
                    interaction.reply({content: `Este comando é exclusivo da Promisse.`, ephemeral: true});
					return
                }
			
            }

            cmd.run(client, interaction)

        }
    }
}