const express = require("express");
const router = express.Router();
const supabase = require("../supabase/client");

router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("虐")
    .select("*")

  if (error) {
    console.error("Supabase取得エラー:", error);
    return res.status(500).send("データ取得エラー");
  }

  console.log(data)

  const quotes = data.map((q) => ({
    ...q,
    formattedTime: new Date(q.time).toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  res.render("quotes", { quotes });
});

module.exports = router;
