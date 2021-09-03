import { ButtonInteraction, Client, ColorResolvable, Emoji, EmojiResolvable, HexColorString, Message, MessageActionRow, MessageEmbed, MessageReaction, StartThreadOptions, TextBasedChannels, TextChannel, User } from 'discord.js';
type DB = 'quickmongo';

export declare function btnrole(client: Client, message: Message, options?: {
    embed: MessageEmbed,
    data: {
        role: string,
        /** default: *role name* */
        label?: string,
        /** default: SECONDARY */
        color?: HexColorString,
        emoji?: EmojiResolvable,
    }[]
}): Promise<void>;

export declare function calculator(message: Message, options?: {
    /** The Embed Color of the calculator embed, default: #075FFF */
    embedColor: HexColorString,
    /** Slash support */
    slash?: boolean,
    /**  Credit the package. (Only Boolean [true/false]) */
    credit?: boolean

}): Promise<void>;

export declare function chatbot(client: Client, message: Message, options?: {
    /** Channel id for where to speak (Can be an array) */
    chid: string | string[],
    /** ChatBot name, default: Your bot name */
    name?: string,
    /** Toggle the chatbot */
    toggle?: boolean
    /** Your name */
    developer?: string
}): Promise<void>;

export declare function clickBtn(button: ButtonInteraction, options?: {
    /**  The Embed Description of the embed which is sent when the ticket has been opened */
    embedDesc?: string,
    /** The Embed Color of the embed which is sent when the ticket has been opened */
    embedColor?: HexColorString,
    /** Give credits to this package (Boolean[true / false]) Default: true */
    credit?: boolean,
    // Close Ticket Button
    /** The color of the Close Ticket Button */
    closeColor: ColorResolvable,
    /** The emoji for the Close Ticket Button */
    closeEmoji: EmojiResolvable
    //Delete Ticket Button
    /** The color of the Delete Ticket Button */
    delColor: ColorResolvable,
    /** The emoji for the Delete Ticket Button */
    delEmoji: string,
    //Reopen Ticket Button
    /** The color of the Delete Ticket Button */
    openColor: ColorResolvable,
    /**  The emoji for the Delete Ticket Button */
    openEmoji: EmojiResolvable,
    //Other
    /** Timeout which deletes the ticket after 10 minutes to reduce clutter */
    timeout: boolean,
    /** Message sent when a ticket is already opened by the user. */
    cooldownMsg: string
}): Promise<void>;

export declare function embedCreate(message: Message, options?: {
    slash?: boolean
}): Promise<void>;

/** Colors that discord.js support */
type DiscordColor = 'PRIMARY' | 'SECONDARY' | 'SUCCESS' | 'DANGER';
export declare function embedPages(client: Client, message: Message, pages: MessageEmbed[], style?: {
    /** default: ⏪ */
    firstemoji?: EmojiResolvable,
    /** default: ◀️ */
    backemoji?: EmojiResolvable,
    /** default: 🗑️ */
    delemoji?: EmojiResolvable,
    /** default: ▶️ */
    forwardemoji?: EmojiResolvable,
    /** default: ⏩ */
    lastemoji?: EmojiResolvable,

    /** Slash support */
    slash?: boolean,

    /** default: SUCCESS */
    btncolor?: DiscordColor,
    /** default: DANGER */
    delcolor?: DiscordColor, // 
    /** default: PRIMARY */
    skipcolor?: DiscordColor

    /** Turn on/off the Last/First Page Buttons. */
    skipBtn: boolean
}): Promise<void>;

export declare function ghostPing(message: Message, options?: {
    /** default: (*a long message*) */
    embedDesc?: string,
    /** default: #075FFF */
    embedColor?: HexColorString,
    /** default: 'Ghost Ping.' */
    embedFoot?: string
} | { embed: MessageEmbed }): Promise<void>;

export declare function dropdownPages(message: Message, options?: {
    /** Type 1: Send as ephemeral message (invisible message) | Type 2: Edit previous message */
    type?: 1 | 2,
    /** Name that shows when nothing is selected */
    placeHolder?: string,
    /** Slash support */
    slash?: boolean,
    /** Custom rows to send the message with more buttons(only need to be row) */
    rows: MessageActionRow[],
    embed: MessageEmbed,
    data: {
        label: string,
        desc: string,
        emoji?: string,
        embed: MessageEmbed, // embed sent when clicked
    }[]
}): Promise<void>;

export declare function modmail(client: Client, message: Message, options?: {
    /** Message Content outside of the embed, default: ***Support Team*** */
    content?: string,
    /** Support Role ID (also mentions when creating if there is no options.content) */
    role?: string,
    /** Toggle ON/OFF the dm modmail feature, default: true */
    dmToggle?: boolean,
    /** Blacklist users if they are spamming */
    blacklistUser?: string[],
    /** Set Guilds in blacklist zone so you can't create modmails in that guild */
    blacklistGuild?: string[],
    categoryID?: string,
    /** default: #075FFF */
    embedColor?: HexColorString,
    /**  Button Color which discord supports, default: DANGER */
    delColor?: DiscordColor,
    /** Emoji that the button has.. (Emoji ID), default: '❌' */
    delEmoji?: EmojiResolvable,
    /** Give credits to the package by making it true */
    credit?: boolean
}): Promise<any>;

export declare function rankCard(client: Client, message: Message, options?: {
    /**Provide a member into the system (Identifies the member automatically if not provided) */
    member?: User,
    level: number,
    currentXP: number,
    neededXP: number,
    rank: number,
    /** Slash support */
    slash?: boolean,
    /** Background of the rank card */
    background?: string
}): Promise<void>;

export declare function rps(message: Message, options?: {
    embedColor?: HexColorString, // default: #075FFF
    timeoutEmbedColor?: HexColorString, // default: #c90000
    drawEmbedColor?: HexColorString, // default: #075FFF
    winEmbedColor?: HexColorString, // default: #06bd00
    embedFooter?: string,
    rockColor?: ColorResolvable, // default: grey
    paperColor?: ColorResolvable, // default: grey
    scissorsColor?: ColorResolvable, // default: grey
    /** Slash support */
    slash?: boolean,
    /** Credit the package */
    credit?: boolean
}): Promise<any>;

export declare function starboard(client: Client, reaction: MessageReaction | Message, options?: {
    event: 'messageReactionAdd' | 'messageReactionRemove' | 'messageDelete',
    chid: string,
    /** default: #FFC83D */
    embedColor?: ColorResolvable,
    embedFoot?: string,
    /** default: ⭐ */
    emoji?: EmojiResolvable,
    /** inimum stars needed to be on starboard, default: 2 */
    min?: number,
    credit?: boolean
}): Promise<void>;

export declare function stealEmoji(message: Message, args: string[], options?: {
    /**  The Embed Title of the embed which is sent after uploading the emoji, default: `Emoji Added ;)` */
    embedTitle?: string,
    /** The Embed Color of the embed which is sent after uploading the emoji, default: #075FFF; */
    embedColor?: HexColorString,
    /** The Embed Footer of the embed which is sent after uploading the emoji, default: 'Stop stealing.. its illegal.' */
    embedFoot?: string,
    /** The message sent when emoji id is invalid (or) emoji not found, default: "Couldn't find an emoji from it", */
    failedMsg?: string
    credit?: boolean
}): Promise<any>;

export declare function stealSticker(message: Message, args: string[], options?: {
    /**  The Embed Title of the embed which is sent after uploading the emoji, default: `Emoji Added ;)` */
    embedTitle?: string,
    /** The Embed Color of the embed which is sent after uploading the emoji, default: #075FFF; */
    embedColor?: HexColorString,
    /** The Embed Footer of the embed which is sent after uploading the emoji, default: 'Stop stealing.. its illegal.' */
    embedFoot?: string,
    /** The message sent when emoji id is invalid (or) emoji not found, default: "Couldn't find an emoji from it", */
    credit?: boolean
}): Promise<any>;

export declare function suggestBtn(button: ButtonInteraction, users: DB, options?: {
    /**  Emoji for Accept suggestion button (Only Emoji ID), default: ☑️ */
    yesEmoji?: EmojiResolvable,
    /** Color for the Accept Suggestion button, default: green  */
    yesColor?: ColorResolvable,
    /**  Emoji for Reject suggestion button, default: X */
    noEmoji?: EmojiResolvable,
    /** Color for the Reject suggestion button, default: red */
    noColor?: ColorResolvable,
    /** Color for the Rejected Suggestion embed, default: RED */
    denyEmbColor?: ColorResolvable,
    /**  Color for the Accepted Suggestion embed, default: GREEN */
    agreeEmbColor?: ColorResolvable,
}): Promise<void>;

export declare function suggestSystem(client: Client, message: Message, args: string[], options?: {
    chid: string,
    /** Emoji for Accept suggestion button, default: ☑️ */
    yesEmoji?: EmojiResolvable,
    /** Color for the Accept Suggestion button, default: green */
    yesColor?: ColorResolvable,
    /** Emoji for Reject suggestion button, default: X */
    noEmoji?: EmojiResolvable,
    /** Color for the Reject suggestion button, default: red */
    noColor?: ColorResolvable,
    /** Color for the Suggestion embed, defaultL #075FFF */
    embedColor?: HexColorString,
    /** Slash support */
    slash?: boolean,
    /**  Give credits to this package(Boolean[true / false]) Default: true */
    credit?: boolean
}): Promise<void>;

export declare function ticketSystem(message: Message, channel: TextChannel, options?: {
    //Embed
    /** The Description for the Ticket System Embed(Embed that has ticket button that opens a ticket) */
    embedDesc?: string,
    /** The Color of the Ticket System Embed(Embed that has ticket button that opens a ticket) */
    embedColor?: HexColorString,
    /** The Footer for the Ticket System Embed(Embed that has ticket button that opens a ticket) */
    embedFoot?: string,
    /** Give credits to this package(Boolean[true / false]) Default: true */
    credit?: boolean,
    //Buttons
    /** The Emoji for the Ticket Button which opens a ticket */
    emoji?: EmojiResolvable,
    /** The Color for the Ticket Button which opens a ticket. */
    color?: ColorResolvable
}): Promise<any>;

export declare function tictactoe(message: Message, options?: {
    //Embed
    /**  The Embed Foot of the How to play embed */
    embedFoot: string,
    /** The Embed Color of the How to play embed */
    embedColor: HexColorString,
    /**  Give credits to this package (Boolean[true / false]) Default: true */
    credit: boolean
    /** Slash support */
    slash?: boolean,
    //Buttons
    /** Emoji for X user[Player 1] */
    xEmoji: EmojiResolvable,
    /** Emoji for O user[Player 2] */
    oEmoji: EmojiResolvable,
    /** Emoji when the space is not occupied */
    idleEmoji: EmojiResolvable
}): Promise<any>;

export declare function webhooks(client: Client, options?: ({
    /** Channel id where you want to send the message */
    chid: string,
    /** The Message you want to send using webhooks */
    msg: string
} | {
    /** The Embed you want to send using webhooks */
    embed: MessageEmbed
}) & {
    /** The Username of the webhook user */
    username?: string,
    /** The Avatar of the webhook user (Only URL) */
    avatar: string
}): Promise<void>;

export declare function ytNotify(client: Client, db: DB, options?: ({
    /** Youtube channel ID from the URL */
    ytID: string
} | {
    /** Youtube channel URL */
    ytURL: string
}) & {
    /** Discord channel id to post message there */
    chid: string,
    /** This checks if the video is posted after starting the bot. */
    startAt: Date,
    /** Message sent when the youtuber posts a video */
    msg?: string
}): Promise<void>;

export declare function bumpSystem(client: Client, db: DB, options?: {
    event: 'ready' | 'messageCreate'
    /** Message when the event is messageCreate */
    message?: Message,
    /** Channel id of the bump channel */
    chid: string,
    /** Embed that sends when the bump is needed */
    bumpEmbed?: MessageEmbed
/** Embed that sends when someone bumps the server */
    thanksEmbed?: MessageEmbed
}): Promise<any>;
