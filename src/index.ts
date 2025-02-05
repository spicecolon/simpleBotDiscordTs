import { Client, Collection, Colors, EmbedBuilder, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
import config from '../config/config.json';
import { commands } from './commands';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

(client as any).commands = new Collection();

//
// Update slash commands
//

const commandsData = Object.values(commands).map(command => command.data.toJSON());

const rest = new REST().setToken(config.token);

(async ()=> {
    await rest.put(
        Routes.applicationCommands(config.applicationId),
        {
            body: commandsData
        }
    )
})();

//
// Events
//

client.once(Events.ClientReady, _readyClient => {
    console.log('Bot online!');
}); 

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) {
        return;
    }
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
    }
});

client.on(Events.GuildBanAdd, async ban => {
    const embed = new EmbedBuilder()
        .setTitle(`${ban.user.displayName} has been banned`)
        .setDescription(`The user has been banned from **${ban.guild.name}**`)
        .setColor(Colors.Red)
        .setTimestamp();

    ban.guild.channels.fetch(config.logChatId).then(channel => {
        if (channel) {
            if (channel.isSendable()) {
                channel.send({ embeds: [embed] })
            }
        }
    });
});

client.on(Events.GuildMemberRemove, async kick => {
    const embed = new EmbedBuilder()
        .setTitle(`${kick.user.displayName} has been kicked/removed`)
        .setDescription(`The user has been removed from **${kick.guild.name}**`)
        .setColor(Colors.Red)
        .setTimestamp();

    kick.guild.channels.fetch(config.logChatId).then(channel => {
        if (channel) {
            if (channel.isSendable()) {
                channel.send({ embeds: [embed] })
            }
        }
    });
});

client.login(config.token);
