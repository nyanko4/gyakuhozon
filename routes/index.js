const express = require("express");
const router = express.Router();
const supabase = require("../supabase/client");

router.get("/:aid", async (req, res) => {
  const { aid } = req.params;

  const { data, error } = await supabase
    .from("虐")
    .select("*")
    .eq("aid", aid)
    .single();

  if (error || !data) {
    return res.status(404).send("引用が見つかりませんでした");
  }

  res.render("quote", {
    quote: {
      ...data,
      formattedTime: new Date(data.time).toLocaleString("ja-JP", {
        timeZone: "Asia/Tokyo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  });
});

module.exports = router;
