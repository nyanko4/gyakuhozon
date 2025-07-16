const axios = require("axios");
const CHATWORK_API_TOKEN = process.env.CWapitoken;

async function getChatworkMembers(roomId) {
  try {
    const response = await axios.get(
      `https://api.chatwork.com/v2/rooms/${roomId}/members`,
      {
        headers: {
          "X-ChatWorkToken": CHATWORK_API_TOKEN,
        },
      }
    );
    const members = response.data;
    return members;
  } catch (error) {
    console.error(
      "Error fetching Chatwork members:",
      error.response?.data || error.message
    );
    return null;
  }
}

async function sendername(accountId, roomId) {
  const members = await getChatworkMembers(roomId);
  if (members) {
    const sender = members.find((member) => member.account_id === accountId);
    return sender ? sender.name : "名前を取得できませんでした";
  }
  return "chatworkユーザー";
}


module.exports = {
  getChatworkMembers,
  getChatworkMembers2,
  getChatworkRoom,
  isUserAdmin,
  sendername,
  fileurl,
  arashi,
};
