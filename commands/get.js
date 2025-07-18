const supabase = require("../supabase/client");
const { sendchatwork } = require("../ctr/message");

async function Get(body, message, messageId, roomId, accountId) {
  try {
    const [type, n] = message.split(",").map((s) => s.trim());

    if (type === "名前") {
      await sendByName(n, roomId);
    } else if (type === "aid") {
      await sendByAid(n, roomId);
    } else {
      console.error("無効なタイプ:", type);
    }
  } catch (err) {
    console.error("Get関数エラー:", err);
  }
}

async function sendByName(name, roomId) {
  try {
    const { data: nameData, error: nameError } = await supabase
      .from("名前")
      .select("aid")
      .eq("name", name);

    if (nameError || !nameData || nameData.length === 0) {
      console.error("名前データ取得失敗:", nameError);
      return await sendchatwork("該当する名前は見つかりませんでした。", roomId);
    }

    for (const entry of nameData) {
      await sendByAid(entry.aid, roomId);
    }
  } catch (err) {
    console.error("sendByName関数エラー:", err);
  }
}

async function sendByAid(aid, roomId) {
  try {
    const { data: quotes, error: quoteError } = await supabase
      .from("虐")
      .select("*")
      .eq("aid", aid)
      .order("time", { ascending: true });

    if (quoteError || !quotes || quotes.length === 0) {
      console.error("引用データ取得エラー:", quoteError);
      return await sendchatwork("該当する引用は見つかりませんでした。", roomId);
    }

    // 重複除去
    const seen = new Set();
    let str = "";
    for (const q of quotes) {
      const key = `${q.aid}_${q.time}_${q.message}`;
      if (!seen.has(key)) {
        seen.add(key);
        str += `[qt][qtmeta aid=${q.aid} time=${q.time}]${q.message}[/qt]\n`;
      }
    }

    await sendchatwork(str, roomId);
  } catch (err) {
    console.error("sendByAid関数エラー:", err);
  }
}

module.exports = Get;
