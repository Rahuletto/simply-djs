const Discord = require('discord.js')
const math = require('mathjs')

/**
 * @param {Discord.CommandInteraction} interaction 
 * @param {import('../index').calculatorOptions} options 
 */
async function calculator(interaction, options = []) {
  try{
    if(options.slash === true) {
      let { MessageButton, MessageActionRow } = require('discord.js')
    
      let button = new Array([], [], [], [], []);
      let row = [];
      let text = ["Clear", "(", ")", "/", "⌫", "7", "8", "9", "*", "!", "4", "5", "6", "-", "^", "1", "2", "3", "+", "π", ".", "0", "00", "=", "Delete"];
      let current = 0;
      if (options.credit === false) {
        foot = options.embedFoot || 'Calculator'
    } else {
        foot = '©️ Simply Develop. npm i simply-djs'
    }

      for (let i = 0; i < text.length; i++) {
        if (button[current].length === 5) current++;
        button[current].push(createButton(text[i]));
        if (i === text.length - 1) {
          for (let btn of button) row.push(addRow(btn));
        }
      }
    
      const emb = new Discord.MessageEmbed()
        .setColor(options.embedColor || 0x075FFF)
      .setFooter(foot)
        .setDescription("```0```")
    
      await interaction.followUp({
        embeds: [emb],
        components: row
      }).then(async (mssg) => {
    
    const msg = await interaction.fetchReply()
    
        let isWrong = false;
        let time = 600000
        let value = ""
        let emb1 = new Discord.MessageEmbed()
        .setFooter(foot)
          .setColor(options.embedColor || 0x075FFF)
    
        function createCollector(val, result = false) {
    
          const filter = (button) => button.user.id === interaction.user.id && button.customId === 'cal' + val
          let collect = msg.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: time });
    
          collect.on("collect", async x => {
            if (x.user.id !== interaction.user.id) return;
    
            x.deferUpdate();
    
            if (result === "new") value = "0"
            else if (isWrong) {
              value = val
              isWrong = false;
            } else if (value === "0") value = val;
            else if (result) {
              isWrong = true;
              value = mathEval(value);
            }
            else value += val
            if (value.includes("⌫")) {
              value = value.slice(0, -2)
              if(value === '') value = " ";
              emb1.setDescription("```" + value + "```")
              await msg.edit({
                embeds: [emb1],
                components: row
              })
              
            } else if (value.includes("Delete")) return interaction.deleteReply();
             else if (value.includes("Clear")) return value = "0"
            emb1.setDescription("```" + value + "```")
            await msg.edit({
              embeds: [emb1],
              components: row
            })
          })
        }
    
        for (let txt of text) {
          let result;
    
          if (txt === "Clear") result = "new";
          else if (txt === "=") result = true;
          else result = false
          createCollector(txt, result)
        }
        setTimeout(async () => {
          emb1.setDescription("Your Time for using the calculator ran out (10 minutes)")
          emb1.setColor(0xc90000)
          await msg.edit({ embeds: [emb1], components: [] })
        }, time)
    
      })
    
      function addRow(btns) {
        let row1 = new MessageActionRow()
        for (let btn of btns) {
          row1.addComponents(btn)
        } return row1;
      }
    
      function createButton(label, style = "SECONDARY") {
        if (label === "Clear") style = "DANGER"
        else if (label === "Delete") style = 'DANGER'
        else if (label === "⌫") style = 'DANGER'
        else if(label === 'π') style = "SECONDARY"
        else if(label === '!') style = "SECONDARY"
        else if(label === '^') style = "SECONDARY"
        else if (label === ".") style = "PRIMARY"
        else if (label === "=") style = "SUCCESS"
        else if (isNaN(label)) style = "PRIMARY"
        const btn = new MessageButton()
          .setLabel(label)
          .setStyle(style)
          .setCustomId("cal" + label)
        return btn;
      }
    
      function mathEval(input) {
        try {
          let res = `${input} = ${math.evaluate(input.replace("π", math.pi))}`
          return res
        } catch {
          return "Wrong Input"
        }
      }
    } else if(!options.slash || options.slash === false){
      let { MessageButton, MessageActionRow } = require('discord.js')
    
      let button = new Array([], [], [], [], []);
      let row = [];
      let text = ["Clear", "(", ")", "/", "⌫", "7", "8", "9", "*", "!", "4", "5", "6", "-", "^", "1", "2", "3", "+", "π", ".", "0", "00", "=", "Delete"];
      let current = 0;
    
      if (options.credit === false) {
        foot = options.embedFoot || 'Calculator'
    } else {
        foot = '©️ Simply Develop. npm i simply-djs'
    }

      for (let i = 0; i < text.length; i++) {
        if (button[current].length === 5) current++;
        button[current].push(createButton(text[i]));
        if (i === text.length - 1) {
          for (let btn of button) row.push(addRow(btn));
        }
      }
      
      const emb = new Discord.MessageEmbed()
        .setColor(options.embedColor || 0x075FFF)
      .setFooter(foot)
        .setDescription("```0```")
    
      await interaction.reply({
        embeds: [emb],
        components: row
      }).then((msg) => {
    
        let isWrong = false;
        let time = 600000
        let value = ""
        let emb1 = new Discord.MessageEmbed()
        .setFooter(foot)
          .setColor(options.embedColor || 0x075FFF)
    
        function createCollector(val, result = false) {
    
          const filter = (button) => button.user.id === interaction.author.id && button.customId === 'cal' + val
          let collect = msg.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: time });
    
          collect.on("collect", async x => {
            if (x.user.id !== interaction.author.id) return;
    
            x.deferUpdate();
    
            if (result === "new") value = "0"
            else if (isWrong) {
              value = val
              isWrong = false;
            } else if (value === "0") value = val;
            else if (result) {
              isWrong = true;
              value = mathEval(value);
            }
            else value += val
            if (value.includes("⌫")) {
              value = value.slice(0, -2)
              if(value === '') value = " ";
              emb1.setDescription("```" + value + "```")
              await msg.edit({
                embeds: [emb1],
                components: row
              })
              
            } else if (value.includes("Delete")) {
             msg.delete()
              return interaction.delete();
            } else if (value.includes("Clear")) return value = "0"
            emb1.setDescription("```" + value + "```")
            await msg.edit({
              embeds: [emb1],
              components: row
            })
          })
        }
    
        for (let txt of text) {
          let result;
    
          if (txt === "Clear") result = "new";
          else if (txt === "=") result = true;
          else result = false
          createCollector(txt, result)
        }
        setTimeout(async () => {
          emb1.setDescription("Your Time for using the calculator ran out (10 minutes)")
          emb1.setColor(0xc90000)
          await msg.edit({ embeds: [emb1], components: [] })
        }, time)
    
      })
    
      function addRow(btns) {
        let row1 = new MessageActionRow()
        for (let btn of btns) {
          row1.addComponents(btn)
        } return row1;
      }
    
      function createButton(label, style = "SECONDARY") {
        if (label === "Clear") style = "DANGER"
        else if (label === "Delete") style = 'DANGER'
        else if (label === "⌫") style = 'DANGER'
        else if(label === 'π') style = "SECONDARY"
        else if(label === '!') style = "SECONDARY"
        else if(label === '^') style = "SECONDARY"
        else if (label === ".") style = "PRIMARY"
        else if (label === "=") style = "SUCCESS"
        else if (isNaN(label)) style = "PRIMARY"
        const btn = new MessageButton()
          .setLabel(label)
          .setStyle(style)
          .setCustomId("cal" + label)
        return btn;
      }
    
      function mathEval(input) {
        try {
          let res = `${input} = ${math.evaluate(input.replace("π", math.pi))}`
          return res
        } catch {
          return "Wrong Input"
        }
      }
    }
  } catch (err) {
    console.log(`Error Occured. | calculator | Error: ${err.stack}`)
  }
    }

module.exports = calculator;