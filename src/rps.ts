import {
  EmbedBuilder,
  Message,
  EmbedBuilderFooter,
  EmbedBuilderAuthor,
  ColorResolvable,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  HexColorString,
  User,
} from "discord.js";
import { ExtendedInteraction, ExtendedMessage } from "./interfaces";

import chalk from "chalk";
import { APIMessage } from "discord-api-types/v10";

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/types/CustomizableEmbed*
 */

interface CustomizableEmbed {
  author?: EmbedBuilderAuthor;
  title?: string;
  footer?: EmbedBuilderFooter;
  description?: string;
  color?: ColorResolvable;

  credit?: boolean;
}

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/types/btnTemplate*
 */

interface btnTemplate {
  style?: ButtonStyle;
  label?: string;
  emoji?: string;
}

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/Fun/rps#rpsbuttons*
 */

interface rpsButtons {
  rock?: btnTemplate;
  paper?: btnTemplate;
  scissor?: btnTemplate;
}

export type rpsOptions = {
  embed?: CustomizableEmbed;
  drawColor?: HexColorString;
  winColor?: HexColorString;
  buttons?: rpsButtons;
  opponent?: User;
};
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A classic RPS game, except this time it's on Discord to play with your pals, how cool is that ?
 *
 * @param message
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Fun/rps***
 * @example simplydjs.rps(message)
 */

export async function rps(
  message: ExtendedMessage | ExtendedInteraction,
  options: rpsOptions = {}
) {
  return new Promise(async (resolve) => {
    const accept = new ButtonBuilder()
      .setLabel("Accept")
      .setStyle(ButtonStyle.Success)
      .setCustomId("accept");

    const decline = new ButtonBuilder()
      .setLabel("Deny")
      .setStyle(ButtonStyle.Danger)
      .setCustomId("decline");

    const acceptComponents = new ActionRowBuilder<ButtonBuilder>().addComponents([
      accept,
      decline,
    ]);

    options.buttons = {
      rock: {
        style: options.buttons?.rock?.style || ButtonStyle.Primary,
        label: options.buttons?.rock?.label || "Rock",
        emoji: options.buttons?.rock?.emoji || "🪨",
      },
      paper: {
        style: options.buttons?.paper?.style || ButtonStyle.Success,
        label: options.buttons?.paper?.label || "Paper",
        emoji: options.buttons?.paper?.emoji || "📄",
      },
      scissor: {
        style: options.buttons?.paper?.style || ButtonStyle.Danger,
        label: options.buttons?.paper?.label || "Scissor",
        emoji: options.buttons?.paper?.emoji || "✂️",
      },
    };

    if (!options.embed) {
      options.embed = {
        footer: {
          text: "©️ Simply Develop. npm i simply-djs",
          iconURL: "https://i.imgur.com/u8VlLom.png",
        },
        color: "#075FFF",
        title: "Rock Paper Scissor !",
        credit: true,
      };
    }

    const rock = new ButtonBuilder()
      .setLabel(options.buttons?.rock?.label)
      .setCustomId("rock")
      .setStyle(options.buttons?.rock?.style)
      .setEmoji(options.buttons?.rock?.emoji);

    const paper = new ButtonBuilder()
      .setLabel(options.buttons?.paper?.label)
      .setCustomId("paper")
      .setStyle(options.buttons?.paper?.style)
      .setEmoji(options.buttons?.paper?.emoji);

    const scissors = new ButtonBuilder()
      .setLabel(options.buttons?.scissor?.label)
      .setCustomId("scissors")
      .setStyle(options.buttons?.scissor?.style)
      .setEmoji(options.buttons?.scissor?.emoji);

    const rpsComponents = new ActionRowBuilder<ButtonBuilder>().addComponents([
      rock,
      paper,
      scissors,
    ]);

    //Embeds
    const timeoutEmbed = new EmbedBuilder()
      .setTitle("Game Timed Out!")
      .setColor(`RED`)
      .setDescription("The opponent didnt respond in time (30s)")
      .setFooter(
        options.embed?.credit
          ? options.embed?.footer
          : {
              text: "©️ Simply Develop. npm i simply-djs",
              iconURL: "https://i.imgur.com/u8VlLom.png",
            }
      );

    try {
      let opponent: any;

      let interaction: any;
      if (message.commandId) {
        interaction = message;
        opponent = options.opponent || interaction.options.getUser("user");
      } else {
        opponent = (message as Message).mentions.members.first()?.user;
      }

      const int = message as ExtendedInteraction;
      const mes = message as Message;

      if (!interaction) {
        if (!opponent) return mes.reply("No opponent mentioned!");
        if (opponent.bot) return mes.reply("You cannot play against bots");
        if (opponent.id === message.member.user.id)
          return mes.reply("You cannot play by yourself!");
      } else if (interaction) {
        if (!opponent)
          return await int.followUp({
            content: "No opponent mentioned!",
            ephemeral: true,
          });
        if (opponent.bot)
          return await int.followUp({
            content: "You can't play against bots",
            ephemeral: true,
          });
        if (opponent.id === message.member.user.id)
          return await int.followUp({
            content: "You cannot play by yourself!",
            ephemeral: true,
          });
      }

      const acceptEmbed = new EmbedBuilder()
        .setTitle(`Request for ${opponent.tag} !`)
        .setAuthor({
          name: (message.member.user as User).tag,
          iconURL: (message.member.user as User).displayAvatarURL({
            dynamic: true,
          }),
        })
        .setColor(options.embed.color || `#075FFF`)
        .setFooter(
          options.embed?.credit
            ? options.embed?.footer
            : {
                text: "©️ Simply Develop. npm i simply-djs",
                iconURL: "https://i.imgur.com/u8VlLom.png",
              }
        );

      let m: Message | APIMessage;

      if (interaction) {
        m = await int.followUp({
          content: `Hey <@${opponent.id}>. You got a RPS invitation !`,
          embeds: [acceptEmbed],
          components: [acceptComponents],
        });
      } else if (!interaction) {
        m = await mes.reply({
          content: `Hey <@${opponent.id}>. You got a RPS invitation !`,
          embeds: [acceptEmbed],
          components: [acceptComponents],
        });
      }

      const filter = (m: any) => m.user.id === opponent.id;
      const acceptCollector = (m as Message).createMessageComponentCollector({
        filter,
        componentType: ComponentType.Button,
        time: 30000,
        maxUsers: 1,
      });

      acceptCollector.on("collect", async (button) => {
        if (button.user.id !== opponent.id)
          return await button.reply({
            content: "You cannot play the game.",
            ephemeral: true,
          });

        await button.deferUpdate();

        if (button.customId == "decline") {
          return acceptCollector.stop("decline");
        }

        acceptEmbed
          .setTitle(`${(message.member.user as User).tag} VS. ${opponent.tag}`)
          .setDescription("Select 🪨, 📄, or ✂️");

        if (interaction) {
          await int.editReply({
            content: "**Its time.. for RPS.**",
            embeds: [acceptEmbed],
            components: [rpsComponents],
          });
        } else if (!interaction) {
          await (m as Message).edit({
            content: "**Its time.. for RPS.**",
            embeds: [acceptEmbed],
            components: [rpsComponents],
          });
        }

        acceptCollector.stop();
        const ids = new Set();
        ids.add(message.member.user.id);
        ids.add(opponent.id);
        let op: any, auth: any;

        const btnCollector = (m as Message).createMessageComponentCollector({
          componentType: ComponentType.Button,
          time: 30000,
        });

        btnCollector.on("collect", async (b: any) => {
          await b.deferUpdate();

          if (!ids.has(b.user.id)) {
            await button.followUp({
              content: "You cannot play the game.",
              ephemeral: true,
            });
            return;
          }

          ids.delete(b.user.id);

          if (b.user.id === opponent.id) op = b.customId;
          if (b.user.id === message.member.user.id) auth = b.customId;

          setTimeout(() => {
            if (ids.size == 0) btnCollector.stop();
          }, 500);
        });

        btnCollector.on("end", async (coll, reason) => {
          if (reason === "time") {
            if (interaction) {
              await interaction.editReply({
                content: "** **",
                embeds: [timeoutEmbed],
                components: [],
              });
            } else if (!interaction) {
              await (m as Message).edit({
                content: "** **",
                embeds: [timeoutEmbed],
                components: [],
              });
            }
          } else {
            const winnerMap: any = {
              rock: "scissors",
              scissors: "paper",
              paper: "rock",
            };
            if (op === auth) {
              op = op
                .replace(
                  "scissors",
                  `${options.buttons.scissor.emoji} ${options.buttons.scissor.label}`
                )
                .replace(
                  "paper",
                  `${options.buttons.paper.emoji} ${options.buttons.paper.label}`
                )
                .replace(
                  "rock",
                  `${options.buttons.rock.emoji} ${options.buttons.rock.label}`
                );

              const mm: any = {
                content: "** **",
                embeds: [
                  new EmbedBuilder()
                    .setTitle("Draw!")
                    .setColor(options.drawColor)
                    .setDescription(`Both players chose **${op}**`)
                    .setFooter(
                      options.embed?.credit
                        ? options.embed?.footer
                        : {
                            text: "©️ Simply Develop. npm i simply-djs",
                            iconURL: "https://i.imgur.com/u8VlLom.png",
                          }
                    ),
                ],
                components: [],
              };

              if (interaction) {
                await interaction.editReply(mm);
              }
              if (!interaction) {
                await (m as Message).edit(mm);
              }
            } else if (winnerMap[op] === auth) {
              op = op
                .replace(
                  "scissors",
                  `${options.buttons.scissor.emoji} ${options.buttons.scissor.label}`
                )
                .replace(
                  "paper",
                  `${options.buttons.paper.emoji} ${options.buttons.paper.label}`
                )
                .replace(
                  "rock",
                  `${options.buttons.rock.emoji} ${options.buttons.rock.label}`
                );

              auth = auth
                .replace(
                  "scissors",
                  `${options.buttons.scissor.emoji} ${options.buttons.scissor.label}`
                )
                .replace(
                  "paper",
                  `${options.buttons.paper.emoji} ${options.buttons.paper.label}`
                )
                .replace(
                  "rock",
                  `${options.buttons.rock.emoji} ${options.buttons.rock.label}`
                );

              const mm: any = {
                content: "** **",
                embeds: [
                  new EmbedBuilder()
                    .setTitle(`${opponent.tag} Won !`)
                    .setColor(options.winColor)
                    .setDescription(`**${op}** defeats **${auth}**`)
                    .setFooter(
                      options.embed?.credit
                        ? options.embed?.footer
                        : {
                            text: "©️ Simply Develop. npm i simply-djs",
                            iconURL: "https://i.imgur.com/u8VlLom.png",
                          }
                    ),
                ],
                components: [],
              };
              //op - won
              if (interaction) {
                await interaction.editReply(mm);
                resolve(opponent);
              } else if (!interaction) {
                resolve(opponent);

                await (m as Message).edit(mm);
              }
            } else {
              op = op
                .replace(
                  "scissors",
                  `${options.buttons.scissor.emoji} ${options.buttons.scissor.label}`
                )
                .replace(
                  "paper",
                  `${options.buttons.paper.emoji} ${options.buttons.paper.label}`
                )
                .replace(
                  "rock",
                  `${options.buttons.rock.emoji} ${options.buttons.rock.label}`
                );

              auth = auth
                .replace(
                  "scissors",
                  `${options.buttons.scissor.emoji} ${options.buttons.scissor.label}`
                )
                .replace(
                  "paper",
                  `${options.buttons.paper.emoji} ${options.buttons.paper.label}`
                )
                .replace(
                  "rock",
                  `${options.buttons.rock.emoji} ${options.buttons.rock.label}`
                );

              const mm: any = {
                content: "** **",
                embeds: [
                  new EmbedBuilder()
                    .setTitle(`${(message.member.user as User).tag} Won !`)
                    .setColor(options.winColor)
                    .setDescription(`**${auth}** defeats **${op}**`)
                    .setFooter(
                      options.embed?.credit
                        ? options.embed?.footer
                        : {
                            text: "©️ Simply Develop. npm i simply-djs",
                            iconURL: "https://i.imgur.com/u8VlLom.png",
                          }
                    ),
                ],
                components: [],
              };
              //auth - won
              if (interaction) {
                await interaction.editReply(mm);
              } else if (!interaction) {
                await (m as Message).edit(mm);
              }

              resolve(message.member.user);
            }
          }
        });
      });

      acceptCollector.on("end", async (coll, reason) => {
        if (reason === "time") {
          const wee: any = {
            content: "** **",
            embeds: [timeoutEmbed],
            components: [],
          };

          await (m as Message).edit(wee);
        } else if (reason === "decline") {
          const wee: any = {
            content: "** **",
            embeds: [
              new EmbedBuilder()
                .setColor(`RED`)
                .setFooter(
                  options.embed?.credit
                    ? options.embed?.footer
                    : {
                        text: "©️ Simply Develop. npm i simply-djs",
                        iconURL: "https://i.imgur.com/u8VlLom.png",
                      }
                )
                .setTitle("Game Declined!")
                .setDescription(
                  `${opponent.tag} has declined your game request!`
                ),
            ],
            components: [],
          };

          await (m as Message).edit(wee);
        }
      });
    } catch (err: any) {
      console.log(
        `${chalk.red("Error Occured.")} | ${chalk.magenta(
          "rps"
        )} | Error: ${err.stack}`
      );
    }
  });
}
