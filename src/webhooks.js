const Discord = require('discord.js')

async function webhooks(client, options = []) {
    if (!options.chid) throw new Error('EMPTY_CHANNEL_ID. You didnt specify a channel id. Go to https://discord.com/invite/3JzDV9T5Fn to get support');

    if (!options.msg && !options.embed) throw new Error('Cannot send a empty message. Please specify a embed or message. Go to https://discord.com/invite/3JzDV9T5Fn to get support');

    const channel = client.channels.cache.get(options.chid);

    if (!channel) throw new Error('INVALID_CHANNEL_ID. The channel id you specified is not valid (or) I dont have VIEW_CHANNEL permission. Go to https://discord.com/invite/3JzDV9T5Fn to get support');

    try {
        const webhooks = await channel.fetchWebhooks();
            let webhook = webhooks.first();

        if (!webhook) {

            channel.createWebhook(options.username || client.user.username, {
                avatar: options.avatar || client.user.displayAvatarURL(),
            }).then(webhookz => webhook = webhookz)
        }

        if (!options.embed) {
            await webhook.send({
                content: options.msg,
                username: options.username || client.user.username,
                avatarURL: options.avatar || client.user.displayAvatarURL(),
            })
        } else {
            await webhook.send({
                content: options.msg || '‏‏‎ ‎',
                username: options.username || client.user.username,
                avatarURL: options.avatar || client.user.displayAvatarURL(),
                embeds: [options.embed],
            })
        }

    } catch (error) {
        console.error('Error trying to send: ', error);
    }
}
module.exports = webhooks;