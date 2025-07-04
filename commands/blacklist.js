const supabase = require("../supabase/client");
const { isUserAdmin } = require("../ctr/cwdata");
const { sendchatwork } = require("../ctr/message");
//ブラックリストを表示する
async function blacklist(body, message, messageId, roomId, accountId) {
  try {
    const isAdmin = await isUserAdmin(accountId, roomId);
    if (!isAdmin) {
      await sendchatwork("管理者のみ利用可能です", roomId);
    } else {
      const { data, error } = await supabase
        .from("ブラックリスト")
        .select("accountId, 理由, 回数, roomId")
        .eq("roomId", roomId);
      if (error) {
        console.error("ブラックリスト取得エラー:", error);
      } else {
        if (data.length === 0) {
          await sendchatwork(
            `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん\nまだブラックリスト入りしてる人はいません`,
            roomId
          );
        } else {
          let messageToSend = `[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん[info][title]ブラックリスト[/title]`;
          data.forEach((item) => {
            messageToSend += `[picon:${item.accountId}] ${item.理由} count:${item.回数}\n`;
          });
          messageToSend += "[/info]";
          await sendchatwork(messageToSend, roomId);
        }
      }
    }
  } catch (error) {
    console.error(
      "エラー:",
      error.response ? error.response.data : error.message
    );
  }
}
module.exports = blacklist
