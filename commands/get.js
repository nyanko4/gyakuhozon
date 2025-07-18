const supabase = require("../supabase/client");
const { sendchatwork } = require("../ctr/message");

async function Get(body, messageId, roomId, accountId) {
  try {
    const extractMatches = (regex) =>
      [...body.matchAll(regex)].map((n) => n[0]);

    const type = extractMatches(/\S+(?=,)/g)[0];
    const n = extractMatches(/(?<=,)\S+/g)[0];

    if (type === "名前") {
      await send("name", n, roomId);
    } else if (type === "aid") {
      await send("aid", n, roomId);
    } else {
      console.error("無効なタイプ:", type);
    }
  } catch (err) {
    console.error("Get関数エラー:", err);
  }
}

async function send(t, s, roomId) {
  try {
    let aid = s;

    // 名前からaidを取得する必要がある
    if (t === "name") {
      const { data: nameData, error: nameError } = await supabase
        .from("名前")
        .select("aid")
        .eq("name", s)
        .single();
      
      if (nameError || !nameData) {
        console.error("名前データ取得失敗:", nameError);
        return;
      }
      aid = nameData.aid;
    }

    // 虐テーブルからaidで取得
    const { data: quotes, error: quoteError } = await supabase
      .from("虐")
      .select("*")
      .eq("aid", aid)
      .order("time", { ascending: true });

    if (quoteError || !quotes) {
      console.error("引用データ取得エラー:", quoteError);
      return;
    }

    // メッセージ構築
    let str = "";
    quotes.forEach((q) => {
      str += `[qt][qtmeta aid=${q.aid} time=${q.time}]${q.message}[/qt]\n`;
    });

    if (str) {
      await sendchatwork(str, roomId);
    } else {
      await sendchatwork("該当する引用は見つかりませんでした。", roomId);
    }
  } catch (err) {
    console.error("send関数エラー:", err);
  }
}

module.exports = Get;
