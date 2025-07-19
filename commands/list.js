const supabase = require("../supabase/client");
const { sendchatwork } = require("../ctr/message");
async function List(body, message, messageId, roomId, accountId) {
  try {
    const { data, error } = await supabase
      .from("名前")
      .select("name", { count: "exact", head: false })
      .neq("name", null);

    const uniqueNames = [...new Set(data.map(n => n.name))];
    await sendchatwork(uniqueNames.join("\n"), roomId); 

  } catch(err) {
    console.error(err)
  }
}

module.exports = List
