const express = require("express");
const router = express.Router();
const supabase = require("../supabase/client");
const { convertQtmetaToHTML } = require("./api");

router.get("/", (req, res) => {
  const rawMessage = `[qtmeta][meta aid=12345 time=1721134260]
これは引用されたメッセージです
[/meta]`;

  const parsedHtml = convertQtmetaToHTML(rawMessage);

  res.render("message", { html: parsedHtml });
});

module.exports = router;
