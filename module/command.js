const commands = {
  取得: requrie("../commands/get.js"),
  追加: require("../commands/add.js"),
  一覧: require("../commands/list.js"),
  削除: require("../commands/delete.js"),
};
async function command(body, messageId, roomId, accountId) {
  const message = body.replace(/\/.*?\/|\s+/g, "");
  const command = getCommand(body);
  if (command && commands[command]) {
    await commands[command](body, message, messageId, roomId, accountId);
  } else if (command) {
    return;
  }
}
function getCommand(body) {
  const pattern = /\/(.*?)\//;
  const match = body.match(pattern);
  return match ? match[1] : null;
}

module.exports = command;
