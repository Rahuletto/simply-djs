const Discord = require('discord.js')

/**
 * @param {Discord.Client} client 
 * @param {Discord.CommandInteraction} message 
 * @param {Discord.MessageEmbed[]} pages 
 * @param {import('../index').embedPagesOptions} style 
 */
async function embedPages(client, message, pages, style = []) {

    let { MessageButton, MessageActionRow } = require('discord.js')
try{
    if(style.slash === true){
        if (!pages) throw new Error("PAGES_NOT_FOUND. You didnt specify any pages to me. See Examples to clarify your doubts. https://github.com/Rahuletto/simply-djs/blob/main/Examples/embedPages.md")
        if (!client) throw new Error("client not specified. See Examples to clarify your doubts. https://github.com/Rahuletto/simply-djs/blob/main/Examples/embedPages.md")
    
        if (style.skipBtn == true) {
            const firstbtn = new MessageButton()
                .setCustomId(`first_embed`)
    
                .setEmoji(style.firstEmoji || "⏪")
                .setStyle(style.skipcolor || 'PRIMARY')
    
            const pageMovingButtons1 = new MessageButton()
                .setCustomId(`forward_button_embed`)
    
                .setEmoji(style.forwardEmoji || "▶️")
                .setStyle(style.btncolor || 'SUCCESS')
    
            const deleteBtn = new MessageButton()
                .setCustomId(`delete_embed`)
    
                .setEmoji(style.delEmoji || "🗑️")
                .setStyle('DANGER')
    
            const pageMovingButtons2 = new MessageButton()
                .setCustomId(`back_button_embed`)
    
                .setEmoji(style.backEmoji || "◀️")
                .setStyle(style.btncolor || 'SUCCESS')
    
            const lastbtn = new MessageButton()
                .setCustomId(`last_embed`)
    
                .setEmoji(style.lastEmoji || "⏩")
                .setStyle(style.skipcolor || 'PRIMARY')
    
            pageMovingButtons = new MessageActionRow()
                .addComponents([firstbtn, pageMovingButtons2, deleteBtn, pageMovingButtons1, lastbtn])
    
        } else {
            const pageMovingButtons1 = new MessageButton()
                .setCustomId(`forward_button_embed`)
    
                .setEmoji(style.forwardEmoji || "▶️")
                .setStyle(style.btncolor || 'SUCCESS')
    
            const deleteBtn = new MessageButton()
                .setCustomId(`delete_embed`)
    
                .setEmoji(style.delEmoji || "🗑️")
                .setStyle('DANGER')
    
            const pageMovingButtons2 = new MessageButton()
                .setCustomId(`back_button_embed`)
    
                .setEmoji(style.backEmoji || "◀️")
                .setStyle(style.btncolor || 'SUCCESS')
    
            pageMovingButtons = new MessageActionRow()
                .addComponents([pageMovingButtons2, deleteBtn, pageMovingButtons1])
        }
    
        var currentPage = 0;
        await message.followUp({ embeds: [pages[0]], components: [pageMovingButtons] });
        let m = await message.fetchReply()
        client.on('interactionCreate', async b => {
    
            if (!b.isButton()) return;
        if(b.user.id !== message.user.id) return b.reply({content: 'You cant change the pages of that embed..'})
            if (b.message.id == m.id && b.user.id == message.user.id) {
                if (b.customId == "back_button_embed") {
                    if (currentPage - 1 < 0) {
                        currentPage = pages.length - 1
                    } else {
                        currentPage -= 1;
                    }
                } else if (b.customId == "forward_button_embed") {
                    if (currentPage + 1 == pages.length) {
                        currentPage = 0;
                    } else {
                        currentPage += 1;
                    }
                } else if (b.customId == "delete_embed") {
                    b.message.delete()
                    b.reply({ content: 'Message Deleted', ephemeral: true })
                } else if (b.customId == 'last_embed') {
                    currentPage = pages.length - 1
                } else if (b.customId == 'first_embed') {
                    currentPage = 0;
                }
    
                if (b.customId == 'first_embed' || b.customId == "back_button_embed" || b.customId == "forward_button_embed" || b.customId == 'last_embed') {
                    m.edit({ embeds: [pages[currentPage]], components: [pageMovingButtons] });
                    b.deferUpdate();
                }
            }
            
        })

    } else if(!style.slash || style.slash === false){
    if (!pages) throw new Error("PAGES_NOT_FOUND. You didnt specify any pages to me. See Examples to clarify your doubts. https://github.com/Rahuletto/simply-djs/blob/main/Examples/embedPages.md")
    if (!client) throw new Error("client not specified. See Examples to clarify your doubts. https://github.com/Rahuletto/simply-djs/blob/main/Examples/embedPages.md")

    if (style.skipBtn == true) {
        const firstbtn = new MessageButton()
            .setCustomId(`first_embed`)

            .setEmoji(style.firstEmoji || "⏪")
            .setStyle(style.skipcolor || 'PRIMARY')

        const pageMovingButtons1 = new MessageButton()
            .setCustomId(`forward_button_embed`)

            .setEmoji(style.forwardEmoji || "▶️")
            .setStyle(style.btncolor || 'SUCCESS')

        const deleteBtn = new MessageButton()
            .setCustomId(`delete_embed`)

            .setEmoji(style.delEmoji || "🗑️")
            .setStyle('DANGER')

        const pageMovingButtons2 = new MessageButton()
            .setCustomId(`back_button_embed`)

            .setEmoji(style.backEmoji || "◀️")
            .setStyle(style.btncolor || 'SUCCESS')

        const lastbtn = new MessageButton()
            .setCustomId(`last_embed`)

            .setEmoji(style.lastEmoji || "⏩")
            .setStyle(style.skipcolor || 'PRIMARY')

        pageMovingButtons = new MessageActionRow()
            .addComponents([firstbtn, pageMovingButtons2, deleteBtn, pageMovingButtons1, lastbtn])

    } else {
        const pageMovingButtons1 = new MessageButton()
            .setCustomId(`forward_button_embed`)

            .setEmoji(style.forwardEmoji || "▶️")
            .setStyle(style.btncolor || 'SUCCESS')

        const deleteBtn = new MessageButton()
            .setCustomId(`delete_embed`)

            .setEmoji(style.delEmoji || "🗑️")
            .setStyle('DANGER')

        const pageMovingButtons2 = new MessageButton()
            .setCustomId(`back_button_embed`)

            .setEmoji(style.backEmoji || "◀️")
            .setStyle(style.btncolor || 'SUCCESS')

        pageMovingButtons = new MessageActionRow()
            .addComponents([pageMovingButtons2, deleteBtn, pageMovingButtons1])
    }

    var currentPage = 0;
    var m = await message.channel.send({ embeds: [pages[0]], components: [pageMovingButtons] });
    client.on('interactionCreate', async b => {

        if (!b.isButton()) return;
    if(b.user.id !== message.author.id) return b.reply({content: 'You cant change the pages of that embed..'})
        if (b.message.id == m.id && b.user.id == message.author.id) {
            if (b.customId == "back_button_embed") {
                if (currentPage - 1 < 0) {
                    currentPage = pages.length - 1
                } else {
                    currentPage -= 1;
                }
            } else if (b.customId == "forward_button_embed") {
                if (currentPage + 1 == pages.length) {
                    currentPage = 0;
                } else {
                    currentPage += 1;
                }
            } else if (b.customId == "delete_embed") {
                b.message.delete()
                b.reply({ content: 'Message Deleted', ephemeral: true })
            } else if (b.customId == 'last_embed') {
                currentPage = pages.length - 1
            } else if (b.customId == 'first_embed') {
                currentPage = 0;
            }

            if (b.customId == 'first_embed' || b.customId == "back_button_embed" || b.customId == "forward_button_embed" || b.customId == 'last_embed') {
                m.edit({ embeds: [pages[currentPage]], components: [pageMovingButtons] });
                b.deferUpdate();
            }
        }
        
    })
}
} catch (err) {
    console.log(`Error Occured. | embedPages | Error: ${err.stack}`)
  }

}
module.exports = embedPages;