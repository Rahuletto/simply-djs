import {
	ButtonInteraction,
	Client,
	ColorResolvable,
	CommandInteraction,
	EmojiResolvable,
	Message,
	MessageActionRow,
	MessageEmbed,
	MessageReaction,
	TextChannel,
	User,
	MessageButtonStyle,
	GuildMember
} from 'discord.js'
import { Database } from 'quickmongo'

export type DB = Database

type BtnColor = MessageButtonStyle
type HexColorString = `#${string}` | string

export type btnroleOptions = {
	embed: MessageEmbed
	data: {
		role: string
		label?: string
		color?: HexColorString
		emoji?: EmojiResolvable
	}[]
}
export declare function btnrole(
	client: Client,
	message: Message,
	options?: btnroleOptions
): Promise<void>

export type bumpSystemOptions = {
	event: 'ready' | 'messageCreate'
	message?: Message
	content?: string
	chid: string[]
	bumpEmbed?: MessageEmbed
	thanksEmbed?: MessageEmbed
}
export declare function bumpSystem(
	client: Client,
	db: DB,
	options?: bumpSystemOptions
): Promise<any>

export type calculatorOptions = {
	embedColor: HexColorString
	slash?: boolean
	credit?: boolean
	embedFooter?: string
}
export declare function calculator(
	interaction: CommandInteraction,
	options?: calculatorOptions
): Promise<void>

export type chatbotOptions = {
	chid: string | string[]
	name?: string
	toggle?: boolean
	developer?: string
}
export declare function chatbot(
	client: Client,
	message: Message,
	options?: chatbotOptions
): Promise<void>

export type clickBtnOptions = {
	embedDesc?: string
	ticketname?: string

	pingRole?: string

	db?: DB
	embedColor?: HexColorString
	credit?: boolean

	embed?: MessageEmbed
	logembed?: MessageEmbed
	confirmEmb?: MessageEmbed

	logChannel?: string

	closeColor?: BtnColor
	closeEmoji?: EmojiResolvable

	delColor?: BtnColor
	delEmoji?: EmojiResolvable

	openColor?: BtnColor
	openEmoji?: EmojiResolvable

	trColor?: BtnColor
	trEmoji?: EmojiResolvable

	timeout?: boolean
	cooldownMsg?: string

	role?: string
	categoryID?: string
}
export declare function clickBtn(
	button: ButtonInteraction,
	options?: clickBtnOptions
): Promise<void>

export type embedCreateOptions = {
	slash?: boolean

	embed?: MessageEmbed

	embedFoot?: string
	credit?: boolean
}
export declare function embedCreate(
	message: Message | CommandInteraction,
	options?: embedCreateOptions
): Promise<void>

export type embedPagesOptions = {
	firstEmoji?: EmojiResolvable
	backEmoji?: EmojiResolvable
	delEmoji?: EmojiResolvable
	forwardEmoji?: EmojiResolvable
	lastEmoji?: EmojiResolvable

	/** Slash support */
	slash?: boolean

	btncolor?: BtnColor

	delBtn?: boolean
	delcolor?: BtnColor

	skipBtn: boolean
	skipcolor?: BtnColor

	pgCount: boolean
}
// client argument in the docs, but not in the code
export declare function embedPages(
	message: CommandInteraction,
	pages: MessageEmbed[],
	style?: embedPagesOptions
): Promise<void>
export declare function embedPages(
	message: Message,
	pages: MessageEmbed[],
	style?: embedPagesOptions
): Promise<void>

export type ghostPingOptions =
	| {
			embedDesc?: string
			embedColor?: HexColorString
			embedFoot?: string
			credits?: boolean
			logChannel?: string
	  }
	| { embed: MessageEmbed }
export declare function ghostPing(
	message: Message,
	options?: ghostPingOptions
): Promise<void>

export type giveawaySystemOptions = {
	slash?: boolean

	args: string[]
	prize?: string
	winners?: string
	time?: string
	channel?: TextChannel

	prizeSlash?: string
	winSlash?: string
	timeSlash?: string
	chSlash?: string

	embedTitle?: string //Not in the docs, but in the code
}
export declare function giveawaySystem(
	client: Client,
	db: DB,
	interaction: CommandInteraction,
	options?: giveawaySystemOptions
): Promise<any>
export declare function giveawaySystem(
	client: Client,
	db: DB,
	message: Message,
	options?: giveawaySystemOptions
): Promise<any>

export type dropdownPagesOptions = {
	/** Type 1: Send as ephemeral message (invisible message) | Type 2: Edit previous message */
	type?: 1 | 2
	/** Name that shows when nothing is selected */
	placeHolder?: string //Broken in the docs
	/** Slash support */
	slash?: boolean
	/** Custom rows to send the message with more buttons(only need to be row) */
	rows: MessageActionRow[]
	embed: MessageEmbed
	/** Label of the delete option in menu */
	delLabel?: string
	delOption?: boolean
	/** Description of delete option in menu */
	delDesc?: string
	/** Emoji of Delete Message Button */
	delEmoji?: EmojiResolvable
	data: {
		label: string
		desc: string
		emoji?: string
		embed: MessageEmbed // embed sent when clicked
	}[]
}
export declare function dropdownPages(
	interaction: Message,
	options?: dropdownPagesOptions
): Promise<void>
export declare function dropdownPages(
	interaction: CommandInteraction,
	options?: dropdownPagesOptions
): Promise<void>

export type modmailOptions = {
	/** Message Content outside of the embed, default: ***Support Team*** */
	content?: string
	/** Support Role ID (also mentions when creating if there is no options.content) */
	role?: string
	pingRole?: string

	mailname?: string
	/** Toggle ON/OFF the dm modmail feature, default: true */
	dmToggle?: boolean
	/** Blacklist users if they are spamming */
	blacklistUser?: string[]
	/** Set Guilds in blacklist zone so you can't create modmails in that guild */
	blacklistGuild?: string[]
	categoryID?: string
	/** default: #075FFF */
	embedColor?: HexColorString
	/**  Button Color which discord supports, default: DANGER */
	delColor?: BtnColor
	/** Emoji that the button has.. (Emoji ID), default: '❌' */
	delEmoji?: EmojiResolvable

	trColor?: BtnColor
	trEmoji?: EmojiResolvable
	/** Give credits to the package by making it true */
	credit?: boolean
}
export declare function modmail(
	client: Client,
	message: Message,
	options?: modmailOptions
): Promise<any>

export type rpsOptions = {
	embedColor?: HexColorString // default: #075FFF
	timeoutEmbedColor?: HexColorString // default: #c90000
	drawEmbedColor?: HexColorString // default: #075FFF
	winEmbedColor?: HexColorString // default: #06bd00
	embedFooter?: string //Not in the docs, but in the code
	rockColor?: BtnColor // default: grey
	paperColor?: BtnColor // default: grey
	scissorsColor?: BtnColor // default: grey
	/** Slash support */
	slash?: boolean

	userSlash?: string
	/** Credit the package */
	credit?: boolean
}
export declare function rps(
	message: Message,
	options?: rpsOptions
): Promise<any>
export declare function rps(
	interaction: CommandInteraction,
	options?: rpsOptions
): Promise<any>

export type starboardOptions = {
	event: 'messageReactionAdd' | 'messageReactionRemove' | 'messageDelete'
	chid: string
	/** default: #FFC83D */
	embedColor?: ColorResolvable
	embedFoot?: string //Not in the docs, but in the code
	/** default: ⭐ */
	emoji?: EmojiResolvable
	/** inimum stars needed to be on starboard, default: 2 */
	min?: number
	credit?: boolean
}
export declare function starboard(
	client: Client,
	reaction: Message,
	options?: starboardOptions
): Promise<void>
export declare function starboard(
	client: Client,
	reaction: MessageReaction,
	options?: starboardOptions
): Promise<void>

export type stealEmojiOptions = {
	/**  The Embed Title of the embed which is sent after uploading the emoji, default: `Emoji Added ;)` */
	embedTitle?: string
	/** The Embed Color of the embed which is sent after uploading the emoji, default: #075FFF; */
	embedColor?: HexColorString
	/** The Embed Footer of the embed which is sent after uploading the emoji, default: 'Stop stealing.. its illegal.' */
	embedFoot?: string
	/** The message sent when emoji id is invalid (or) emoji not found, default: "Couldn't find an emoji from it", */
	failedMsg?: string
	credit?: boolean
}
export declare function stealEmoji(
	message: Message,
	args: string[],
	options?: stealEmojiOptions
): Promise<any>

export type stealStickerOptions = {
	/**  The Embed Title of the embed which is sent after uploading the emoji, default: `Emoji Added ;)` */
	embedTitle?: string
	/** The Embed Color of the embed which is sent after uploading the emoji, default: #075FFF; */
	embedColor?: HexColorString
	/** The Embed Footer of the embed which is sent after uploading the emoji, default: 'Stop stealing.. its illegal.' */
	embedFoot?: string
	/** The message sent when emoji id is invalid (or) emoji not found, default: "Couldn't find an emoji from it", */
	credit?: boolean
	slash?: boolean
}
export declare function stealSticker(
	message: Message,
	args: string[],
	options?: stealStickerOptions
): Promise<any>

export type suggestBtnOptions = {
	/**  Emoji for Accept suggestion button (Only Emoji ID), default: ☑️ */
	yesEmoji?: EmojiResolvable
	/** Color for the Accept Suggestion button, default: green  */
	yesColor?: ColorResolvable
	/**  Emoji for Reject suggestion button, default: X */
	noEmoji?: EmojiResolvable
	/** Color for the Reject suggestion button, default: red */
	noColor?: ColorResolvable
	/** Color for the Rejected Suggestion embed, default: RED */
	denyEmbColor?: ColorResolvable
	/**  Color for the Accepted Suggestion embed, default: GREEN */
	agreeEmbColor?: ColorResolvable
}
export declare function suggestBtn(
	button: ButtonInteraction,
	users: DB,
	options?: suggestBtnOptions
): Promise<void>

export type suggestSystemOptions = {
	chid: string
	/** Emoji for Accept suggestion button, default: ☑️ */
	yesEmoji?: EmojiResolvable
	/** Color for the Accept Suggestion button, default: green */
	yesColor?: BtnColor
	/** Emoji for Reject suggestion button, default: X */
	noEmoji?: EmojiResolvable
	/** Color for the Reject suggestion button, default: red */
	noColor?: BtnColor
	/** Color for the Suggestion embed, defaultL #075FFF */
	embedColor?: HexColorString
	denyEmbColor?: HexColorString
	agreeEmbColor?: HexColorString
	/** Slash support */
	slash?: boolean

	sugSlash?: string
	/**  Give credits to this package(Boolean[true / false]) Default: true */
	credit?: boolean
}

export declare function suggestSystem(
	client: Client,
	interaction: Message,
	args: string[],
	options?: suggestSystemOptions
): Promise<void>

export type ticketSystemOptions = {
	//Embed
	/** The Description for the Ticket System Embed(Embed that has ticket button that opens a ticket) */
	embedDesc?: string
	slash?: boolean
	/** The Color of the Ticket System Embed(Embed that has ticket button that opens a ticket) */
	embedColor?: HexColorString
	/** The Footer for the Ticket System Embed(Embed that has ticket button that opens a ticket) */
	embedFoot?: string
	/** Give credits to this package(Boolean[true / false]) Default: true */
	credit?: boolean

	embed?: MessageEmbed
	//Buttons
	/** The Emoji for the Ticket Button which opens a ticket */
	emoji?: EmojiResolvable
	/** The Color for the Ticket Button which opens a ticket. */
	color?: ColorResolvable
}
export declare function ticketSystem(
	message: Message,
	channel: TextChannel,
	options?: ticketSystemOptions
): Promise<any>

export type tictactoeOptions = {
	//Embed
	/**  The Embed Foot of the How to play embed */
	embedFoot: string
	/** The Embed Color of the How to play embed */
	embedColor: HexColorString
	/**  Give credits to this package (Boolean[true / false]) Default: true */
	credit: boolean
	/** Slash support */
	slash?: boolean
	//Buttons
	/** Emoji for X user[Player 1] */
	xEmoji: EmojiResolvable
	/** Emoji for O user[Player 2] */
	oEmoji: EmojiResolvable
	/** Emoji when the space is not occupied */
	idleEmoji: EmojiResolvable

	userSlash?: string

	resultBtn?: boolean
}
export declare function tictactoe(
	message: Message,
	options?: tictactoeOptions
): Promise<any>
export declare function tictactoe(
	interaction: CommandInteraction,
	options?: tictactoeOptions
): Promise<any>

export type betterBtnRoleOptions = {
	type: 'add' | 'remove'
}
export declare function betterBtnRole(
	client: Client,
	interaction: CommandInteraction,
	options: betterBtnRoleOptions
): Promise<void>

export type automemeOptions = {
	chid: string
	subReddits: string[]
	interval: number
	embedColor: HexColorString
}
export declare function automeme(
	client: Client,
	options?: automemeOptions
): Promise<void>

export declare function nqn(message: Message): Promise<void>
