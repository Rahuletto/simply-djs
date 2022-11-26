import {
  ColorResolvable,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  Permissions,
  Message,
  MessageEmbed,
  User,
} from "discord.js";

import db from "./model/suggestion";
import { APIMessage, APIEmbed } from "discord-api-types/v10";
import { votz } from "./model/suggestion";
import chalk from "chalk";

export type manageSugOptions = {
  deny?: { color: ColorResolvable };
  accept?: { color: ColorResolvable };
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A **Suggestion** handler which handles all sugestions from the package
 * @param interaction
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Handler/manageSug***
 * @example simplydjs.manageSug(interaction)
 */

export async function manageSug(
  interaction: ButtonInteraction,
  options: manageSugOptions = {}
) {
  const button = interaction;
  if (button.isButton()) {
    try {
      options.deny = {
        color: options?.deny?.color || "RED",
      };

      options.accept = {
        color: options?.accept?.color || "GREEN",
      };

      if (button.customId === "no-sug") {
        let data = await db.findOne({
          message: button.message.id,
        });
        if (!data) {
          data = new db({
            message: button.message.id,
          });
          await data.save().catch(() => {});
        }

        const oldemb = button.message.embeds[0];

        const likesnd = oldemb.fields[1].value.split(/\s+/);
        let likes: number | string = likesnd[1].replaceAll("`", "");
        let dislikes: number | string = likesnd[3].replaceAll("`", "");

        if (
          (!oldemb.fields[1].value.includes("%") && !isNaN(parseInt(likes))) ||
          (!oldemb.fields[1].value.includes("%") && !isNaN(parseInt(dislikes)))
        ) {
          likes = parseInt(likes);
          dislikes = parseInt(dislikes);

          const l: votz[] = Array(likes).fill({ user: "1", vote: "up" });
          const d: votz[] = Array(dislikes).fill({ user: "2", vote: "down" });

          data.votes = l.concat(d);
          await data.save().catch(() => {});

          await calc(oldemb, button.message);
        }

        if (
          (button.member.permissions as Permissions).has(
            Permissions.FLAGS.Admin
          )
        ) {
          const surebtn = new ButtonBuilder()
            .setStyle("DANGER")
            .setLabel("Downvote Suggestion")
            .setCustomId("no-vote");

          const nobtn = new ButtonBuilder()
            .setStyle("PRIMARY")
            .setLabel("Deny Suggestion")
            .setCustomId("deny-sug");

          const row1 = new ActionRowBuilder().addComponents([surebtn, nobtn]);

          const msg: Message | APIMessage = await button.reply({
            content: "Do you want to Deny suggestion (or) Vote ?",
            components: [row1],
            ephemeral: true,
            fetchReply: true,
          });

          const ftter = (m: any) => button.user.id === m.user.id;
          const coll = (msg as Message).createMessageComponentCollector({
            filter: ftter,
            componentType: "BUTTON",
            time: 30000,
          });
          coll.on("collect", async (btn) => {
            if (btn.customId === "no-vote") {
              const vt = data.votes.find(
                (m) => m.user.toString() === btn.user.id
              );
              let ot: any[] | votz[] =
                data.votes.filter((m) => m.user.toString() !== btn.user.id) ||
                [];

              if (!Array.isArray(ot)) {
                ot = [ot];
              }

              if (!vt || vt.vote === null) {
                const vot: votz = { user: btn.user.id, vote: "down" };
                ot.push(vot);
                data.votes = ot;
                await data.save().catch(() => {});

                await calc(oldemb, button.message);

                await button.editReply({
                  content:
                    "You **downvoted** the suggestion. | Suggestion ID: " +
                    `\`${button.message.id}\``,
                  components: [],
                });
              } else if (vt) {
                if (vt.vote === "down") {
                  data.votes = ot;
                  await data.save().catch(() => {});

                  await calc(oldemb, button.message);

                  await button.editReply({
                    content: "Removing your **downvote**",
                    components: [],
                  });
                } else if (vt.vote === "up") {
                  const vot: votz = { user: btn.user.id, vote: "down" };
                  ot.push(vot);
                  data.votes = ot;
                  await data.save().catch(() => {});

                  await calc(oldemb, button.message);

                  await button.editReply({
                    content:
                      "You **downvoted** the suggestion. | Suggestion ID: " +
                      `\`${button.message.id}\``,
                    components: [],
                  });
                }
              }
            } else if (btn.customId === "deny-sug") {
              if (
                !(button.member.permissions as Permissions).has(
                  Permissions.FLAGS.Administrator
                )
              )
                return;
              const filter = (m: any) => button.user.id === m.author.id;

              await button.editReply({
                content:
                  "Tell me a reason to deny the suggestion. Say `cancel` to cancel. | Time: 2 minutes",
                components: [],
              });

              const msgCl = btn.channel.createMessageCollector({
                filter,

                time: 120000,
              });

              msgCl.on("collect", (m) => {
                if (m.content.toLowerCase() === "cancel") {
                  m.delete();
                  button.editReply("Cancelled your denial");
                  msgCl.stop();
                } else {
                  m.delete();
                  dec(m.content, oldemb, button.message, button.user);
                  msgCl.stop();
                }
              });

              msgCl.on("end", (collected) => {
                if (collected.size === 0) {
                  dec("No Reason", oldemb, button.message, button.user);
                }
              });
            }
          });
        } else if (
          !(button.member.permissions as Permissions).has(
            Permissions.FLAGS.Administrator
          )
        ) {
          const vt = data.votes.find(
            (m) => m.user.toString() === button.user.id
          );
          let ot: any[] | votz[] =
            data.votes.filter((m) => m.user.toString() !== button.user.id) ||
            [];

          if (!Array.isArray(ot)) {
            ot = [ot];
          }

          if (!vt || vt.vote === null) {
            const vot: votz = { user: button.user.id, vote: "down" };
            ot.push(vot);
            data.votes = ot;
            await data.save().catch(() => {});

            await calc(oldemb, button.message);

            await button.editReply({
              content:
                "You **downvoted** the suggestion. | Suggestion ID: " +
                `\`${button.message.id}\``,
              components: [],
            });
          } else if (vt) {
            if (vt.vote === "down") {
              data.votes = ot;
              await data.save().catch(() => {});

              await calc(oldemb, button.message);

              await button.editReply({
                content: "Removing your **downvote**",
                components: [],
              });
            } else if (vt.vote === "up") {
              const vot: votz = { user: button.user.id, vote: "down" };
              ot.push(vot);
              data.votes = ot;
              await data.save().catch(() => {});

              await calc(oldemb, button.message);

              await button.editReply({
                content:
                  "You **downvoted** the suggestion. | Suggestion ID: " +
                  `\`${button.message.id}\``,
                components: [],
              });
            }
          }
        }
      }

      if (button.customId === "agree-sug") {
        let data = await db.findOne({
          message: button.message.id,
        });
        if (!data) {
          data = new db({
            message: button.message.id,
          });
          await data.save().catch(() => {});
        }

        const oldemb = button.message.embeds[0];

        const likesnd = oldemb.fields[1].value.split(/\s+/);
        let likes: number | string = likesnd[1].replaceAll("`", "");
        let dislikes: number | string = likesnd[3].replaceAll("`", "");

        if (
          (!oldemb.fields[1].value.includes("%") && !isNaN(parseInt(likes))) ||
          (!oldemb.fields[1].value.includes("%") && !isNaN(parseInt(dislikes)))
        ) {
          likes = parseInt(likes);
          dislikes = parseInt(dislikes);

          const l: votz[] = Array(likes).fill({ user: "1", vote: "up" });
          const d: votz[] = Array(dislikes).fill({ user: "2", vote: "down" });

          data.votes = l.concat(d);
          await data.save().catch(() => {});

          await calc(oldemb, button.message);
        }

        if (
          (button.member.permissions as Permissions).has(
            Permissions.FLAGS.Administrator
          )
        ) {
          const surebtn = new ButtonBuilder()
            .setStyle("SUCCESS")
            .setLabel("Upvote Suggestion")
            .setCustomId("yes-vote");

          const nobtn = new ButtonBuilder()
            .setStyle("PRIMARY")
            .setLabel("Accept Suggestion")
            .setCustomId("accept-sug");

          const row1 = new ActionRowBuilder().addComponents([surebtn, nobtn]);

          const msg = await button.reply({
            content: "Do you want to Accept suggestion (or) Vote ?",
            components: [row1],
            ephemeral: true,
            fetchReply: true,
          });

          const ftter = (m: any) => button.user.id === m.user.id;
          const coll = (msg as Message).createMessageComponentCollector({
            filter: ftter,
            componentType: "BUTTON",
            time: 30000,
          });
          coll.on("collect", async (btn) => {
            if (btn.customId === "yes-vote") {
              const vt = data.votes.find(
                (m) => m.user.toString() === btn.user.id
              );
              let ot: any[] | votz[] =
                data.votes.filter((m) => m.user.toString() !== btn.user.id) ||
                [];

              if (!Array.isArray(ot)) {
                ot = [ot];
              }

              if (!vt || vt.vote === null) {
                const vot: votz = { user: btn.user.id, vote: "up" };
                ot.push(vot);
                data.votes = ot;
                await data.save().catch(() => {});

                await calc(oldemb, button.message);
                await button.editReply({
                  content:
                    "You **upvoted** the suggestion. | Suggestion ID: " +
                    `\`${button.message.id}\``,
                  components: [],
                });
              } else if (vt) {
                if (vt.vote === "up") {
                  data.votes = ot;
                  await data.save().catch(() => {});

                  await calc(oldemb, button.message);

                  await button.editReply({
                    content: "Removing your **upvote**",
                    components: [],
                  });
                } else if (vt.vote === "down") {
                  const vot: votz = { user: btn.user.id, vote: "up" };
                  ot.push(vot);
                  data.votes = ot;
                  await data.save().catch(() => {});

                  await calc(oldemb, button.message);

                  await button.editReply({
                    content:
                      "You **upvoted** the suggestion. | Suggestion ID: " +
                      `\`${button.message.id}\``,
                    components: [],
                  });
                }
              }
            } else if (btn.customId === "accept-sug") {
              if (
                !(button.member.permissions as Permissions).has(
                  Permissions.FLAGS.Administrator
                )
              )
                return;
              const filter = (m: any) => button.user.id === m.author.id;

              await button.editReply({
                content:
                  "Tell me a reason to accept the suggestion. Say `cancel` to cancel. | Time: 2 minutes",
                components: [],
              });

              const msgCl = btn.channel.createMessageCollector({
                filter,
                time: 120000,
              });

              msgCl.on("collect", (m) => {
                if (m.content.toLowerCase() === "cancel") {
                  m.delete();
                  button.editReply("Cancelled to accept");
                  msgCl.stop();
                } else {
                  m.delete();
                  aprov(m.content, oldemb, button.message, button.user);
                  msgCl.stop();
                }
              });

              msgCl.on("end", (collected) => {
                if (collected.size === 0) {
                  aprov("No Reason", oldemb, button.message, button.user);
                }
              });
            }
          });
        } else if (
          !(button.member.permissions as Permissions).has(
            Permissions.FLAGS.Administrator
          )
        ) {
          const vt = data.votes.find(
            (m) => m.user.toString() === button.user.id
          );
          let ot: any[] | votz[] =
            data.votes.filter((m) => m.user.toString() !== button.user.id) ||
            [];

          if (!Array.isArray(ot)) {
            ot = [ot];
          }

          if (!vt || vt.vote === null) {
            const vot: votz = { user: button.user.id, vote: "up" };
            ot.push(vot);
            data.votes = ot;
            await data.save().catch(() => {});

            await calc(oldemb, button.message);
            await button.editReply({
              content:
                "You **upvoted** the suggestion. | Suggestion ID: " +
                `\`${button.message.id}\``,
              components: [],
            });
          } else if (vt) {
            if (vt.vote === "up") {
              data.votes = ot;
              await data.save().catch(() => {});

              await calc(oldemb, button.message);

              await button.editReply({
                content: "Removing your **upvote**",
                components: [],
              });
            } else if (vt.vote === "down") {
              const vot: votz = { user: button.user.id, vote: "up" };
              ot.push(vot);
              data.votes = ot;
              await data.save().catch(() => {});

              await calc(oldemb, button.message);

              await button.editReply({
                content:
                  "You **upvoted** the suggestion. | Suggestion ID: " +
                  `\`${button.message.id}\``,
                components: [],
              });
            }
          }
        }
      }

      async function calc(
        oldemb: MessageEmbed | APIEmbed,
        msg: Message | APIMessage
      ) {
        const data = await db.findOne({
          message: button.message.id,
        });

        const l: any[] = [];
        const d: any[] = [];

        if (data.votes === [] || !data.votes) {
          l.length = 0;
          d.length = 0;
        } else {
          data.votes.forEach((v) => {
            if (v.vote === "up") {
              l.push(v);
            } else if (v.vote === "down") {
              d.push(v);
            }
          });
        }

        let dislik = d.length || 0;
        let lik = l.length || 0;

        if (lik <= 0) {
          lik = 0;
        }
        if (dislik <= 0) {
          dislik = 0;
        }

        const total = data.votes.length;

        let uPercent = (100 * lik) / total;

        let dPercent = (dislik * 100) / total;

        uPercent = parseInt(uPercent.toPrecision(3)) || 0;
        dPercent = parseInt(dPercent.toPrecision(3)) || 0;

        let st = "⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛";

        if (uPercent / 10 + dPercent / 10 != 0 || total != 0)
          st = "🟩".repeat(uPercent / 10) + "🟥".repeat(dPercent / 10);
        else if (total == 0) {
          st = "⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛";
          uPercent = 0;
          dPercent = 0;
        }

        (msg.components[0].components[0] as ButtonBuilder).label =
          lik.toString();

        (msg.components[0].components[1] as ButtonBuilder).label =
          dislik.toString();

        oldemb.fields[1].value = `${st} [${uPercent || 0}% - ${
          dPercent || 0
        }%]`;

        (button.message as Message).edit({
          embeds: [oldemb],
          components: msg.components as ActionRowBuilder[],
        });
      }

      async function dec(
        reason: string,
        oldemb: MessageEmbed | APIEmbed,
        msg: Message | APIMessage,
        user: User
      ) {
        oldemb = oldemb as MessageEmbed;

        oldemb.fields[0].value = `Declined\n\n**Reason:** \`${reason}\``;
        oldemb.setColor(options?.deny?.color || "RED");
        oldemb.setFooter({ text: `Declined by ${user.tag}` });

        msg.components[0].components[0].disabled = true;
        msg.components[0].components[1].disabled = true;

        (button.message as Message).edit({
          embeds: [oldemb],
          components: msg.components as ActionRowBuilder[],
        });
      }

      async function aprov(
        reason: string,
        oldemb: MessageEmbed | APIEmbed,
        msg: Message | APIMessage,
        user: User
      ) {
        oldemb = oldemb as MessageEmbed;

        oldemb.fields[0].value = `Accepted\n\n**Reason:** \`${reason}\``;
        oldemb.setColor(options?.accept?.color || "GREEN");
        oldemb.setFooter({ text: `Accepted by ${user.tag}` });

        msg.components[0].components[0].disabled = true;
        msg.components[0].components[1].disabled = true;

        (button.message as Message).edit({
          embeds: [oldemb],
          components: msg.components as ActionRowBuilder[],
        });
      }
    } catch (err: any) {
      console.log(
        `${chalk.red("Error Occured.")} | ${chalk.magenta(
          "manageSug"
        )} | Error: ${err.stack}`
      );
    }
  }
}
