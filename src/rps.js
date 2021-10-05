const Discord = require("discord.js");



const colorMap = {
  'grey': 'SECONDARY',
  'red': 'DANGER',
  'green': 'SUCCESS',
  'blurple': 'PRIMARY'
}

/**
 * @param {(Discord.CommandInteraction | Discord.Message)} message
 * @param {import('../index').rpsOptions} options
 */

async function rps(message, options = {}) {
  //Default values
  options.credit ??= true;
  options.slash ??= message instanceof Discord.Interaction;

  options.embedColor ??= '#075FFF';
  options.timeoutEmbedColor ??= '#cc0000';
  options.drawEmbedColor ??= '#075FFF';
  options.winEmbedColor ??= '#06bd00';
  /**
   * This looks kinda weird but,
   * (colorMap[options.rockColor] || options.rockColor) = 
   * if rockColor is in the colorMap then its the mapped color (e. g. grey -> SECONDARY)
   * if its undefined/null it's SECONDARY
   * if its a normal string its the string
   */
  options.rockColor = (colorMap[options.rockColor] || options.rockColor) || 'SECONDARY';
  options.paperColor = (colorMap[options.paperColor] || options.paperColor) || 'SECONDARY';
  options.scissorsColor = (colorMap[options.scissorsColor] || options.scissorsColor) || 'SECONDARY';

  let foot = options.embedFooter;
  if (options.credit === false)
    foot ??= "Rock Paper Scissors";
  else
    foot ??= "©️ Simply Develop. | By- ImpassiveMoon + Rahuletto";



  //Accept decline buttons
  const accept = new Discord.MessageButton()
    .setLabel("Accept")
    .setStyle("SUCCESS")
    .setCustomId("accept");

  const decline = new Discord.MessageButton()
    .setLabel("Decline")
    .setStyle("DANGER")
    .setCustomId("decline");


  const acceptComponents = new Discord.MessageActionRow().addComponents([
    accept,
    decline
  ]);



  //RPS Buttons
  const rock = new Discord.MessageButton()
    .setLabel("ROCK")
    .setCustomId("rock")
    .setStyle(options.rockColor)
    .setEmoji("🪨");

  const paper = new Discord.MessageButton()
    .setLabel("PAPER")
    .setCustomId("paper")
    .setStyle(options.paperColor)
    .setEmoji("📄");

  const scissors = new Discord.MessageButton()
    .setLabel("SCISSORS")
    .setCustomId("scissors")
    .setStyle(options.scissorsColor)
    .setEmoji("✂️");

  const rpsComponents = new Discord.MessageActionRow().addComponents([
    rock,
    paper,
    scissors
  ]);


  //Embeds
  const timeoutEmbed = new Discord.MessageEmbed()
    .setTitle("Game Timed Out!")
    .setColor(options.timeoutEmbedColor)
    .setDescription(
      "One or more players did not make a move in time(30s)"
    )
    .setFooter(foot);


  try {
    if (message instanceof Discord.Interaction && !options.slash) {
      throw new Error('You provided a Interaction but set the slash option to false')
    } else if (message instanceof Discord.Message && options.slash) {
      throw new Error('You provided a Message but set the slash option to true')
    }



    if (message instanceof Discord.Interaction) {

      let opponent = message.options.getUser("user");
      if (!opponent)
        return await message.followUp({
          content: "No opponent mentioned!",
          ephemeral: true
        });
      if (opponent.bot)
        return await message.followUp({
          content: "You can't play against bots",
          ephemeral: true
        });
      if (opponent.id == message.user.id)
        return await message.followUp({
          content: "You cannot play by yourself!",
          ephemeral: true
        });




      let acceptEmbed = new Discord.MessageEmbed()
        .setTitle(`Waiting for ${opponent.tag} to accept!`)
        .setAuthor(message.user.tag, message.user.displayAvatarURL())
        .setColor(options.embedColor)
        .setFooter(foot);





      /** @type {Discord.Message} */
      let m = await message.followUp({
        content: `Hey <@${opponent.id}>. You got a RPS invite`,
        embeds: [acceptEmbed],
        components: [acceptComponents]
      });

      const acceptCollector = m.createMessageComponentCollector({
        type: "BUTTON",
        time: 30000
      });

      acceptCollector.on("collect", (button) => {
        if (button.user.id !== opponent.id)
          return await button.reply({
            content: "You cant play the game as they didnt call u to play.",
            ephemeral: true
          });

        if (button.customId == "decline") {
          await button.deferUpdate();
          return acceptCollector.stop("decline");
        }

        await button.deferUpdate();
        let selectEmbed = new Discord.MessageEmbed()
          .setTitle(`${message.user.tag} VS. ${opponent.tag}`)
          .setColor(options.embedColor)
          .setFooter(foot)
          .setDescription("Select 🪨, 📄, or ✂️");

        await message.editReply({
          embeds: [selectEmbed],
          components: [rpsComponents]
        });

        acceptCollector.stop();
        let ids = new Set();
        ids.add(message.user.id);
        ids.add(opponent.id);
        let op, auth;

        const btnCollector = m.createMessageComponentCollector({
          type: "BUTTON",
          time: 30000
        });
        btnCollector.on("collect", (b) => {
          if (!ids.has(b.user.id))
            return await button.reply({
              content: "You cant play the game as they didnt call u to play.",
              ephemeral: true
            });
          ids.delete(b.user.id);
          await b.deferUpdate();
          if (b.user.id === opponent.id) op = b.customId;
          if (b.user.id === message.user.id) auth = b.customId;

          if (ids.size == 0) btnCollector.stop();
        });

        btnCollector.on("end", (coll, reason) => {
          if (reason === "time") {
            await message.editReply({
              embeds: [timeoutEmbed],
              components: []
            });
          } else {

            const winnerMap = {
              'rock': 'scissors',
              'scissors': 'paper',
              'paper': 'rock'
            }


            if (op === auth) {
              message.editReply({
                embeds: [
                  new Discord.MessageEmbed()
                    .setTitle("Draw!")
                    .setColor(options.drawEmbedColor)
                    .setDescription(`Both players chose ${op}`)
                    .setFooter(foot)
                ], components: []
              });
            }

            if (winnerMap[op] === auth) { //op - won
              await message.editReply({
                embeds: [
                  new Discord.MessageEmbed()
                    .setTitle(`${opponent.tag} Wins!`)
                    .setColor(options.winEmbedColor)
                    .setDescription(`${op} defeats ${auth}`)
                    .setFooter(foot)
                ], components: []
              });
            } else { //auth - won
              await message.editReply({
                embeds: [
                  new Discord.MessageEmbed()
                    .setTitle(`${message.user.tag} Wins!`)
                    .setColor(options.winEmbedColor)
                    .setDescription(`${auth} defeats ${op}`)
                    .setFooter(foot)
                ], components: []
              });
            }
          }
        });
      });

      acceptCollector.on("end", (coll, reason) => {
        if (reason === "time") {
          await message.editReply({
            embeds: [
              new Discord.MessageEmbed()
                .setTitle("Challenge Not Accepted in Time")
                .setAuthor(message.user.tag, message.user.displayAvatarURL())
                .setColor(options.timeoutEmbedColor)
                .setFooter(foot)
                .setDescription("Ran out of time!\nTime limit: 30s")
            ], components: []
          });
        } else if (reason === "decline") {
          await message.editReply({
            embeds: [
              new Discord.MessageEmbed()
                .setTitle("Game Declined!")
                .setAuthor(message.user.tag, message.user.displayAvatarURL())
                .setColor(options.timeoutEmbedColor || 0xc90000)
                .setFooter(foot)
                .setDescription(`${opponent.tag} has declined your game!`)
            ], components: []
          });
        }
      });
    } else if (message instanceof Discord.Message) {
      let opponent = message.mentions.members.first();
      if (!opponent) return message.channel.send("No opponent mentioned!");
      if (opponent.user.bot)
        return message.channel.send("You cannot play against bots");
      if (opponent.id == message.author.id)
        return message.channel.send("You cannot play by yourself!");


      let acceptEmbed = new Discord.MessageEmbed()
        .setTitle(`Waiting for ${opponent.user.tag} to accept!`)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(options.embedColor || 0x075fff)
        .setFooter(foot);

      let accept = new Discord.MessageButton()
        .setLabel("Accept")
        .setStyle("SUCCESS")
        .setCustomId("accept");

      let decline = new Discord.MessageButton()
        .setLabel("Decline")
        .setStyle("DANGER")
        .setCustomId("decline");

      let accep = new Discord.MessageActionRow().addComponents([
        accept,
        decline
      ]);
      message.channel
        .send({
          embeds: [acceptEmbed],
          components: [accep]
        })
        .then((m) => {
          const collector = m.createMessageComponentCollector({
            type: "BUTTON",
            time: 30000
          });
          collector.on("collect", (button) => {
            if (button.user.id !== opponent.id)
              return button.reply({
                content: `Only ${opponent} can accept/deny`,
                ephemeral: true
              });

            const collector = m.createMessageComponentCollector({
              type: "BUTTON",
              time: 30000
            });
            collector.on("collect", (button) => {
              if (button.user.id !== opponent.id) {
                return button.reply({
                  content: `Only ${opponent} can confirm it.`,
                  ephemeral: true
                });
              }
              if (button.customId == "decline") {
                button.deferUpdate();
                return collector.stop("decline");
              }
              button.deferUpdate();
              let embed = new Discord.MessageEmbed()
                .setTitle(`${message.author.tag} VS. ${opponent.user.tag}`)
                .setColor(options.embedColor || 0x075fff)
                .setFooter(foot)
                .setDescription("Select 🪨, 📄, or ✂️");

              let rock = new Discord.MessageButton()
                .setLabel("ROCK")
                .setCustomId("rock")
                .setStyle(options.rockColor || "SECONDARY")
                .setEmoji("🪨");

              if (options.paperColor === "grey") {
                options.paperColor = "SECONDARY";
              } else if (options.paperColor === "red") {
                options.paperColor = "DANGER";
              } else if (options.paperColor === "green") {
                options.paperColor = "SUCCESS";
              } else if (options.paperColor === "blurple") {
                options.paperColor = "PRIMARY";
              }

              let paper = new Discord.MessageButton()
                .setLabel("PAPER")
                .setCustomId("paper")
                .setStyle(options.paperColor || "SECONDARY")
                .setEmoji("📄");

              let scissors = new Discord.MessageButton()
                .setLabel("SCISSORS")
                .setCustomId("scissors")
                .setStyle(options.scissorsColor || "SECONDARY")
                .setEmoji("✂️");

              let row = new Discord.MessageActionRow().addComponents([
                rock,
                paper,
                scissors
              ]);

              m.edit({
                embeds: [embed],
                components: [row]
              });

              collector.stop();
              let ids = new Set();
              ids.add(message.author.id);
              ids.add(opponent.id);
              let op, auth;

              const collect = m.createMessageComponentCollector({
                type: "BUTTON",
                time: 30000
              });
              collect.on("collect", (b) => {
                if (!ids.has(button.user.id))
                  return button.reply({
                    content:
                      "You cant play the game as they didnt call u to play.",
                    ephemeral: true
                  });

                const collect = m.createMessageComponentCollector({
                  type: "BUTTON",
                  time: 30000
                });
                collect.on("collect", (b) => {
                  if (!ids.has(b.user.id)) {
                    return b.reply({
                      content: `You can't change your choice.`,
                      ephemeral: true
                    });
                  }

                  ids.delete(b.user.id);
                  if (ids.size == 1) {
                    b.reply({
                      content: `You picked ${b.customId}`,
                      ephemeral: true
                    });
                  }
                  if (b.user.id == opponent.id) {
                    mem = b.customId;
                  }
                  if (b.user.id == message.author.id) {
                    auth = b.customId;
                  }
                  if (ids.size == 0) collect.stop();
                });
                collect.on("end", (c, reason) => {
                  if (reason == "time") {
                    let embed = new Discord.MessageEmbed()
                      .setTitle("Game Timed Out!")
                      .setColor(options.timeoutEmbedColor || 0xc90000)
                      .setDescription(
                        "One or more players did not make a move in time(30s)"
                      )
                      .setFooter(foot);
                    m.edit({
                      embeds: [embed],
                      components: []
                    });
                  } else {
                    if (mem == "rock" && auth == "scissors") {
                      let embed = new Discord.MessageEmbed()
                        .setTitle(`${opponent.user.tag} Wins!`)
                        .setColor(options.winEmbedColor || 0x06bd00)
                        .setDescription("Rock defeats Scissors")
                        .setFooter(foot);
                      m.edit({ embeds: [embed], components: [] });
                    } else if (mem == "scissors" && auth == "rock") {
                      let embed = new Discord.MessageEmbed()
                        .setTitle(`${message.member.user.tag} Wins!`)
                        .setColor(options.winEmbedColor || 0x06bd00)
                        .setDescription("Rock defeats Scissors")
                        .setFooter(foot);
                      m.edit({ embeds: [embed], components: [] });
                    } else if (mem == "scissors" && auth == "paper") {
                      let embed = new Discord.MessageEmbed()
                        .setTitle(`${opponent.user.tag} Wins!`)
                        .setColor(options.winEmbedColor || 0x06bd00)
                        .setDescription("Scissors defeats Paper")
                        .setFooter(foot);
                      m.edit({ embeds: [embed], components: [] });
                    } else if (mem == "paper" && auth == "scissors") {
                      let embed = new Discord.MessageEmbed()
                        .setTitle(`${message.member.user.tag} Wins!`)
                        .setColor(options.winEmbedColor || 0x06bd00)
                        .setDescription("Scissors defeats Paper")
                        .setFooter(foot);
                      m.edit({ embeds: [embed], components: [] });
                    } else if (mem == "paper" && auth == "rock") {
                      let embed = new Discord.MessageEmbed()
                        .setTitle(`${opponent.user.tag} Wins!`)
                        .setColor(options.winEmbedColor || 0x06bd00)
                        .setDescription("Paper defeats Rock")
                        .setFooter(foot);
                      m.edit({ embeds: [embed], components: [] });
                    } else if (mem == "rock" && auth == "paper") {
                      let embed = new Discord.MessageEmbed()
                        .setTitle(`${message.member.user.tag} Wins!`)
                        .setColor(options.winEmbedColor || 0x06bd00)
                        .setDescription("Paper defeats Rock")
                        .setFooter(foot);
                      m.edit({ embeds: [embed], components: [] });
                    } else {
                      let embed = new Discord.MessageEmbed()
                        .setTitle("Draw!")
                        .setColor(options.winEmbedColor || 0x06bd00)
                        .setDescription(`Both players chose ${mem}`)
                        .setFooter(foot);
                      m.edit({ embeds: [embed], components: [] });
                    }
                  }
                });
              });
              collector.on("end", (collected, reason) => {
                if (reason == "time") {
                  let embed = new Discord.MessageEmbed()
                    .setTitle("Challenge Not Accepted in Time")
                    .setAuthor(
                      message.author.tag,
                      message.author.displayAvatarURL()
                    )
                    .setColor(options.timeoutEmbedColor || 0xc90000)
                    .setFooter(foot)
                    .setDescription("Ran out of time!\nTime limit: 30s");
                  m.edit({
                    embeds: [embed],
                    components: []
                  });
                }
                if (reason == "decline") {
                  let embed = new Discord.MessageEmbed()
                    .setTitle("Game Declined!")
                    .setAuthor(
                      message.author.tag,
                      message.author.displayAvatarURL()
                    )
                    .setColor(options.timeoutEmbedColor || 0xc90000)
                    .setFooter(foot)
                    .setDescription(
                      `${opponent.user.tag} has declined your game!`
                    );
                  m.edit({
                    embeds: [embed],
                    components: []
                  });
                }
              });
            });
          });
        });
    }
  } catch (err) {
    console.log(`Error Occured. | rps | Error: ${err.stack}`);
  }
}

module.exports = rps;
