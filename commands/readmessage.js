const axios = require("axios");
const { getChatworkRoom, readmessage2 } = require("../ctr/cwdata");

async function read(body, message, messageId, roomId, accountId) {
  try {
    const rooms = await getChatworkMembers2()
    for (const room of rooms) {
      const roomid = room.room_id;
        await readmessage2(roomid)
    };
  } catch (error) {
    console.error("error:", error);
  }
}
module.exports = read;
