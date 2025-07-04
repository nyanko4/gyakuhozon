const { isUserAdmin } = require("../ctr/cwdata");
const { sendchatwork } = require("../ctr/message");
//say
async function displaysay(body, message, messageId, roomId, accountId) {
  try {
    const isAdmin = await isUserAdmin(accountId, roomId);
    const m = body.replace("/say/", "");
    if (!isAdmin) {
      await sendchatwork("管理者のみ利用可能です", roomId)
    } else {
      await sendchatwork(m, roomId);
    }
  } catch (error) {
    console.error("errorが発生しました", error);
  }
}
module.exports = displaysay;
