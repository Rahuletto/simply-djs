import {
  EmbedBuilder,
  Message,
  ButtonBuilder,
  ActionRowBuilder,
  ColorResolvable,
  EmbedBuilderAuthor,
  EmbedBuilderFooter,
  ButtonStyle,
  TextChannel,
  Permissions,
} from "discord.js";
import { ExtendedInteraction, ExtendedMessage } from "./interfaces";

import { SimplyError } from "./Error/Error";
import chalk from "chalk";

// ------------------------------
// ------- T Y P I N G S --------
// ------------------------------

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

export type tSysOptions = {
  embed?: CustomizableEmbed;
  button?: btnTemplate;
  channelId?: string;
};

// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------

/**
 * A **Faster** yet Powerful ticketSystem | *Requires: [**manageBtn()**](https://simplyd.js.org/docs/handler/manageBtn)*
 *
 * @param message
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Systems/ticketSystem***
 * @example simplydjs.ticketSystem(interaction, { channelId: '0123456789012' })
 */

export async function ticketSystem(
  message: ExtendedMessage | ExtendedInteraction,
  options: tSysOptions = {}
) {
  try {
    const ch = options.channelId;

    if (!ch || ch == "")
      throw new SimplyError({
        name: "NOT_SPECIFIED | Provide an channel id to send memes.",
        tip: `Expected channelId as string in options.. | Received ${
          ch || "undefined"
        }`,
      });

    let channel = await message.client.channels.fetch(ch, {
      cache: true,
    });

    channel = channel as TextChannel;

    if (!channel)
      throw new SimplyError({
        name: `INVALID_CHID - ${options.channelId} | The channel id you specified is not valid (or) The bot has no VIEW_CHANNEL permission.`,
        tip: "Check the permissions (or) Try using another Channel ID",
      });

    let interaction;
    if (message.commandId) {
      interaction = message;
    }
    const int = message as ExtendedInteraction;
    const mes = message as Message;

    if (!message.member.permissions.has("Administrator")) {
      if (interaction) {
        return await int.followUp({
          content: "You are not an admin to create a Ticket Panel",
          ephemeral: true,
        });
      } else if (!interaction) {
        return await mes.reply({
          content: "You are not an admin to create a Ticket Panel",
        });
      }
    }

    const ticketbtn = new ButtonBuilder()
      .setStyle(options?.button?.style || ButtonStyle.Primary)
      .setEmoji(options?.button?.emoji || "🎫")
      .setLabel(options?.button?.label || "Open a Ticket")
      .setCustomId("create_ticket");

    if (!options.embed) {
      options.embed = {
        footer: {
          text: "©️ Simply Develop. npm i simply-djs",
          iconURL: "https://i.imgur.com/u8VlLom.png",
        },
        color: "#075FFF",
        title: "Create an Ticket",
        credit: true,
      };
    }

    const a = new ActionRowBuilder().addComponents([ticketbtn]);

    const embed = new EmbedBuilder()
      .setTitle(options.embed?.title || "Ticket System")
      .setColor(options.embed?.color || "#075FFF")
      .setDescription(
        options.embed?.description ||
          "🎫 Create an ticket by interacting with the button 🎫"
      )
      .setThumbnail(message.guild.iconURL())
      .setTimestamp()
      .setFooter(
        options.embed?.credit
          ? options.embed?.footer
          : {
              text: "©️ Simply Develop. npm i simply-djs",
              iconURL: "https://i.imgur.com/u8VlLom.png",
            }
      );

    if (interaction) {
      int.followUp("Done. Setting Ticket to that channel");
      channel.send({ embeds: [embed], components: [a] });
    } else if (!interaction) {
      channel.send({ embeds: [embed], components: [a] });
    }
  } catch (err: any) {
    console.log(
      `${chalk.red("Error Occured.")} | ${chalk.magenta(
        "ticketSystem"
      )} | Error: ${err.stack}`
    );
  }
}
