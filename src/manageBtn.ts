import {
  EmbedBuilder,
  Message,
  EmbedBuilderFooter,
  EmbedBuilderAuthor,
  colorResolvable,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  User,
  AttachmentBuilder,
  GuildMember,
  TextChannel,
  Role,
  EmbedFieldData,
  GuildMemberManager,
} from "discord.js";
import chalk from "chalk";
import gsys from "./model/gSys";

// ------------------------------
// ----- I N T E R F A C E ------
// ------------------------------

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/types/btnTemplate*
 */

interface btnTemplate {
  style?: ButtonStyle;
  label?: string;
  emoji?: string;
}

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/Handler/manageBtn#ticketbtn*
 */

interface ticketBtn {
  close: btnTemplate;
  reopen: btnTemplate;
  delete: btnTemplate;
  transcript: btnTemplate;
}

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/types/CustomizableEmbed*
 */

interface CustomizableEmbed {
  author?: EmbedBuilderAuthor;
  title?: string;
  footer?: EmbedBuilderFooter;
  description?: string;
  color?: colorResolvable;

  credit?: boolean;
}

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/Handler/manageBtn#ticketsys*
 */

interface ticketSys {
  ticketname?: string;
  buttons?: ticketBtn;
  pingRole?: string | string[];
  category?: string;
  timed?: boolean;
  embed?: CustomizableEmbed;
}

/**
 * **URL** of the Type: *https://simplyd.js.org/docs/Handler/manageBtn#btnrole*
 */

interface btnRole {
  addedMsg: string;
  removedMsg: string;
}
// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

export type manageBtnOptions = {
  ticketSys?: ticketSys;
  btnRole?: btnRole;
};

// ------------------------------
// ------- P R O M I S E --------
// ------------------------------

type ticketDelete = {
  type?: "Delete";
  channelId?: string;
  user?: User;
  data?: AttachmentBuilder;
};

type rerolly = {
  type?: "Reroll";
  user?: GuildMember | GuildMember[];
  msgURL?: string;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A Button Handler for **simplydjs package functions.** [Except Suggestion Handling !]
 * @param interaction
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Handler/manageBtn***
 * @example simplydjs.manageBtn(interaction)
 */

export async function manageBtn(
  interaction: ButtonInteraction,
  options: manageBtnOptions = { ticketSys: { timed: true } }
): Promise<ticketDelete | rerolly> {
  return new Promise(async (resolve, reject) => {
    if (interaction.isButton()) {
      try {
        const member = interaction.member;

        // ------------------------------
        // ------ B T N - R O L E -------
        // ------------------------------

        if (interaction.customId.startsWith("role-")) {
          const roleId = interaction.customId.replace("role-", "");

          const role = await interaction.guild.roles.fetch(roleId, {
            force: true,
          });
          if (!role) return;
          else {
            await interaction.deferReply({ ephemeral: true });
            if (
              !(member.roles as unknown as GuildMemberManager).cache.find(
                (r: { id: string }) => r.id === role.id
              )
            ) {
              member.roles
                // @ts-ignore
                .add(role)
                .catch((err: any) =>
                  interaction.channel.send({
                    content:
                      "ERROR: Role is higher than me. `MISSING_PERMISSIONS`",
                  })
                );

              await interaction.editReply({
                content:
                  options?.btnRole?.addedMsg ||
                  `✅ Added the ${role.toString()} role to you.`,
              });
            } else if (
              (member.roles as unknown as GuildMemberManager).cache.find(
                (r: { id: string }) => r.id === role.id
              )
            ) {
              member.roles
                // @ts-ignore
                .remove(role)
                .catch((err: any) =>
                  interaction.channel.send({
                    content:
                      "ERROR: Role is higher than me. `MISSING_PERMISSIONS`",
                  })
                );

              await interaction.editReply({
                content:
                  options?.btnRole?.removedMsg ||
                  `❌ Removed the ${role.toString()} role from you.`,
              });
            }
          }
        }

        // ------------------------------
        // ---- T I C K E T - S Y S -----
        // ------------------------------
        else if (interaction.customId === "create_ticket") {
          await interaction.deferReply({ ephemeral: true });

          let name = options.ticketSys?.ticketname || `ticket_{tag}`;
          name = name
            .replaceAll("{username}", member.user.username)
            .replaceAll("{tag}", (member.user as User).tag)
            .replaceAll("{id}", member.user.id);

          const topic = `Ticket has been opened by <@${member.user.id}>`;

          const check = await interaction.guild.channels.cache.find(
            (ch) => (ch as TextChannel).topic === topic
          );

          if (check) {
            await interaction.editReply({
              content: `You have an pre-existing ticket opened (${check.toString()}). Close it before creating a new one.`,
            });
          } else if (!check) {
            let chparent = options.ticketSys?.category || null;
            const category = interaction.guild.channels.cache.get(
              options.ticketSys?.category
            );
            if (!category) {
              chparent = null;
            }

            const ch = await interaction.guild.channels.create(name, {
              type: "GUILD_TEXT",
              topic: topic,
              parent: chparent,
              permissionOverwrites: [
                {
                  id: interaction.guild.roles.everyone,
                  deny: ["ViewChannel", "SendMessages", "ReadMessageHistory"], //Deny permissions
                },
                {
                  id: member.user.id,
                  allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
                },
              ],
            });

            await interaction.editReply({
              content: `🎫 Opened your support ticket in ${ch.toString()}.`,
            });

            const rlz: Role[] = [];

            if (options.ticketSys?.pingRole) {
              if (Array.isArray(options.ticketSys?.pingRole)) {
                options.ticketSys?.pingRole.forEach(async (e) => {
                  const roler = await interaction.guild.roles.fetch(e, {
                    force: true,
                  });

                  if (roler) {
                    rlz.push(roler);
                  }
                });
              } else if (!Array.isArray(options.ticketSys?.pingRole)) {
                const roler = await interaction.guild.roles.fetch(
                  options.ticketSys?.pingRole,
                  {
                    force: true,
                  }
                );

                if (roler) {
                  rlz.push(roler);
                }
              }

              rlz.forEach((e) => {
                ch.permissionOverwrites
                  .create(e, {
                    ViewChannel: true,
                    SendMessages: true,
                    ReadMessageHistory: true,
                  })
                  .catch((e) => {});
              });
            }

            let str =
              "\n\nThis channel will be deleted after 30 minutes to prevent spams.";

            if (options.ticketSys.timed == false) {
              str = "";
            }

            const emb = new EmbedBuilder()
              .setTitle("Ticket Created")
              .setDescription(
                options.ticketSys.embed?.description
                  .replaceAll("{user}", member.user.toString())
                  .replaceAll("{tag}", (member.user as User).tag)
                  .replaceAll("{id}", member.user.id)
                  .replaceAll("{guild}", interaction.guild.name) ||
                  `Ticket has been raised by ${
                    member.user
                  }. The support will reach you shortly.\n\n**User ID**: \`${
                    member.user.id
                  }\` | **User Tag**: \`${(member.user as User).tag}\`${str}`
              )
              .setThumbnail(interaction.guild.iconURL())
              .setTimestamp()
              .setColor(options.ticketSys.embed?.color || "#075FFF")
              .setFooter(
                options.ticketSys.embed?.credit
                  ? options.ticketSys.embed?.footer
                  : {
                      text: "©️ Simply Develop. npm i simply-djs",
                      iconURL: "https://i.imgur.com/u8VlLom.png",
                    }
              );

            const close = new ButtonBuilder()
              .setStyle(
                options.ticketSys?.buttons?.close?.style || ButtonStyle.Danger
              )
              .setEmoji(options.ticketSys?.buttons?.close?.emoji || "🔒")
              .setLabel(options.ticketSys?.buttons?.close?.label || "Close")
              .setCustomId("close_ticket");

            const closerow = new ActionRowBuilder().addComponents([close]);

            ch.send({
              content: `Here is your ticket ${member.user.toString()}. | ${rlz.join(
                ","
              )}`,
              embeds: [emb],
              components: [closerow],
            }).then(async (msg) => {
              await msg.pin();
            });

            setTimeout(async () => {
              await ch.delete().catch(() => {});
            }, 1000 * 60 * 30);
          }
        } else if (interaction.customId === "close_ticket") {
          await interaction.deferReply({ ephemeral: true });

          interaction.editReply({ content: "Locking the channel." });
          (interaction.channel as TextChannel).permissionOverwrites
            .edit(interaction.guild.roles.everyone, {
              SEND_MESSAGES: false,
            })
            .catch((err) => {});

          const X_btn = new ButtonBuilder()
            .setStyle(
              options.ticketSys?.buttons?.delete?.style || ButtonStyle.Danger
            )
            .setEmoji(options.ticketSys?.buttons?.delete?.emoji || "❌")
            .setLabel(options.ticketSys?.buttons?.delete?.label || "Delete")
            .setCustomId("delete_ticket");

          const open_btn = new ButtonBuilder()
            .setStyle(options.ticketSys?.buttons?.reopen?.style || "SUCCESS")
            .setEmoji(options.ticketSys?.buttons?.reopen?.emoji || "🔓")
            .setLabel(options.ticketSys?.buttons?.delete?.label || "Reopen")
            .setCustomId("open_ticket");

          const tr_btn = new ButtonBuilder()
            .setStyle(
              options.ticketSys?.buttons?.transcript?.style || "PRIMARY"
            )
            .setEmoji(options.ticketSys?.buttons?.transcript?.emoji || "📜")
            .setLabel(
              options.ticketSys?.buttons?.transcript?.style || "Transcript"
            )
            .setCustomId("tr_ticket");

          const row = new ActionRowBuilder().addComponents([
            open_btn,
            X_btn,
            tr_btn,
          ]);

          await (interaction.message as Message).edit({
            components: [row],
          });
        } else if (interaction.customId === "tr_ticket") {
          await interaction.deferReply({ ephemeral: true });

          let messagecollection = await interaction.channel.messages.fetch({
            limit: 100,
          });
          const response: string[] = [];

          messagecollection = messagecollection.sort(
            (a, b) => a.createdTimestamp - b.createdTimestamp
          );

          messagecollection.forEach((m) => {
            if (m.author.bot) return;
            const attachment = m.attachments.first();
            const url = attachment ? attachment.url : null;
            if (url !== null) {
              m.content = url;
            }

            response.push(`[${m.author.tag} | ${m.author.id}] => ${m.content}`);
          });

          const tr = await interaction.editReply({
            content: "Collecting messages to create logs",
          });

          let use: GuildMember | string = (
            interaction.channel as TextChannel
          ).topic
            .replace(`Ticket has been opened by <@`, "")
            .replace(">", "");

          use = await interaction.guild.members.fetch(use);

          const attach = new AttachmentBuilder(
            Buffer.from(response.join(`\n`), "utf-8"),
            `${(use.user as User).tag}.txt`
          );

          setTimeout(async () => {
            await interaction.editReply({
              content: "Done. Generated the logs",
              files: [attach],
              embeds: [],
            });
          }, 2300);
        } else if (interaction.customId === "delete_ticket") {
          await interaction.deferReply({ ephemeral: true });

          const yes = new ButtonBuilder()
            .setCustomId("yea_del")
            .setLabel("Delete")
            .setStyle(ButtonStyle.Danger);

          const no = new ButtonBuilder()
            .setCustomId("dont_del")
            .setLabel("Cancel")
            .setStyle("SUCCESS");

          const row = new ActionRowBuilder().addComponents([yes, no]);

          interaction.editReply({
            content: "Are you sure ?? This process is not reversible !",
            components: [row],
          });
        } else if (interaction.customId === "yea_del") {
          await interaction.deferUpdate();
          await (interaction.message as Message).edit({ components: [] });

          let messagecollection = await interaction.channel.messages.fetch({
            limit: 100,
          });
          const response: string[] = [];

          messagecollection = messagecollection.sort(
            (a, b) => a.createdTimestamp - b.createdTimestamp
          );

          messagecollection.forEach((m) => {
            if (m.author.bot) return;
            const attachment = m.attachments.first();
            const url = attachment ? attachment.url : null;
            if (url !== null) {
              m.content = url;
            }

            response.push(
              `[${m.author.tag} | ${m.author.id}] => \`${m.content}\``
            );
          });

          const attach = new AttachmentBuilder(
            Buffer.from(response.join(`\n`), "utf-8"),
            `${(interaction.channel as TextChannel).topic}.md`
          );

          let use: GuildMember | string = (
            interaction.channel as TextChannel
          ).topic
            .replace(`Ticket has been opened by <@`, "")
            .replace(">", "");

          use = await interaction.guild.members.fetch(use);

          resolve({
            type: "Delete",
            channelId: interaction.channel.id,
            user: use.user,
            data: attach,
          });

          setTimeout(async () => {
            await interaction.channel.delete();
          }, 2000);
        } else if (interaction.customId === "dont_del") {
          await interaction.deferUpdate();
          (interaction.message as Message).edit({
            content: "You cancelled the deletion",
            components: [],
          });
        } else if (interaction.customId === "open_ticket") {
          await interaction.deferReply({ ephemeral: true });

          interaction.editReply({ content: "Unlocking the channel." });
          (interaction.channel as TextChannel).permissionOverwrites
            .edit(interaction.guild.roles.everyone, {
              SEND_MESSAGES: true,
            })
            .catch((err) => {});

          const close = new ButtonBuilder()
            .setStyle(
              options.ticketSys?.buttons?.close?.style || ButtonStyle.Danger
            )
            .setEmoji(options.ticketSys?.buttons?.close?.emoji || "🔒")
            .setLabel(options.ticketSys?.buttons?.close?.label || "Close")
            .setCustomId("close_ticket");

          const closerow: ActionRowBuilder =
            new ActionRowBuilder().addComponents([close]);

          (interaction.message as Message).edit({ components: [closerow] });
        }
        // ------------------------------
        // ------ G I V E A W A Y -------
        // ------------------------------
        else if (interaction.customId === "enter_giveaway") {
          await interaction.deferReply({ ephemeral: true });
          const data = await gsys.findOne({
            message: interaction.message.id,
          });

          if (Number(data.endTime) < Date.now()) return;
          else {
            if (data.requirements.type === "role") {
              if (
                !(
                  interaction.member.roles as unknown as GuildMemberManager
                ).cache.find((r: any) => r.id === data.requirements.id)
              )
                return interaction.editReply({
                  content:
                    "You do not fall under the requirements. | You dont have the role",
                });
            }
            if (data.requirements.type === "guild") {
              const g = interaction.client.guilds.cache.get(
                data.requirements.id
              );
              const mem = await g.members.fetch(interaction.member.user.id);

              if (!mem)
                return interaction.editReply({
                  content:
                    "You do not fall under the requirements. | Join the server.",
                });
            }

            const entris = data.entry.find(
              (id) => id.userID === member.user.id
            );

            if (entris) {
              await gsys.findOneAndUpdate(
                {
                  message: interaction.message.id,
                },
                {
                  $pull: { entry: { userID: member.user.id } },
                }
              );

              data.entered = data.entered - 1;

              await data.save().then(async (a) => {
                await interaction.editReply({
                  content: "Left the giveaway ;(",
                });
              });
            } else if (!entris) {
              data.entry.push({
                userID: member.user.id,
                guildID: interaction.guild.id,
                messageID: interaction.message.id,
              });

              data.entered = data.entered + 1;

              await data.save().then(async (a) => {
                await interaction.editReply({
                  content: "Entered the giveaway !",
                });
              });
            }

            const eem = interaction.message.embeds[0];

            (
              interaction.message.components[0].components[0] as ButtonBuilder
            ).label = data.entered.toString();

            const mes = interaction.message as Message;
            mes.edit({
              embeds: [eem],
              components: interaction.message.components as ActionRowBuilder[],
            });
          }
        }

        if (
          interaction.customId === "end_giveaway" ||
          interaction.customId === "reroll_giveaway"
        ) {
          const allComp = await interaction.message.components[0];
          const ftr = await interaction.message.embeds[0].footer;

          const embeded = new EmbedBuilder()
            .setTitle("Processing Data...")
            .setColor(0xcc0000)
            .setDescription(
              `Please wait.. We are Processing the winner with some magiks`
            )
            .setFooter({
              text: "Ending the Giveaway, Scraping the ticket..",
            });

          const msg = interaction.message as Message;

          await msg.edit({ embeds: [embeded], components: [] }).catch(() => {});

          const dispWin: string[] = [];

          const dt = await gsys.findOne({ message: msg.id });

          dt.endTime = undefined;
          await dt.save().catch(() => {});

          const winArr: any[] = [];

          const winCt = dt.winCount;

          const entries = dt.entry;

          if (dt.entered > 0) {
            for (let i = 0; i < winCt; i++) {
              const winno = Math.floor(Math.random() * dt.entered);

              winArr.push(entries[winno]);
            }
          }

          setTimeout(() => {
            winArr.forEach(async (name) => {
              await interaction.guild.members
                .fetch(name.userID)
                .then((user) => {
                  dispWin.push(`<@${user.user.id}>`);

                  const embod = new EmbedBuilder()
                    .setTitle("You.. Won the Giveaway !")
                    .setDescription(
                      `You just won \`${dt.prize}\` in the Giveaway at \`${user.guild.name}\` Go claim it fast !`
                    )
                    .setColor(0x075fff)
                    .setFooter(ftr);

                  const gothe = new ButtonBuilder()
                    .setLabel("View Giveaway")
                    .setStyle(ButtonStyle.Link)
                    .setURL(msg.url);

                  const entrow = new ActionRowBuilder().addComponents([gothe]);

                  return user
                    .send({ embeds: [embod], components: [entrow] })
                    .catch(() => {});
                })
                .catch(() => {});
            });
          }, 2000);

          setTimeout(async () => {
            if (!dt) return await msg.delete();
            if (dt) {
              const embed = interaction.message.embeds[0];

              const tim = Number(dt.endTime);
              const f: EmbedFieldData[] = [];
              embed.fields.forEach((a) => {
                if (a.name === "Requirements") return;
                a.value = a.value
                  .replaceAll("{hosted}", `<@${dt.host}>`)
                  .replaceAll("{endsAt}", `<t:${tim}:f>`)
                  .replaceAll("{prize}", dt.prize.toString())

                  .replaceAll("{winCount}", dt.winCount.toString())
                  .replaceAll("{entered}", dt.entered.toString());

                f.push(a);
              });

              if (dt.entered <= 0 || !winArr[0]) {
                (embed as EmbedBuilder)
                  .setTitle("No one entered")

                  .setFields(f)
                  .setColor("RED")
                  .setFooter(ftr);

                allComp.components[0].disabled = true;
                allComp.components[1].disabled = true;
                allComp.components[2].disabled = true;

                return await msg.edit({
                  embeds: [embed], //@ts-ignore
                  components: [allComp],
                });
              }

              const resWin: GuildMember[] = [];

              allComp.components[0].disabled = true;
              allComp.components[1].disabled = false;
              allComp.components[2].disabled = true;

              (embed as EmbedBuilder)
                .setTitle("We got the winner !")
                .setDescription(`${dispWin.join(", ")} won the prize !\n`)
                .setFields(f)
                .setColor(0x3bb143)
                .setFooter(ftr);
              //@ts-ignore
              await msg.edit({ embeds: [embed], components: [allComp] });

              if (interaction.customId === "reroll_giveaway") {
                resolve({
                  type: "Reroll",
                  msgURL: msg.url,
                  user: resWin,
                });
              }
            }
          }, 5200);
        }
      } catch (err: any) {
        console.log(
          `${chalk.red("Error Occured.")} | ${chalk.magenta(
            "manageBtn"
          )} | Error: ${err.stack}`
        );
      }
    } else return;
  });
}
