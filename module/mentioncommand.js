const { DateTime } = require("luxon");
const { sendchatwork } = require("../ctr/message");
const { kengen } = require("../ctr/filter");
const commands = { 
  poker: require("../commands/poker"),
  dice: require("../commands/dice"),
  おみくじ: require("../commands/omikuji"),
  member: require("../commands/randommember"),
  say: require("../commands/say"),
  omikuji: require("../commands/omikujiresult"),
  ポーカー: require("../commands/pokerresult"),
  list: require("../commands/blacklist"),
  messagelink: require("../commands/messagelink"),
  roominfo: require("../commands/roominfo"),
  流し: require("../commands/nagashi"),
  既読: require("../commands/readmessage"),
  発禁: require("../commands/selectblockmember"),
  roomId: require("../commands/getroomid"),
  kengen: kengen,
};
async function command(body, messageId, roomId, accountId) {
  const message = body.replace(/\[To\:9587322\] 暇やねぇ さん|\/.*?\/|\s+/g, "");
  const command = getCommand(body);
  if (command && commands[command]) {
    await commands[command](body, message, messageId, roomId, accountId);
  } else if (command) {
    return;
  }
  if (body.match(/now$/)) {
    await displaynow(body, message, messageId, roomId, accountId);
  }
}
function getCommand(body) {
  const pattern = /\/(.*?)\//;
  const match = body.match(pattern);
  return match ? match[1] : null;
}
//現在の時間を取得
async function displaynow(body, message, messageId, roomId, accountId) {
  const today = DateTime.now().setZone("Asia/Tokyo").toFormat("MM/dd hh:mm:ss");
  sendchatwork(today, roomId);
}
module.exports = command;
