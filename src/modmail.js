const Discord = require('discord.js')

async function modmail(client, message, options = []) {
  let { MessageButton, MessageActionRow } = require('discord.js')
try {
  if (options.credit === false) {
    foot = 'Modmail'
  } else {
    foot = '©️ Simply Develop. npm i simply-djs'
  }


  if(message.channel.type === 'DM'){
    if(!options.dmToggle || options.dmToggle === true){
    let guildcol = [];

    if (options.blacklistUser) {
      for (let i = 0; i < options.blacklistUser.length; i++) {
        if (options.blacklistUser[i] === message.author.id) return message.reply('You are blacklisted from creating mod-mails');
      }
    }

    await client.guilds.cache.forEach(async (gu) => {
     let isit = await gu.members.fetch(message.author.id)
     if(isit){
      if(isit.user.id === message.author.id)
      {
        let yikes = {
        label: gu.name,
        value: gu.id,
        description: 'Guild you are in.',
      }

      guildcol.push(yikes)
      }
     } else return;
    })
const { MessageActionRow, MessageSelectMenu } = require('discord.js')
    let slct = new MessageSelectMenu()
    .setMaxValues(1)
    .setCustomId('guildselect')
    .setPlaceholder('What Guild ?')
    .addOptions([
      guildcol
    ])

const row = new MessageActionRow()
.addComponents([slct])

    let embed = new Discord.MessageEmbed()
    .setTitle('What Guild ?')
    .setDescription(`As this command is used in dms.. We dont know what guild you are trying to open the modmail. Please select the guild in the select menu`)
    .setFooter(foot)
    .setColor('#075FFF')

    message.channel.send({ embeds: [embed], components: [row] }).then(async (slct) => {

      let dmTr = slct.createMessageComponentCollector({ type: 'SELECT_MENU', time: 600000 })

      dmTr.on('collect', async menu => {
        let val = menu.values[0]

    menu.deferUpdate()

    let mailname = `modmail_${message.author.id}`

        if(options.blacklistGuild){
          for (let i = 0; i < options.blacklistGuild.length; i++) {
            if (options.blacklistGuild[i] === val) return message.reply('Modmail in that server is currently disabled...');
          }
        }

        let guild = client.guilds.cache.get(val)
        if(!guild) return message.reply('Uhh i think something\'s wrong.. I cannot fetch the guild');
        let antispamo = await guild.channels.cache.find(ch => ch.name === mailname.toLowerCase());

  if(antispamo) return message.reply({ content: 'You already have opened a modmail.. Please close it to continue.'})

  chparent = options.categoryID || null
  let categ = guild.channels.cache.get(options.categoryID)
  if (!categ) { chparent = null }

  guild.channels.create(`modmail_${message.author.id}`, {
    type: "text",
    parent: chparent,
    permissionOverwrites: [
      {
        id: guild.roles.everyone,
        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'] //Deny permissions
      },
    ],
  }).then(async (ch) => {
    let X_btn = new MessageButton()
      .setStyle(options.delColor || 'DANGER')
      .setEmoji(options.delEmoji || '❌')
      .setLabel('Delete')
      .setCustomId('delete_mail')

    let closerow = new MessageActionRow()
      .addComponents([X_btn])

let embedi = new Discord.MessageEmbed()
    .setTitle('Hello 👋')
    .setDescription(`***You have opened a modmail.***\nPlease wait for the *support team* to contact with you.\n***I will react to your message if it is delivered***`)
    .setFooter(foot)
    .setColor('#075FFF')

    message.author.send({ embeds: [embedi] }).then(async mo => {
      let filter = m => m.author.id === message.author.id

      const collector = mo.channel.createMessageCollector({ filter, time: 600000 });

      collector.on('collect', async msg => {
        let tosupport = new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(msg.content)
          .setFooter(foot)
          .setImage(msg.attachments.first() ? msg.attachments.first().url : '')
          .setColor('#c90000')

        let ch = guild.channels.cache.find(ch => ch.name === mailname.toLowerCase());

        if (!ch) return collector.stop();
        ch.send({ embeds: [tosupport] }).catch((err) => {
          console.log(err);
          msg.react('❌')
          mo.channel.send({ content: 'An Error Occured. ' + err })
        })
        msg.react('✅')
        
      })
    })
    let emb = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`Mod mail has been opened by the user ${message.author} \`ID: ${message.author.id}\``)
      .setThumbnail(guild.iconURL())
      .setTimestamp()
      .setColor(options.embedColor || '#075FFF')
      .setFooter(foot)

      let supportRole = guild.roles.cache.get(options.role) || '***Support Team***'

    ch.send({ content: options.content || supportRole.toString() || '***Support Team***', embeds: [emb], components: [closerow] }).then((m) => {

      let cltor = m.createMessageComponentCollector({ time: 600000 })
      
      cltor.on('collect', async button => {
        if (button.customId === 'delete_mail') {

          let surebtn = new MessageButton()
            .setStyle('DANGER')
            .setLabel('Sure')
            .setCustomId('ss_mail')

          let nobtn = new MessageButton()
            .setStyle('SUCCESS')
            .setLabel('Cancel')
            .setCustomId('noo_mail')

          let row1 = new MessageActionRow()
            .addComponents([surebtn, nobtn])

          let emb = new Discord.MessageEmbed()
            .setTitle('Are you sure ?')
            .setDescription(`This will delete the modmail. You cant undo this action`)
            .setTimestamp()
            .setColor('#c90000')
            .setFooter(foot)

          button.reply({ embeds: [emb], components: [row1], fetchReply: true}).then((me) => {

      let cltor = me.createMessageComponentCollector({ time: 600000 })
      
      cltor.on('collect', async button => {
        if (button.customId === 'ss_mail') {

                button.reply({ content: 'Deleting the modmail.. Please wait.' })

                let embaaa = new Discord.MessageEmbed()
            .setTitle('Modmail deleted')
            .setDescription(`The modmail has been deleted by a mod in the server ;( `)
            .setTimestamp()
            .setColor('#c90000')
            .setFooter(foot)

                setTimeout(() => {
                  message.author.send({ embeds: [embaaa] })
                  let delch = button.channel
                  delch.delete().catch((err) => {
                    button.message.channel.send({ content: 'An Error Occured. ' + err })
                  })
                }, 2000)
              }

              if (button.customId === 'noo_mail') {
                button.message.delete();
                button.reply({ content: 'ModMail Deletion got canceled', ephemeral: true })
              }
      })

        })
        }

      })

      cltor.on('end', async collected => {
        if(collected.size === 0){
          let ch = guild.channels.cache.find(ch => ch.name === mailname.toLowerCase());
          ch.delete().catch((err) => {
           ch.send({ content: 'An Error Occured. ' + err })
          })

        }
      })
    })

    let cho = await guild.channels.cache.find(ch => ch.name === mailname.toLowerCase());

    let fl = m => m.author.id !== client.user.id;
    const ctr = cho.createMessageCollector({ fl, time: 600000 });

    ctr.on('collect', async msg => {
      if (msg.author.bot) return;

      let tosupport = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
        .setDescription(msg.content)
        .setFooter(foot)
        .setImage(msg.attachments.first() ? msg.attachments.first().url : '')
        .setColor('#00a105')

      message.author.send({ embeds: [tosupport] }).catch((err) => {
          console.log(err);
          msg.react('❌')
          msg.channel.send({ content: 'An Error Occured. ' + err })
        })
        msg.react('✅')

    })

  })

      })
    })
  } else return message.reply('Sorry you cannot use the command in DM\'s');
  } else {
  let embed = new Discord.MessageEmbed()
    .setTitle('Hello 👋')
    .setDescription(`***You have opened a modmail.***\nPlease wait for the *support team* to contact with you.\n***I will react to your message if it is delivered***`)
    .setFooter(foot)
    .setColor('#075FFF')

  let nopeembed = new Discord.MessageEmbed()
    .setTitle(`Your DM's are closed.`)
    .setDescription(`Sorry but your ***dms are closed.*** You should **open your dms** to contact with the support team.`)
    .setFooter(foot)
    .setColor('#cc0000')

  if (options.blacklistUser) {
    for (let i = 0; i < options.blacklistUser.length; i++) {
      if (options.blacklistUser[i] === message.author.id) return message.reply('You are blacklisted from creating mod-mails');
    }
  }

  if(options.blacklistGuild){
    for (let i = 0; i < options.blacklistGuild.length; i++) {
      if (options.blacklistGuild[i] === message.guild.id) return message.reply('Modmail in this server is currently disabled...');
    }
  }
  
    let permz = {
      id: options.role || message.guild.ownerId,
      allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
    }


   chparent = options.categoryID || null
            let categ = message.guild.channels.cache.get(options.categoryID)
            if (!categ) { chparent = null }

  let mailname = `modmail_${message.author.id}`
  let antispamo = await message.guild.channels.cache.find(ch => ch.name === mailname.toLowerCase());

  if(antispamo) return message.reply({ content: 'You already have opened a modmail.. Please close it to continue.'})
message.delete()

  message.guild.channels.create(`modmail_${message.author.id}`, {
    type: "text",
     parent: chparent,
    permissionOverwrites: [
      {
        id: message.guild.roles.everyone,
        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'] //Deny permissions
      },
       permz
    ],
  }).then(async (ch) => {
    let X_btn = new MessageButton()
      .setStyle(options.delColor || 'DANGER')
      .setEmoji(options.delEmoji || '❌')
      .setLabel('Delete')
      .setCustomId('delete_mail')

    let closerow = new MessageActionRow()
      .addComponents([X_btn])

    message.author.send({ embeds: [embed] }).then(async mo => {
      let filter = m => m.author.id === message.author.id

      const collector = mo.channel.createMessageCollector({ filter, time: 600000 });

      collector.on('collect', async msg => {
        let tosupport = new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setDescription(msg.content)
          .setFooter(foot)
          .setImage(msg.attachments.first() ? msg.attachments.first().url : '')
          .setColor('#c90000')

        let ch = message.guild.channels.cache.find(ch => ch.name === mailname.toLowerCase());

        if (!ch) return collector.stop();
        ch.send({ embeds: [tosupport] }).catch((err) => {
          console.log(err);
          msg.react('❌')
          mo.channel.send({ content: 'An Error Occured. ' + err })
        })
        msg.react('✅')
        
      })
    }).catch((err) => {
      message.channel.send({ embeds: [nopeembed] })
    })
    let emb = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`Mod mail has been opened by the user ${message.author} \`ID: ${message.author.id}\``)
      .setThumbnail(message.guild.iconURL())
      .setTimestamp()
      .setColor(options.embedColor || '#075FFF')
      .setFooter(foot)

let supportRole = message.guild.roles.cache.get(options.role) || '***Support Team***'

    ch.send({ content: options.content || supportRole.toString() || '***Support Team***', embeds: [emb], components: [closerow] }).then((m) => {

      let cltor = m.createMessageComponentCollector({ time: 600000 })
      
      cltor.on('collect', async button => {
        if (button.customId === 'delete_mail') {

          let surebtn = new MessageButton()
            .setStyle('DANGER')
            .setLabel('Sure')
            .setCustomId('ss_mail')

          let nobtn = new MessageButton()
            .setStyle('SUCCESS')
            .setLabel('Cancel')
            .setCustomId('noo_mail')

          let row1 = new MessageActionRow()
            .addComponents([surebtn, nobtn])

          let emb = new Discord.MessageEmbed()
            .setTitle('Are you sure ?')
            .setDescription(`This will delete the modmail. You cant undo this action`)
            .setTimestamp()
            .setColor('#c90000')
            .setFooter(foot)

          button.reply({ embeds: [emb], components: [row1], fetchReply: true}).then((me) => {

      let cltor = me.createMessageComponentCollector({ time: 600000 })
      
      cltor.on('collect', async button => {
        if (button.customId === 'ss_mail') {

                button.reply({ content: 'Deleting the modmail.. Please wait.' })

                let embaaa = new Discord.MessageEmbed()
            .setTitle('Modmail deleted')
            .setDescription(`The modmail has been deleted by a mod in the server ;( `)
            .setTimestamp()
            .setColor('#c90000')
            .setFooter(foot)

                setTimeout(() => {
                  message.author.send({ embeds: [embaaa] })
                  let delch = button.channel
                  delch.delete().catch((err) => {
                    button.message.channel.send({ content: 'An Error Occured. ' + err })
                  })
                }, 2000)
              }

              if (button.customId === 'noo_mail') {
                button.message.delete();
                button.reply({ content: 'ModMail Deletion got canceled', ephemeral: true })
              }
      })

        })

      }
      })

      cltor.on('end', async collected => {
        if(collected.size === 0){
          let ch = message.guild.channels.cache.find(ch => ch.name === mailname.toLowerCase());
          ch.delete().catch((err) => {
           ch.send({ content: 'An Error Occured. ' + err })
          })

        }
      })
    })

    let cho = await message.guild.channels.cache.find(ch => ch.name === mailname.toLowerCase());

    let fl = m => m.author.id !== client.user.id;
    const ctr = cho.createMessageCollector({ fl, time: 600000 });

    ctr.on('collect', async msg => {
      if (msg.author.bot) return;

      let tosupport = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
        .setDescription(msg.content)
        .setFooter(foot)
        .setImage(msg.attachments.first() ? msg.attachments.first().url : '')
        .setColor('#00a105')

      message.author.send({ embeds: [tosupport] }).catch((err) => {
          console.log(err);
          msg.react('❌')
          msg.channel.send({ content: 'An Error Occured. ' + err })
        })
        msg.react('✅')

    })

  })
}
} catch(err){
  console.log(`Error Occured. | modmail | Error: ${err}`)
}

}

  module.exports = modmail;