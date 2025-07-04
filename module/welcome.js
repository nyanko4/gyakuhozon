const supabase = require("../supabase/client");
const { sendchatwork } = require("../ctr/message");
const { getChatworkMembers } = require("../ctr/cwdata");
const { blockMember } = require("../ctr/filter");
//部屋に参加したら送信する
async function welcome(body, messageId, roomId) {
  try {
    if (body.match(/\[info\]\[dtext:chatroom_member_is\]\[piconname:\d+\]\[dtext:chatroom_added\]\[\/info\]/g)) {
      const members = await getChatworkMembers(roomId);
      const welcomeId = (body.match(/\[piconname:(\d+)\]/) || [])[1];
      const { data } = await supabase
        .from("ブラックリスト")
        .select("accountId, 理由, 回数")
        .eq("accountId", welcomeId);
      let reason = "";
      let count = "";
      data.forEach((person) => {
        reason += person.理由;
        count += person.回数;
      });
      if (reason.includes("荒らし") || count >= 4) {
        await blockMember(roomId, welcomeId, "ブラックリストに入っています");
        return
      }
      await sendchatwork(`[rp aid=${welcomeId} to=${roomId}-${messageId}] [pname:${welcomeId}]さん\nよろ〜`,roomId);
    }
  } catch (error) {
    console.error(
      "入室エラー",
      error.response ? error.response.data : error.message
    );
  }
}
module.exports = welcome;
