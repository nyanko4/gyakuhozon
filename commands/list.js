const supabase = require("../supabase/client");
async function List(body, message, messageId, roomId, accountId) {
  try {
    const { data, error } = await supabase
      .from("名前")
      .select("name", { count: "exact", head: false })
      .neq("name", null);

    const uniqueNames = [...new Set(data.map(n => n.name))];
    await sendchatwork(uniqueNames, roomId); 

  } catch(err) {
    console.error(err)
  }
}

module.exports = List
