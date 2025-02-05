import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('kick')
    .setDescription('kick a member')
    .addUserOption(option => option
        .setName('target')
        .setDescription('Member to ban')
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName('reason')
        .setDescription('The reason of ban')
    );

export async function execute(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    const targetMember = interaction.options.getUser('target');
    const guild = interaction.guild;
    let reasonBan = interaction.options.getString('reason');

    if (!targetMember || !guild) return;

    if (!reasonBan) {
        reasonBan = "No reason";
    }

    await guild.members.kick(targetMember, reasonBan);
    await interaction.reply(`${targetMember.displayName} has been banned (${reasonBan})`);
}
