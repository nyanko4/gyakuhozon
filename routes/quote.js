// quote.js
const express = require("express");
const router = express.Router();
const supabase = require("../supabase/client");

router.get("/", async (req, res) => {
  // 引用一覧取得
  const { data: quotes, error: quoteError } = await supabase
    .from("虐")
    .select("*")
    .order("time", { ascending: true });

  if (quoteError) {
    console.error("引用データ取得エラー:", quoteError);
    return res.status(500).send("データ取得エラー");
  }

  // ユーザー情報取得（aid → name）
  const { data: users, error: userError } = await supabase
    .from("名前")
    .select("aid, name");

  if (userError) {
    console.error("ユーザー取得エラー:", userError);
    return res.status(500).send("ユーザーデータ取得エラー");
  }

  // aid => name マップ作成
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

router.get("/search", async (req, res) => {
  const { aid, name } = req.query;

  try {
    // 名前テーブル取得
    const { data: namesData, error: nameError } = await supabase
      .from("名前")
      .select("aid, name");

    if (nameError) {
      console.error("名前テーブル取得エラー:", nameError);
      return res.status(500).send("名前データ取得エラー");
    }

    // aid指定がなければ、nameからaidを特定
    let targetAid = aid;
    if (!targetAid && name) {
      const found = namesData.find((n) => n.name === name);
      if (found) {
        targetAid = found.aid;
      } else {
        return res.render("quotes", { quotes: [] });
      }
    }

    if (!targetAid) {
      return res.status(400).send("aidまたはnameを指定してください");
    }

    // 該当aidの虐データ取得
    const { data: quotesData, error: quoteError } = await supabase
      .from("虐")
      .select("*")
      .eq("aid", targetAid)
      .order("time", { ascending: false });

    if (quoteError) {
      console.error("虐データ取得エラー:", quoteError);
      return res.status(500).send("虐データ取得エラー");
    }

    // 名前マッピング用
    const nameMap = {};
    namesData.forEach((n) => {
      nameMap[n.aid] = n.name;
    });

    const quotes = quotesData.map((q) => ({
      ...q,
      name: nameMap[q.aid] || "不明",
      formattedTime: new Date(q.time * 1000).toLocaleString("ja-JP", {
        timeZone: "Asia/Tokyo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      qtmeta: `[qt][qtmeta aid=${q.aid} time=${q.time}]${q.message}[/qt]`,
    }));

    return res.render("quotes", { quotes, aid, name });

  } catch (err) {
    console.error("サーバー内部エラー:", err);
    return res.status(500).send("内部エラー");
  }
});

module.exports = router;
