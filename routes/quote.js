// quote.js
const express = require("express");
const router = express.Router();
const supabase = require("../supabase/client");

router.get("/", async (req, res) => {
  // 引用一覧取得
  const { data, error } = await supabase
  .from("虐")
  .select("id, aid, message, time, 名前(name)") // ← 名前テーブルのname列をJOIN
  .order("time", { ascending: true })
  .leftJoin("名前", "aid", "aid"); // 「虐.aid = 名前.aid」


  if (quoteError) {
    console.error("引用データ取得エラー:", quoteError);
    return res.status(500).send("データ取得エラー");
  }

  // 各引用に formattedTime と name を追加
 const quotes = data.map((q) => ({
  ...q,
  name: q.名前?.name || "不明",
  formattedTime: new Date(q.time * 1000).toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }),
  qtmeta: `[qtmeta][meta aid=${q.aid} time=${q.time}]${q.message}[/meta]`,
}));


  res.render("quotes", { quotes: quotes });
});

module.exports = router;
