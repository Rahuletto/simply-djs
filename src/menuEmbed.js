const Discord = require('discord.js')
async function dropdownPages(message, options = []) {
  let { MessageActionRow, MessageSelectMenu } = require('discord.js')
try {
  if(options.slash === true){
    let typ = options.type || 1
    let type = Number(typ)
    if (type > 2) throw new Error('There is no Type more than 2.. TYPE 1: SEND EPHEMERAL MSG | TYPE 2: EDIT MSG');
  
    let data = options.data
    let rowz = options.rows
    let menuOptions = [];
  
    for (let i = 0; i < data.length; i++) {
  
      if (data[i].emoji) {
        let dataopt = {
          label: data[i].label,
          description: data[i].desc,
          value: data[i].label,
          emoji: data[i].emoji
        }
  
  
        menuOptions.push(dataopt)
      } else if (!data[i].emoji) {
        let dataopt = {
          label: data[i].label,
          description: data[i].desc,
          value: data[i].label,
        }
  
        menuOptions.push(dataopt)
      }
    }
  
    let slct = new MessageSelectMenu()
      .setMaxValues(1)
      .setCustomId('help')
      .setPlaceholder(options.placeHolder || 'Dropdown Pages')
      .addOptions([
        menuOptions
      ])
  
    let row = new MessageActionRow()
      .addComponents(slct)
  
    let rows = []
  
    rows.push(row)
  
    if (rowz) {
      for (let i = 0; i < rowz.length; i++) {
        rows.push(rowz[i])
      }
    }
  
  
    message.reply({ embeds: [options.embed], components: rows })
    let m = await message.fetchReply()
      let filter = (menu) => menu.user.id == message.user.id
      const collector = m.createMessageComponentCollector({ type: 'SELECT_MENU', time: 120000, filter: filter })
      collector.on('collect', async (menu) => {
        let selet = menu.values[0]
  
        for (let i = 0; i < data.length; i++) {
  
          if (selet === data[i].label) {
            if (type === 1) {
              menu.reply({ embeds: [data[i].embed], ephemeral: true })
            } else if (type === 2) {
              menu.deferUpdate()
              menu.message.edit({ embeds: [data[i].embed] })
            }
          }
  
        }
  
      })
      collector.on('end', async collected => {
        if (collected.size === 0) {
          m.edit({ embeds: [options.embed], components: [] })
        }
    })
  }
  else if(!options.slash || options.slash === false){
  let typ = options.type || 1
  let type = Number(typ)
  if (type > 2) throw new Error('There is no Type more than 2.. TYPE 1: SEND EPHEMERAL MSG | TYPE 2: EDIT MSG');

  let data = options.data
  let rowz = options.rows
  let menuOptions = [];

  for (let i = 0; i < data.length; i++) {

    if (data[i].emoji) {
      let dataopt = {
        label: data[i].label,
        description: data[i].desc,
        value: data[i].label,
        emoji: data[i].emoji
      }


      menuOptions.push(dataopt)
    } else if (!data[i].emoji) {
      let dataopt = {
        label: data[i].label,
        description: data[i].desc,
        value: data[i].label,
      }

      menuOptions.push(dataopt)
    }
  }

  let slct = new MessageSelectMenu()
    .setMaxValues(1)
    .setCustomId('help')
    .setPlaceholder(options.placeHolder || 'Dropdown Pages')
    .addOptions([
      menuOptions
    ])

  let row = new MessageActionRow()
    .addComponents(slct)

  let rows = []

  rows.push(row)

  if (rowz) {
    for (let i = 0; i < rowz.length; i++) {
      rows.push(rowz[i])
    }
  }


  message.channel.send({ embeds: [options.embed], components: rows }).then(m => {
    let filter = (menu) => menu.user.id == message.author.id
    const collector = m.createMessageComponentCollector({ type: 'SELECT_MENU', time: 120000, filter: filter })
    collector.on('collect', async (menu) => {
      let selet = menu.values[0]

      for (let i = 0; i < data.length; i++) {

        if (selet === data[i].label) {
          if (type === 1) {
            menu.reply({ embeds: [data[i].embed], ephemeral: true })
          } else if (type === 2) {
            menu.deferUpdate()
            menu.message.edit({ embeds: [data[i].embed] })
          }
        }

      }

    })
    collector.on('end', async collected => {
      if (collected.size === 0) {
        m.edit({ embeds: [options.embed], components: [] })
      }
    })
  })
}
} catch(err){
  console.log(`Error Occured. | menuPages | Error: ${err}`)
}

}
module.exports = dropdownPages;