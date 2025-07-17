// quote.js
const express = require("express");
const router = express.Router();
const supabase = require("../supabase/client");

router.get("/", async (req, res) => {
  // 引用一覧取得
  const { data: quotes, error: quoteError } = await supabase
    .from("虐")
    .select("*")
    .order("time", { ascending: false });

  if (quoteError) {
    console.error("引用データ取得エラー:", quoteError);
    return res.status(500).send("データ取得エラー");
  }

  const { data: users, error: userError } = await supabase
    .from("名前")
    .select("aid, name");

  if (userError) {
    console.error("ユーザー取得エラー:", userError);
    return res.status(500).send("ユーザーデータ取得エラー");
  }

  const aidToNameMap = {};
  users.forEach(user => {
    aidToNameMap[user.aid] = user.name;
  });

  // 各引用に formattedTime と name を追加
  const enrichedQuotes = quotes.map((q) => ({
    ...q,
    formattedTime: new Date(q.time * 1000).toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    name: aidToNameMap[q.aid] || `不明（aid: ${q.aid}）`,
  }));

  res.render("quotes", { quotes: enrichedQuotes });
});

module.exports = router;
