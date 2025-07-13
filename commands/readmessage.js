const axios = require("axios");
const { getChatworkRoom } = require("../ctr/cwdata");
const { readmessage2 } = require("..ctr/message")

async function read(body, message, messageId, roomId, accountId) {
  try {
    const rooms = await getChatworkRoom()
    for (const room of rooms) {
      if(room.type !== "group") return
      const roomid = room.room_id;
      await readmessage2(roomid)
    };
  } catch (error) {
    console.error("error:", error);
  }
}
module.exports = read;
