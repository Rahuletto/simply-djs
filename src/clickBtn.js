const Discord = require('discord.js')

/**
 * @param {Discord.ButtonInteraction} button 
 * @param {import('../index').clickBtnOptions} options 
 */
async function clickBtn(button, options = []) {
    if (button.isButton()) {
      try {
        if (options.credit === false) {
          foot = button.message.guild.name, button.message.guild.iconURL()
        } else {
          foot = '©️ Simply Develop. npm i simply-djs'
        }
  
        if (button.customId.startsWith('role-')) {
          let rle = button.customId.replace("role-", "")
  
          let real = button.guild.roles.cache.find(r => r.id === rle)
          if (!real) return;
          else {
  
            if (button.member.roles.cache.find(r => r.id === real.id)) {
  
              button.reply({ content: 'You already have the role. Removing it now', ephemeral: true })
  
              button.member.roles.remove(real).catch(err => button.message.channel.send('ERROR: Role is higher than me. MISSING_PERMISSIONS'))
  
  
            } else {
  
              button.reply({ content: `Gave you the role Name: ${real.name} | ID: ${real.id}`, ephemeral: true })
  
              button.member.roles.add(real).catch(err => button.message.channel.send('ERROR: Role is higher than me. MISSING_PERMISSIONS'))
            }
  
          }
        }
  
  
        let { MessageButton, MessageActionRow } = require('discord.js')
  
        if (button.customId === 'create_ticket') {
  
          let ticketname = `ticket_${button.user.id}`
  
          let antispamo = await button.guild.channels.cache.find(ch => ch.name === ticketname.toLowerCase());
  
          if (options.closeColor) {
  
            if (options.closeColor === 'grey') {
              options.closeColor = 'SECONDARY'
            } else if (options.closeColor === 'red') {
              options.closeColor = 'DANGER'
            } else if (options.closeColor === 'green') {
              options.closeColor = 'SUCCESS'
            } else if (options.closeColor === 'blurple') {
              options.closeColor = 'PRIMARY'
            }
  
          }
  
          if (options.openColor) {
  
            if (options.openColor === 'grey') {
              options.openColor = 'SECONDARY'
            } else if (options.openColor === 'red') {
              options.openColor = 'DANGER'
            } else if (options.openColor === 'green') {
              options.openColor = 'SUCCESS'
            } else if (options.openColor === 'blurple') {
              options.openColor = 'PRIMARY'
            }
  
          }
  
  
          if (options.delColor) {
  
            if (options.delColor === 'grey') {
              options.delColor = 'SECONDARY'
            } else if (options.delColor === 'red') {
              options.delColor = 'DANGER'
            } else if (options.delColor === 'green') {
              options.delColor = 'SUCCESS'
            } else if (options.delColor === 'blurple') {
              options.delColor = 'PRIMARY'
            }
  
          }
  
          if (antispamo) {
            button.reply({ content: options.cooldownMsg || 'You already have a ticket opened.. Please delete it before opening another ticket.', ephemeral: true })
  
          } else if (!antispamo) {
            button.deferUpdate();
  
            roles = {
              id: options.role || button.user.id,
              allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
            }
  
            chparent = options.categoryID || null
            let categ = button.guild.channels.cache.get(options.categoryID)
            if (!categ) { chparent = null }
  
            button.guild.channels.create(`ticket_${button.user.id}`, {
              type: "text",
              parent: chparent,
              permissionOverwrites: [
                {
                  id: button.message.guild.roles.everyone,
                  deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'] //Deny permissions
                },
                {
                  id: button.user.id,
                  allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                },
                roles
              ],
            }).then((ch) => {
  
  
              let emb = new Discord.MessageEmbed()
                .setTitle('Ticket Created')
                .setDescription(options.embedDesc || `Ticket has been raised by ${button.user}. We ask the Admins to summon here\n\nThis channel will be deleted after 10 minutes to reduce the clutter`)
                .setThumbnail(button.message.guild.iconURL())
                .setTimestamp()
                .setColor(options.embedColor || '#075FFF')
                .setFooter(foot)
  
  
              let close_btn = new MessageButton()
                .setStyle(options.closeColor || 'PRIMARY')
                .setEmoji(options.closeEmoji || '🔒')
                .setLabel('Close')
                .setCustomId('close_ticket')
  
              let closerow = new MessageActionRow()
                .addComponents([close_btn])
  
              ch.send({ content: `${button.user}`, embeds: [emb], components: [closerow] })
  
              if (options.timeout === true || !options.timeout) {
                setTimeout(() => {
                  ch.send({ content: 'Timeout.. You have reached 10 minutes. This ticket is getting deleted right now.' })
  
                  setTimeout(() => {
                    ch.delete()
                  }, 10000)
  
                }, 600000)
              } else if (options.timeout === false) return;
            })
          }
        }
        if (button.customId === 'close_ticket') {
  
          button.deferUpdate();
  
          button.channel.permissionOverwrites.edit(button.user.id, {
            SEND_MESSAGES: false,
            VIEW_CHANNEL: true
          })
            .catch((err) => { })
  
          let X_btn = new MessageButton()
            .setStyle(options.delColor || 'SECONDARY')
            .setEmoji(options.delEmoji || '❌')
            .setLabel('Delete')
            .setCustomId('delete_ticket')
  
          let open_btn = new MessageButton()
            .setStyle(options.openColor || 'SUCCESS')
            .setEmoji(options.openEmoji || '🔓')
            .setLabel('Reopen')
            .setCustomId('open_ticket')
  
          let row = new MessageActionRow()
            .addComponents([open_btn, X_btn])
  
          let emb = new Discord.MessageEmbed()
            .setTitle('Ticket Created')
            .setDescription(options.embedDesc || `Ticket has been raised by ${button.user}. We ask the Admins to summon here\n\nThis channel will be deleted after 10 minutes to reduce the clutter`)
            .setThumbnail(button.message.guild.iconURL())
            .setTimestamp()
            .setColor(options.embedColor || '#075FFF')
            .setFooter(foot)
  
          button.message.edit({ content: `${button.user}`, embeds: [emb], components: [row] })
        }
  
        if (button.customId === 'open_ticket') {
  
          button.channel.permissionOverwrites.edit(button.user.id, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true
          }).catch((err) => { })
  
          let emb = new Discord.MessageEmbed()
            .setTitle('Ticket Created')
            .setDescription(options.embedDesc || `Ticket has been raised by ${button.user}. We ask the Admins to summon here` + `This channel will be deleted after 10 minutes to reduce the clutter`)
            .setThumbnail(button.message.guild.iconURL())
            .setTimestamp()
            .setColor(options.embedColor || '#075FFF')
            .setFooter(foot)
  
  
          let close_btn = new MessageButton()
            .setStyle(options.closeColor || 'PRIMARY')
            .setEmoji(options.closeEmoji || '🔒')
            .setLabel('Close')
            .setCustomId('close_ticket')
  
          let closerow = new MessageActionRow()
            .addComponents([close_btn])
  
          button.message.edit({ content: `${button.user}`, embedDesc: [emb], components: [closerow] })
          button.reply({ content: 'Reopened the ticket ;)', ephemeral: true })
  
        }
  
        if (button.customId === 'delete_ticket') {
  
          let surebtn = new MessageButton()
            .setStyle('DANGER')
            .setLabel('Sure')
            .setCustomId('s_ticket')
  
          let nobtn = new MessageButton()
            .setStyle('SUCCESS')
            .setLabel('Cancel')
            .setCustomId('no_ticket')
  
          let row1 = new MessageActionRow()
            .addComponents([surebtn, nobtn])
  
          let emb = new Discord.MessageEmbed()
            .setTitle('Are you sure ?')
            .setDescription(`This will delete the channel and the ticket. You cant undo this action`)
            .setTimestamp()
            .setColor('#c90000')
            .setFooter(foot)
  
          button.reply({ embeds: [emb], components: [row1] })
  
  
        }
  
        if (button.customId === 's_ticket') {
  
          button.reply({ content: 'Deleting the ticket and channel.. Please wait.' })
  
          setTimeout(() => {
            let delch = button.message.guild.channels.cache.get(button.message.channel.id)
            delch.delete().catch((err) => {
              button.message.channel.send({ content: 'An Error Occured. ' + err, ephemeral: true })
            })
          }, 2000)
        }
  
        if (button.customId === 'no_ticket') {
          button.message.delete();
          button.reply({ content: 'Ticket Deletion got canceled', ephemeral: true })
        }
  
        if (button.customId === 'reroll-giveaway') {
          if (!button.member.permissions.has('ADMINISTRATOR')) {
  
            button.reply({ content: 'Only Admins can Reroll the giveaway..', ephemeral: true })
          } else {
            button.reply({ content: 'Rerolling the giveaway ⚙️', ephemeral: true })
  
            let oldembed = button.message.embeds[0]
  
            let wino = []
            let db = options.db
            button.guild.members.cache.forEach(async (mem) => {
              let givWin = await db.get(`giveaway_${button.message.id}_${mem.id}`)
  
              if (givWin === null || givWin === 'null' ||  !givWin) return;
              else if (givWin === mem.id) {
                wino.push(givWin)
              }
            })
            const embeddd = new Discord.MessageEmbed()
              .setTitle('Processing Data...')
              .setColor(0xcc0000)
              .setDescription(`Please wait.. We are Processing the winner with magiks`)
              .setFooter("Giveaway Ending.. Wait a moment.")
  
            setTimeout(() => {
              button.message.edit({embeds: [embeddd], components: [] })
            }, 1000)
  
              let winner = []
    let winboiz = []
  
  let winnerNumber = await db.get(`giveaway_winnerCount_${button.message.id}`)
              
              let entero = await db.get(`giveaway_entered_${button.message.id}`)
              if (!entero) { button.reply({ content: 'An Error Occured. Please try again.', ephemeral: true }) }
  
              for (let i = 0; winnerNumber > i; i++) {
                let winnumber = Math.floor((Math.random() * wino.length))
                if (wino[winnumber] === undefined) {
                  winner.push(`\u200b`)
                   winboiz.push('\u200b')
                  wino.splice(winnumber, 1);
                } else {
                  let winnee = winner.push((`\n***<@${wino[winnumber]}>*** **(ID: ${wino[winnumber]})**`).replace(',', ''))
                  winboiz.push(`<@${wino[winnumber]}>`)
                  wino.splice(winnumber, 1);
                  await db.set(`giveaway_${button.message.id}_${wino[winnumber]}`, 'null')
                }
              }
  
            setTimeout(async () => {
  
  if (winner.length === 0 || winner === [] || winner[0] === '') {
  
                              const embedod = new Discord.MessageEmbed()
                                  .setTitle('No one remaining')
                                  .setColor(0xcc0000)
                                  .setDescription(`**We rerolled and no one is remaining.**\n\n` + oldembed.description.replace(`React with the buttons to interact with giveaway.`, ' ').replace('Ends', 'Ended'))
                                  .addFields(
                                      { name: '🏆 Winner(s):', value: `none` },
                                      { name: '💝 People Entered', value: `***${entero}***`}
  
                                  )
                                  .setFooter("Giveaway Ended.")
  
                   
                let msgwonid =     await db.get(`giveaway_${button.message.id}_yaywon`)
    let msgwon = await button.message.channel.messages.fetch(msgwonid)
msgwon.delete()
                  button.message.edit({ embeds: [embedod], components: [] })
                          }    else {
              const enterr = new Discord.MessageButton()
                .setLabel('Enter')
                .setStyle('SUCCESS')
                .setDisabled(true)
                .setCustomId('enter-giveaway')
  
              const rerolll = new Discord.MessageButton()
                .setLabel('Reroll')
                .setStyle('PRIMARY')
                .setCustomId('reroll-giveaway')
  
              const endd = new Discord.MessageButton()
                .setLabel('End')
                .setDisabled(true)
                .setStyle('DANGER')
                .setCustomId('end-giveaway')
  
              const roww = new Discord.MessageActionRow()
                .addComponents([enterr, rerolll, endd])
  
              let entero = await db.get(`giveaway_entered_${button.message.id}`)
              if (!entero) { button.message.send({ content: 'An Error Occured. Please try again.', ephemeral: true }) }
  
             const embedd = new Discord.MessageEmbed()
      .setTitle ('Giveaway Ended')
      .setColor(0x3BB143)
     .setDescription(oldembed.description.replace(`React with the buttons to interact with giveaway.`, ' ').replace('Ends', 'Ended'))
     .addFields(
        { name: '🏆 Winner(s):', value: `${winner}`},
         { name: '💝 People Entered', value: `***${entero}***`}
      )
      .setFooter("Giveaway Ended.")
  
              let winmsgreroll =     await db.get(`giveaway_${button.message.id}_yaywon`)
    let winreroll = await button.message.channel.messages.fetch(winmsgreroll)
                const gothere = new Discord.MessageButton()
                  .setLabel('View Giveaway')
                  .setStyle('LINK')
                  .setURL(button.message.url)
  
                const ro = new Discord.MessageActionRow()
                  .addComponents([gothere])

                  const embb = new Discord.MessageEmbed()
                  .setColor(0x3BB143)
                  .setTitle('You just won the giveaway.')
                  .setDescription(`🏆 Winner(s): ***${winnerNumber}***`)
                  .setFooter("Dm the host to claim your prize 0_0")
                
                winreroll.edit({content: `Congrats ${winboiz}. You just won the giveaway.`, embeds: [embb], components: [ro] }).then(async m => {
                  await db.set(`giveaway_${button.message.id}_yaywon`, m.id)
                })
    
    button.message.edit({ embeds: [embedd], components: [roww] })

  
                          }
            }, 5000)
          }
        }
  
        if (button.customId === 'end-giveaway') {
          if (!button.member.permissions.has('ADMINISTRATOR')) {
            
            button.reply({ content: 'Only Admins can End the giveaway..', ephemeral: true })
          } else {
            button.reply({ content: 'Ending the giveaway ⚙️', ephemeral: true })

            let wino = []
            let oldembed = button.message.embeds[0]

            button.guild.members.cache.forEach(async (mem) => {
              let givWin = await db.get(`giveaway_${button.message.id}_${mem.id}`)

              if (givWin === null || givWin === 'null' ||  !givWin) return;
              else if (givWin === mem.id) {
                wino.push(givWin)
              }
            })
            const embeddd = new Discord.MessageEmbed()
              .setTitle('Processing Data...')
              .setColor(0xcc0000)
              .setDescription(`Please wait.. We are Processing the winner with magiks`)
              .setFooter("Giveaway Ending.. Wait a moment.")

            setTimeout(() => {
              button.message.edit({ embeds: [embeddd], components: [] })
            }, 1000)

            

            setTimeout(async () => {
              let winner = []
              let winboiz = []

              if (wino.length === 0 || wino === []) {
                let ol = oldembed.fields[1].value.replace('**', '')
                let winnnerNumber = ol.replace('**', '')
                

                const embedod = new Discord.MessageEmbed()
                  .setTitle('No one entered')
                                  .setColor(0xcc0000)
                                  .setDescription(`**No one entered the giveaway ;(.**\n\n` + oldembed.description.replace(`React with the buttons to interact with giveaway.`, ' ').replace('Ends', 'Ended'))
                                  .addFields(
                                      { name: '🏆 Winner(s):', value: `none` },
                                      { name: '💝 People Entered', value: `***${winnnerNumber}***`}
  
                                  )
                                  .setFooter("Giveaway Ended.")
                
                button.message.edit({ embeds: [embedod], components: [] })

              } else {

                const enterr = new Discord.MessageButton()
                  .setLabel('Enter')
                  .setStyle('SUCCESS')
                  .setDisabled(true)
                  .setCustomId('enter-giveaway')

                const rerolll = new Discord.MessageButton()
                  .setLabel('Reroll')
                  .setStyle('PRIMARY')
                  .setCustomId('reroll-giveaway')

                const endd = new Discord.MessageButton()
                  .setLabel('End')
                  .setDisabled(true)
                  .setStyle('DANGER')
                  .setCustomId('end-giveaway')

                const roww = new Discord.MessageActionRow()
                  .addComponents([enterr, rerolll, endd])


                let wi = oldembed.fields[0].value.replace('**', '')
              let winnerNumber = wi.replace('**', '')
  await db.set(`giveaway_winnerCount_${button.message.id}`, winnerNumber)
  
                for (let i = 0; winnerNumber > i; i++) {
                  let winnumber = Math.floor((Math.random() * wino.length))
                  if (wino[winnumber] === undefined) {
                  winner.push(`\u200b`)
                   winboiz.push('\u200b')
                  wino.splice(winnumber, 1);
                } else {
                  let winnee = winner.push((`\n***<@${wino[winnumber]}>*** **(ID: ${wino[winnumber]})**`).replace(',', ''))
                  winboiz.push(`<@${wino[winnumber]}>`)
                  wino.splice(winnumber, 1);
                  await db.set(`giveaway_${button.message.id}_${wino[winnumber]}`, 'null')
                }
                }
                let entero = await db.get(`giveaway_entered_${button.message.id}`)

  const embedd = new Discord.MessageEmbed()
      .setTitle ('Giveaway Ended')
      .setColor(0x3BB143)
     .setDescription(oldembed.description.replace(`React with the buttons to interact with giveaway.`, ' ').replace('Ends', 'Ended'))
     .addFields(
        { name: '🏆 Winner(s):', value: `${winner}`},
         { name: '💝 People Entered', value: `***${entero}***`}
      )
      .setFooter("Giveaway Ended.")

                  const embb = new Discord.MessageEmbed()
                  .setColor(0x3BB143)
                  .setTitle('You just won the giveaway.')
                  .setDescription(`🏆 Winner(s): ***${winnerNumber}***`)
                  .setFooter("Dm the host to claim your prize 0_0")


                const gothere = new Discord.MessageButton()
                  .setLabel('View Giveaway')
                  .setStyle('LINK')
                  .setURL(button.message.url)
  
                const ro = new Discord.MessageActionRow()
                  .addComponents([gothere])

                button.channel.send({ content: `Congrats ${winboiz}. You just won the giveaway.`, embeds: [embb], components: [ro] }).then(async m => {
                  await db.set(`giveaway_${button.message.id}_yaywon`, m.id)
                })
  
  
                button.message.edit({embeds: [embedd], components: [roww] })


              }
            }, 5000)
          }
        }

      } catch (err) {
        console.log(`Error Occured. | clickBtn | Error: ${err.stack}`)
      }
    }
  }
    
module.exports = clickBtn;