const Discord = require('discord.js')
const parse = new (require("rss-parser"))();


/**
 * @param {Discord.Client} client 
 * @param {import('../index').DB} db 
 * @param {import('../index').ytNotifyOptions} options 
 */
async function ytNotify(client, db, options = []) {
  let startAt = options.startAt
  let chid = options.chid

  if (!chid) throw new Error('EMPTY_CHANNEL_ID. You didnt specify a channel id. Go to https://discord.com/invite/3JzDV9T5Fn to get support');
  if (!options.ytID && !options.ytURL) throw new Error('EMPTY_YT_CHANNEL_ID & EMPTY_YT_CHANNEL_URL. You didnt specify a channel id. Go to https://discord.com/invite/3JzDV9T5Fn to get support');
  try {
    let timer = options.timer || "10000"
    let timr = parseInt(timer)

    if (db.get(`postedVideos`) === null) db.set(`postedVideos`, []);
    setInterval(async () => {

      function URLtoID(url) {
        let id = null
        url = url.replace(/(>|<)/gi, "").split(/(\/channel\/|\/user\/)/);
        if (url[2]) {
          id = url[2].split(/[^0-9a-z_-]/i)[0];
        }
        return id;
      }

      let msg = options.msg || 'Hello ! **{author}** just uploaded a new video **{title}**\n\n*{url}*'

      if (Array.isArray(options.ytID)) {

        options.ytID.forEach((ch) => { checkVid(client, ch, chid, msg, db, startAt) })

      } else if (Array.isArray(options.ytURL)) {

        options.ytID.forEach((ch) => { checkVid(client, URLtoID(ch), chid, msg, db, startAt) })

      } else if (!options.ytID && options.ytURL) {
        ytID = URLtoID(options.ytURL);

        checkVid(client, ytID, chid, msg, db, startAt)
      } else {
        ytID = options.ytID;

        checkVid(client, ytID, chid, msg, db, startAt)
      }

      async function checkVid(client, ytID, chid, msg, db, startAt) {
        parse.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${ytID}`)
          .then(data => {
            if (!data.items || !data.items[0] || !data || data.items === []) return;
            if (db.get(`postedVideos`).includes(data.items[0].link)) return;
            else {
              if (new Date(data.items[0].pubDate).getTime() < startAt) return;

              db.push("postedVideos", data.items[0].link);
              let channel = client.channels.cache.get(chid);
              if (!channel) return;

              let mssg = msg
                .replace(/{author}/g, data.items[0].author)
                .replace(/{title}/g, Discord.Util.escapeMarkdown(data.items[0].title))
                .replace(/{url}/g, data.items[0].link);
              channel.send({ content: mssg })
              console.log('Notified')
            }
          });
      }
    }, timr);
  } catch (err) {
    console.log(`Error Occured. | ytNotify | Error: ${err.stack}`)
  }

}
module.exports = ytNotify;