const express = require("express");
const router = express.Router();
const supabase = require("../supabase/client");

router.get("/", async (req, res) => {
  try {
    // 「虐」テーブル取得
    const { data: quotesData, error: quoteError } = await supabase
      .from("虐")
      .select("*")
      .order("time", { ascending: true });

    if (quoteError) {
      console.error("虐テーブル取得エラー:", quoteError);
      return res.status(500).send("虐データ取得エラー");
    }

    // 「名前」テーブル取得
    const { data: namesData, error: nameError } = await supabase
      .from("名前")
      .select("aid, name");

    if (nameError) {
      console.error("名前テーブル取得エラー:", nameError);
      return res.status(500).send("名前データ取得エラー");
    }

    // aidで名前をマッピング
    const nameMap = {};
    namesData.forEach((n) => {
      nameMap[n.aid] = n.name;
    });

    // 引用データ整形
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

    return res.render("quotes", { quotes });
  } catch (err) {
    console.error("サーバー内部エラー:", err);
    return res.status(500).send("内部エラー");
  }
});

const express = require("express");
const router = express.Router();
const supabase = require("../supabase/client");

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

    return res.render("quotes", { quotes });

  } catch (err) {
    console.error("サーバー内部エラー:", err);
    return res.status(500).send("内部エラー");
  }
});

module.exports = router;
