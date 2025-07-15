const { getChatworkRoom } = require("../ctr/cwdata");
const { sendchatwork } = require("../ctr/message");
let str = ""

async function read(body, message, messageId, roomId, accountId) {
  try {
    if(accountId === 9487124) {
    const rooms = await getChatworkRoom()
    for (const room of rooms) {
    if(room.type === "group") {
      const roomid = room.room_id;
      const roomname = room.name;
      str += `${roomname}: ${roomId}\n`
    }
    };
    await sendchatwork(str, roomId)
    }
  } catch (error) {
    console.error("error:", error);
  }
}
module.exports = read;
