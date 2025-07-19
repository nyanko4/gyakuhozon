async function Add(body, messageId, roomId, accountId) {
  try {
    const supabase = require("../supabase/client");
const { sendchatwork } = require("../ctr/message");

async function AddQuote(body, messageId, roomId, accountId) {
  try {
    const commandMatch = message.match(/^([^,]+),\[qt\]\[qtmeta aid=(\d+)\s+time=(\d+)\](.*?)\[\/qt\]$/s);
    if (!commandMatch) {
      await sendchatwork("形式が正しくありません。\n名前,[qt][qtmeta aid=xxx time=xxx]メッセージ[/qt] の形式で送ってください。", roomId);
      return;
    }

    const [, name, aid, time, message] = commandMatch;

    // 名前テーブルに保存（aidが既にある場合は更新されない）
    const { error: nameError } = await supabase
      .from("名前")
      .upsert([{ name, aid }], { onConflict: ['aid'] });

    if (nameError) {
      console.error("名前保存エラー:", nameError);
      await sendchatwork("名前の保存に失敗しました。", roomId);
      return;
    }

    // 虐テーブルに保存
    const { error: quoteError } = await supabase
      .from("虐")
      .insert([{ aid, time: Number(time), message }]);

    if (quoteError) {
      console.error("虐保存エラー:", quoteError);
      await sendchatwork("メッセージの保存に失敗しました。", roomId);
      return;
    }

    await sendchatwork("保存しました ✅", roomId);
  } catch (err) {
    console.error("AddQuote関数エラー:", err);
    await sendchatwork("処理中にエラーが発生しました。", roomId);
  }
}

module.exports = AddQuote;

  } catch(err) {
    console.error(err)
  }
}

module.exports = Add
