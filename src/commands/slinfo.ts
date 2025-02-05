import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, Colors } from 'discord.js';
import config from '../../config/config.json';

export const data = new SlashCommandBuilder()
    .setName('slinfo')
    .setDescription('Get SCP:SL server info');

export async function execute(interaction: CommandInteraction) {
    let online_emoji: string;
    const response = await fetch(`https://api.scplist.kr/api/servers/${config.slServerId}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
    });

    const data = await response.json();

    const isOnline: boolean | null = data['online']
    const players: number | null   = data['players']

    if (isOnline === null || !players) {
        return;
    }

    if (isOnline) {
        online_emoji = "🟢";
    }
    else {
        online_emoji = "🔴";
    }

    const embed = new EmbedBuilder()
        .setTitle('Server Info')
        .setColor(Colors.Blue)
        .addFields(
            { name: 'Online', value: online_emoji, inline: false },
            { name: 'Players', value: players.toString(), inline: false }
        )
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
