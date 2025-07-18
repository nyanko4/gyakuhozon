const supabase = require("../supabase/client");
const { sendchatwork } = require("../ctr/message");
async function Get(body, messageId, roomId, accountId) {
  try {
    
  const extractMatches = (regex) =>
      [...body.matchAll(regex)].map((n) => n[0]);
    const type = extractMatches(/\S+(?=,)/g);
    const n = extractMatches(/(?<=,)\S+/g);

    if(type = "名前") {
      await send("name", n)
    } else if(type = "aid") {
      await send("aid", n)
    }
    
async funcrion send() {
  const { data, error } = await supabase
    .from("虐")
    .select("*")
    .eq(t, s)
    .order("time", { ascending: true });
    
    if (error) {
    console.error("引用データ取得エラー:", quoteError);
    return res.status(500).send("データ取得エラー");
  }

    let str = ""
    quotes.map((q) => ({
      str += `[qt][qtmeta aid=${q.aid} time=${q.time}]${q.message}[/qt]`
    }));
    
    await sendchatwork(str, roomId)
}
    
  } catch(err) {
    console.error(err)
  }
}

module.exports = Get
