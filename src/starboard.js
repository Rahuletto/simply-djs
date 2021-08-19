const Discord = require('discord.js')

async function starboard(client, options=[]){
  
     let minno = options.minimum || 2
     let min = Number(minno)
     if(!min || min === NaN) throw new Error('MIN_IS_NAN | Minimum stars number is Not A Number. Try again.');
     if(min === 0) throw new Error('MIN_IS_ZERO | Minimum stars number should not be 0..');
   
       if (options.credit === false) {
                 foot = options.embedFoot || 'Starboard'
             } else {
                 foot = '©️ Simply Develop. npm i simply-djs'
             }
     
     client.on('messageReactionAdd', async (reaction, user) => {
       
       await reaction.fetch()
     
      if(reaction.emoji.id === options.emoji || reaction.emoji.name === '⭐'  || reaction.emoji.name ===  '🌟'){
     
     let minmax = reaction && reaction.count
     if(minmax < min) return;
   
          const starboard = client.channels.cache.get(options.chid)
     
          const fetchMsg = await reaction.message.fetch();
          if(!starboard) throw new Error('INVALID_CHANNEL_ID')
     
     const attachment = fetchMsg.attachments.first();
     const url = attachment ? attachment.url : null;
     
     if(fetchMsg.embeds.length !== 0) return;
     
     const embed = new Discord.MessageEmbed()
          .setAuthor(fetchMsg.author.tag, fetchMsg.author.displayAvatarURL())
          .setColor(options.embedColor || '#FFC83D')
          .setDescription(fetchMsg.content)
          .setTitle(`Jump to message`)
          .setURL(fetchMsg.url)
          .setImage(url)
          .setFooter('⭐ | ' + fetchMsg.id + ' | ' + foot);
     
          const msgs = await starboard.messages.fetch({ limit: 100 });
     
     
     let eemoji = client.emojis.cache.get(options.emoji) || '⭐'
     
          const existingMsg = msgs.find(async msg => {
            if(msg.embeds.length === 1){
     
              if(msg.embeds[0] === null || msg.embeds[0] === []) return starboard.send({ content: `**${eemoji} 1**`, embeds: [embed] });
     
              if(msg.embeds[0].footer && msg.embeds[0].footer.text === '⭐ | ' + fetchMsg.id + ' | ' + foot){
     
         let reacts = reaction && reaction.count ? reaction.count : 1
     
                msg.edit({ content: `**${eemoji} ${reacts}**`, embeds: [embed] })
              } else { 
               let reacts = reaction && reaction.count ? reaction.count : 1
               
               starboard.send({ content: `**${eemoji} ${reacts}** `,embeds: [embed] })
            };
            } else {  let reacts = reaction && reaction.count ? reaction.count : 1
               starboard.send({ content: `**${eemoji} ${reacts}**`, embeds: [embed] })
            }
          })
          
      }
      
      })
      
     client.on('messageReactionRemove', async (reaction, user) => {
       
       await reaction.fetch()
     
     
      if(reaction.emoji.id === options.emoji || reaction.emoji.name === '⭐' ||reaction.emoji.name ===  '🌟'){
          const starboard = client.channels.cache.get(options.chid)
     
          const fetchMsg = await reaction.message.fetch();
          if(!starboard) throw new Error('INVALID_CHANNEL_ID')
     
     const attachment = fetchMsg.attachments.first();
     const url = attachment ? attachment.url : null;
     
     const embed = new Discord.MessageEmbed()
          .setAuthor(fetchMsg.author.tag, fetchMsg.author.displayAvatarURL())
          .setColor(options.embedColor || '#FFC83D')
          .setDescription(fetchMsg.content)
          .setTitle(`Jump to message`)
          .setURL(fetchMsg.url)
          .setImage(url)
          .setFooter('⭐ | ' + fetchMsg.id + ' | ' + foot);
     
          const msgs = await starboard.messages.fetch({ limit: 100 });
     
     
     let eemoji = client.emojis.cache.get(options.emoji) || '⭐'
       
       
          const existingMsg = msgs.find(async msg => {
            if(msg.embeds.length === 1){
   
              if(msg.embeds[0].footer && msg.embeds[0].footer.text === '⭐ | ' + fetchMsg.id + ' | ' + foot){
                
         let reacts = reaction && reaction.count
     
     if(reacts < min) return msg.delete();
   
     if(reacts === 0){msg.delete()} else {
                msg.edit({ content: `**${eemoji} ${reacts}**` })
     }
              } 
            }
          });
       
      }
     })
     
     client.on('messageDelete', async message => {
       const starboard = client.channels.cache.get(options.chid)
     
          if(!starboard) throw new Error('INVALID_CHANNEL_ID')
     
       const msgs = await starboard.messages.fetch({ limit: 100 });
     
          const existingMsg = msgs.find(async msg => {
     
     if(msg.embeds[0].footer && msg.embeds[0].footer.text === '⭐ | ' + message.id + ' | ' + foot){
      msg.delete()
              }
            
          });
     })
     
     }

  module.exports = starboard;