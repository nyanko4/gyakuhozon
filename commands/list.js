const supabase = require("../supabase/client");
const { sendchatwork } = require("../ctr/message");

async function List(body, message, messageId, roomId, accountId) {
  try {
    const { data, error } = await supabase
      .from("名前")
      .select("name, aid")
      .neq("name", null);

    if (error) {
      console.error("名前データ取得エラー:", error);
      return;
    }

    // 重複を除く（name + aid が同じなら同一とみなす）
    const unique = new Map();
    data.forEach(({ name, aid }) => {
      if (name && aid && !unique.has(`${name}:${aid}`)) {
        unique.set(`${name}:${aid}`, `${name}（aid: ${aid}）`);
      }
    });

    const messageBody = [...unique.values()].join("\n");
    await sendchatwork(messageBody, roomId);

  } catch (err) {
    console.error("List関数エラー:", err);
  }
}

module.exports = List;
